import requests
import threading
import time
import dbfunctions




def loadDB(conn):
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

    queryDict = {
        "episodes" : (
            None,
            "EpisodeDB",
            "CREATE TABLE IF NOT EXISTS EpisodeDB(TitleID TEXT not null,ParentID TEXT not null, SeasonNum INTEGER not null, EpisodeNum INTEGER not null)",
            'title.episode.tsv.gz'
            ),
        "ratings" : (
            None,
            "RatingsDB",
            "CREATE TABLE IF NOT EXISTS RatingsDB(TitleID TEXT unique not null, AccountID TEXT, Rating REAL, Review TEXT)",
            'title.ratings.tsv.gz'
            ),
        "basics" : (
            None,
            "TelevisionDB",
            "CREATE TABLE IF NOT EXISTS TelevisionDB(TitleID TEXT unique not null, TitleName TEXT not null, TitleType TEXT not null, StartYear TEXT, EndYear TEXT, Genre TEXT)",
            'title.basics.tsv.gz'
            )
    }

    insert= {
        "basics": lambda cur, line : 
            cur.execute("INSERT INTO TelevisionDB(TitleID,TitleName,TitleType,StartYear,EndYear,Genre) VALUES (?,?,?,?,?,?);",(line[0],line[2],line[1],line[5],line[6],line[8]))
            if line[1] == 'movie' or line[1] == 'tvSeries' else 0,
        "episodes": lambda cur, line : 
            cur.execute("INSERT INTO EpisodeDB VALUES (?,?,?,?);",(line[0],line[1],line[2],line[3])) if line[2].isdigit() else 0,
        "ratings": lambda cur, line :
            cur.execute("INSERT INTO RatingsDB(TitleID, AccountID, Rating, Review) VALUES(?,?,?,?);",(line[0], "NULL",float(line[1]),"NULL"))
        }


    t1=threading.Thread(target=initTables, args=(conn, queryDict, "episodes", insert))
    t2=threading.Thread(target=initTables, args=(conn, queryDict, "ratings", insert))
    t3=threading.Thread(target=initTables, args=(conn, queryDict, "basics", insert))

    threads = [t1, t2, t3]
    
    for t in threads:
        t.start()
    
    for t in threads:
        t.join()

    print(time.time() - start)
    return

def initTables(conn, queryDict, key, insert):

    dbfunctions.createTable(conn, *queryDict[key])
    dbfunctions.loadTable(conn, queryDict[key][0], key, queryDict[key][3], insert)

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

conn = dbfunctions.dbConnect()
loadDB(conn)
dbfunctions.dbClose(conn)