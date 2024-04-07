import requests
import threading
import time
import dbfunctions




def loadDB():
    """
    main function that calls other functions to download the data from the internet, create the database and load data
    into the database. Uses threads for downloading data concurrently, then events letting the functions know the data
    is available
    :return:
    """

    if (dbfunctions.dbExists()):
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

    threads = [t1, t2, t3, t4, t5]
    
    for t in threads:
        t.start()

    queryDict = {
        "episodes" : (
            e1,
            "EpisodeDB",
            "CREATE TABLE EpisodeDB(TitleID TEXT not null,ParentID TEXT not null, SeasonNum INTEGER not null, EpisodeNum INTEGER not null)",
            'title.episode.tsv.gz'
            ),
        "ratings" : (
            e2,
            "RatingsDB",
            "CREATE TABLE RatingsDB(TitleID TEXT unique not null, AccountID TEXT, Rating REAL, Review TEXT)",
            'title.ratings.tsv.gz'
            ),
        "basics" : (
            e3,
            "TelevisionDB",
            "CREATE TABLE TelevisionDB(TitleID TEXT unique not null, TitleName TEXT not null, TitleType TEXT not null, StartYear TEXT, EndYear TEXT, Genre TEXT)",
            'title.basics.tsv.gz'
            ),
        "crew" : (
            e4,
            "CrewDB",
            "CREATE TABLE CrewDB(TitleID TEXT unique not null, DirectorID TEXT)",
            'title.crew.tsv.gz'
            ),
        "people" : (
            e5,
            "PeopleDB",
            "CREATE TABLE PeopleDB(PersonID TEXT unique not null, Name Text not null, Professions TEXT, WorkedIn TEXT)",
            'name.basics.tsv.gz'
            )
    }

    insert= {
        "basics": lambda cur, line : 
            cur.execute("INSERT INTO TelevisionDB(TitleID,TitleName,TitleType,StartYear,EndYear,Genre) VALUES (?,?,?,?,?,?);",(line[0],line[2],line[1],line[5],line[6],line[8]))
            if line[1] != 'short' and line[1] != 'tvEpisode' else 0,
        "episodes": lambda cur, line : 
            cur.execute("INSERT INTO EpisodeDB VALUES (?,?,?,?);",(line[0],line[1],line[2],line[3])) if line[2].isdigit() else 0,
        "ratings": lambda cur, line :
            cur.execute("INSERT INTO RatingsDB(TitleID, AccountID, Rating, Review) VALUES(?,?,?,?);",(line[0], "N/A",float(line[1]),"N/A")),
        "crew": lambda cur, line :
            cur.execute("INSERT INTO CrewDB(TitleID, DirectorID) VALUES(?,?);", (line[0], line[1])),
        "people": lambda cur, line :
            cur.execute("INSERT INTO PeopleDB(PersonID, Name, Professions, WorkedIn) VALUES(?,?,?,?);", (line[0], line[1], line[4], line[5]))
        }


    for key in queryDict:
        dbfunctions.createTable(*queryDict[key])
        dbfunctions.loadTable(queryDict[key][0], key, queryDict[key][3], insert)

    for t in threads:
        t.join()

    


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


loadDB()
