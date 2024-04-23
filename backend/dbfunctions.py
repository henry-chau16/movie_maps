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

def createTable(conn, eventName, tableName, create, tableFile = "N/A"):
    if (eventName != None):
        eventName.wait()
    try:
        cur=conn.cursor()
        print("-- creating table: "+tableName)
        dropTable(conn, None, tableName)
        cur.execute(create)
    except IOError:
            print("Error creating: "+tableName)
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

def dropTable(conn, eventName, tableName):
    if (eventName != None):
        eventName.wait()
    try:
        cur=conn.cursor()
        cur.execute("DROP TABLE IF EXISTS "+tableName)
        print("-- deleting table: "+ tableName)
    except IOError:
            print("Error deleting: "+tableName)
            return -1
    return 0

def addRow(conn, table, fields, valueString):

    input = "INSERT INTO "+table+"("+fields+") VALUES ("+valueString+");"
    return sqlDML(conn, input)

def deleteRow(conn, table, field, value):

    input = "DELETE FROM "+table+" WHERE "+field +" = "+value+";"
    return sqlDML(conn, input)

def updateRow(conn, table, updateField, updateValue, field, value):
    input = "UPDATE "+table+" SET "+updateField+" = "+updateValue+ " WHERE "+field+" = "+value+";"
    return sqlDML(conn, input)


def cleanEpisodeDB():
    """
    function to delete all records in the episode DB which do not have associated ratings data
    :return:
    """
    command="delete from EpisodeDB where titleID not in (select distinct titleID from RatingsDB)"
    SQLConn("television.db",command)

def sqlDML(conn, input):
    try:
        cur=conn.cursor()
        cur.execute(input)
        conn.commit()
    except IOError:
        print("Error processing query: "+ input)
        return -1
    return 0

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