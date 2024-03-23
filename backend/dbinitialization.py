import gzip
import unicodecsv
import requests
import threading
import time
import os
import sqlite3


def dbExists():
    """
    function that checks to see if the television.db file exists in the current working directory
    :return:
    """
    path=os.getcwd()
    if "television.db" in os.listdir():
        return True
    return False

def loadDB():
    """
    main function that calls other functions to download the data from the internet, create the database and load data
    into the database. Uses threads for downloading data concurrently, then events letting the functions know the data
    is available
    :return:
    """

    if (dbExists()):
        proceed=""
        while proceed.upper().strip() not in ('Y','N'):
            proceed=input("The television series database is already available in your directory.  Do you want to update it? (Y/N)")
        if (proceed.upper().strip() == 'N'):
            return


    start=time.time()
    e1=threading.Event()
    e2=threading.Event()
    e3=threading.Event()
    e4=threading.Event()
    e5=threading.Event()

    t1=threading.Thread(target=downloadFile, args=("https://datasets.imdbws.com/title.episode.tsv.gz", "title.episode.tsv.gz",e1))
    t2=threading.Thread(target=downloadFile, args=("https://datasets.imdbws.com/title.ratings.tsv.gz", "title.ratings.tsv.gz",e2))
    t3=threading.Thread(target=downloadFile, args=("https://datasets.imdbws.com/title.basics.tsv.gz", "title.basics.tsv.gz",e3))
    t4=threading.Thread(target=downloadFile, args=("https://datasets.imdbws.com/title.crew.tsv.gz", "title.crew.tsv.gz", e4))
    t5=threading.Thread(target=downloadFile, args=("https://datasets.imdbws.com/name.basics.tsv.gz", "name.basics.tsv.gz", e5))
    
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t5.start()

    queryDict = {
        "episodes" : ("EpisodeDB",
            "CREATE TABLE EpisodeDB(TitleID TEXT not null,ParentID TEXT not null, SeasonNum INTEGER not null, EpisodeNum INTEGER not null)",
            'title.episode.tsv.gz',
            "episodes"
            ),
        "ratings" : ("RatingsDB",
            "CREATE TABLE RatingsDB(TitleID TEXT unique not null, Rating REAL)",
            'title.ratings.tsv.gz',
            "ratings"
            ),
        "basics" : ("TelevisionDB",
            "CREATE TABLE TelevisionDB(TitleID TEXT unique not null, TitleName TEXT not null, TitleType TEXT not null, StartYear TEXT, EndYear TEXT, Genre TEXT)",
            'title.basics.tsv.gz',
            "basics"
            ),
        "crew" : ("CrewDB",
            "CREATE TABLE CrewDB(TitleID TEXT unique not null, DirectorID TEXT)",
            'title.crew.tsv.gz',
            "crew"
            ),
        "people" : ("PeopleDB",
            "CREATE TABLE PeopleDB(PersonID TEXT unique not null, Name Text not null, Professions TEXT, WorkedIn TEXT)",
            'name.basics.tsv.gz',
            "people"
            )
    }
    loadTable(e1, *queryDict["episodes"])
    loadTable(e2, *queryDict["ratings"])
    loadTable(e3, *queryDict["basics"])
    loadTable(e4, *queryDict["crew"])
    loadTable(e5, *queryDict["people"])

    t1.join()
    t2.join()
    t3.join()
    t4.join()
    t5.join()
    cleanEpisodeDB()


    print(time.time() - start)
    return

def downloadFile(fileURL,fileName,eventName):
    """
    function to download a file and write the file to disk
    :param fileURL: IMDB URL
    :param fileName: name file will be called on hard disk
    :param eventName: which event to trigger when done
    :return:
    """
    try:
        reqFile=requests.get(fileURL)
        with open(fileName,"wb") as fh:
            fh.write(reqFile.content)
        eventName.set()
    except FileNotFoundError:
        print ("{:s} not found".format(fileURL))
        return 404

def loadTable(eventName, dropIfExists, createTable, tableFile, table):

    insert= {
        "basics": lambda cur, line : 
            cur.execute("INSERT INTO TelevisionDB(TitleID,TitleName,TitleType,StartYear,EndYear,Genre) VALUES (?,?,?,?,?,?);",(line[0],line[2],line[1],line[5],line[6],line[8])),
        "episodes": lambda cur, line : 
            cur.execute("INSERT INTO EpisodeDB VALUES (?,?,?,?);",(line[0],line[1],line[2],line[3])) if line[2].isdigit() else 0,
        "ratings": lambda cur, line :
            cur.execute("INSERT INTO RatingsDB(TitleID,Rating) VALUES(?,?);",(line[0],float(line[1]))),
        "crew": lambda cur, line :
            cur.execute("INSERT INTO CrewDB(TitleID, DirectorID) VALUES(?,?);", (line[0], line[1])),
        "people": lambda cur, line :
            cur.execute("INSERT INTO PeopleDB(PersonID, Name, Professions, WorkedIn) VALUES(?,?,?,?);", (line[0], line[1], line[4], line[5]))
        }

    eventName.wait()
    try:
        conn=sqlite3.connect('television.db')
        cur = conn.cursor()
        cur.execute("DROP TABLE IF EXISTS "+dropIfExists)
        cur.execute(createTable)
        with gzip.open(tableFile, 'rb') as infile:
            reader=unicodecsv.reader(infile,delimiter="\t")
            for line in reader:
                try:
                    insert[table](cur, line)
                except:
                    pass
        conn.commit()
        conn.close()
    except IOError:
            print("Error opening: "+tableFile)
            return -1
    return 0

def cleanEpisodeDB():
    """
    function to delete all records in the episode DB which do not have associated ratings data
    :return:
    """
    command="delete from EpisodeDB where titleID not in (select distinct titleID from RatingsDB)"
    SQLConn("television.db",command)

def SQLConn(database, command):
    """
    Function to make SQl connection to database and perform passed command.  Opens connection, executes command,
    commits and closes connection.
    :param database: database file to connect to
    :param command: sql command to execute
    :return: result of SQL command
    """
    conn=sqlite3.connect(database)
    cur=conn.cursor()
    cur.execute(command)
    result=cur.fetchall()
    #print(result)
    conn.commit()
    conn.close()
    return result

loadDB()
