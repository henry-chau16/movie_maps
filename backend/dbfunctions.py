import gzip
import unicodecsv
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

def createTable(eventName, dropIfExists, create, tableFile = "N/A"):
    if (eventName != None):
        eventName.wait()
    try:
        conn=sqlite3.connect('television.db')
        cur = conn.cursor()
        print("connection established -- creating table: "+dropIfExists)
        cur.execute("DROP TABLE IF EXISTS "+dropIfExists)
        cur.execute(create)
    except IOError:
            print("Error opening: "+tableFile)
            return -1
    return 0

def loadTable(eventName, table, tableFile, queries):

    if (eventName != None):
        eventName.wait()
    conn=sqlite3.connect('television.db')
    cur = conn.cursor()
    print("connection established -- loading: "+table)
    try:
        with gzip.open(tableFile, 'rb') as infile:
            reader=unicodecsv.reader(infile,delimiter="\t")
            for line in reader:
                try:
                    queries[table](cur, line)
                except:
                    pass
        conn.commit()
        conn.close()
    except IOError:
        print("Error loading: "+tableFile)
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