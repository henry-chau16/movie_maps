import gzip
import unicodecsv
import os
import sqlite3


def dbConnect():
    try:
        conn=sqlite3.connect('television.db', check_same_thread=False)
        return conn
    except Exception as e:
        print(e)

def dbClose(conn):
    try:
        conn.commit()
        conn.close()
    except Exception as e:
        print(e)


def dbExists():
    """
    function that checks to see if the television.db file exists in the current working directory
    :return:
    """
    path=os.getcwd()
    if "television.db" in os.listdir():
        return True
    return False

def createTable(conn, eventName, dropIfExists, create, tableFile = "N/A"):
    if (eventName != None):
        eventName.wait()
    try:
        cur=conn.cursor()
        print("-- creating table: "+dropIfExists)
        cur.execute("DROP TABLE IF EXISTS "+dropIfExists)
        cur.execute(create)
    except IOError:
            print("Error opening: "+tableFile)
            return -1
    return 0

def loadTable(conn, eventName, table, tableFile, queries):

    if (eventName != None):
        eventName.wait()
    print("-- loading: "+table)
    try:
        cur=conn.cursor()
        with gzip.open(tableFile, 'rb') as infile:
            reader=unicodecsv.reader(infile,delimiter="\t")
            for line in reader:
                try:
                    queries[table](cur, line)
                except:
                    pass
        conn.commit()
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

def SQLConn(conn, database, command):
    """
    Function to make SQl connection to database and perform passed command.  Opens connection, executes command,
    commits and closes connection.
    :param database: database file to connect to
    :param command: sql command to execute
    :return: result of SQL command
    """
    cur=conn.cursor()
    cur.execute(command)
    result=cur.fetchall()
    #print(result)
    conn.commit()
    return result