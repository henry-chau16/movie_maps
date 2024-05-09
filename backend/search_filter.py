import sqlite3
import dbfunctions

def filter(conn, genres, start, end, titleType):
    """
    Function to filter by genre in televisionDB table for search value
    :param genres: list to match to genres
    :return: list of TVseries  tuple data matching the search criteria sorted by titleName.
    Tuples consist of titleID, titleName, startYear, endYear, genre
    """
    SQLConn(conn, "television.db", "Drop view if exists Filters;")

    command="Select titleID, titleName,startYear,endYear, genre " \
            "from TelevisionDB t " \
            "where "
    if(genres != "n"):
        gen=genres.strip()
        genreList = gen.split(',')
        genre_conditions = []
        for genre in genreList:
            genre_conditions.append("genre LIKE '%{:s}%'".format(genre.strip()))
        
        command += " OR ".join(genre_conditions) 
    
    if (start != "n" and end != "n"):
        if(genres != "n"):
            command+= " and"
        command += " startYear between "+start+" and "+end
    elif (start != "n" and end == "n"):
        if(genres != "n"):
            command+= " and"
        command += " startYear >= "+start
    elif (start == "n" and end != "n"):
        if(genres != "n"):
            command+= " and"
        command += " startYear <= "+end

    if(titleType != "n"):
        if(genres != "n" or start != "n" or end != "n"):
            command += " and"
        command += " TitleType = '"+titleType+"'"

    command = "Create view Filters as " + command + ";"
    print(command)
    return SQLConn(conn, "television.db",command)

def clearFilters(conn):
    SQLConn(conn, "television.db", "Drop view if exists Filters;")
    SQLConn(conn, "television.db", "Create view Filters as Select * from TelevisionDB;")

def selectYears(conn, startYr, endYr):
    """
    Function to filter by years in televisionDB table by start and end year.
    :param startYr: int to match to startYear endYr: int to match to endYear
    :return: list of TVseries tuple data matching the search criteria sorted by titleName.
    Tuples consist of titleID, titleName, startYear, endYear, genres
    """
    print(startYr, endYr)
    if (endYr != "n"):
        command = "Select * " \
            "from Filters " \
            "where startYear = {sY} and endYear = {eY} order by titleName".format(sY = startYr, eY = endYr)
    else:
        command = "Select * " \
            "from Filters " \
            "where startYear = {sY} order by titleName LIMIT 50".format(sY = startYr)
    print(command)
    return SQLConn(conn, "television.db", command)

def searchTitle(conn, searchValue):
    """
    Function to search titleName in televisionDB table for search value
    :param searchValue: string to match to titleName
    :return: list of TVseries  tuple data matching the search criteria sorted by titleName.
    Tuples consist of titleID, titleName, startYear, endYear, genres
    """
    sv=searchValue.strip()

    command="Select * " \
            "from Filters " \
            "where TitleName like '%{:s}%'".format(sv)
    command=command + " order by titleName LIMIT 50"
    return SQLConn(conn, "television.db",command)

def showAmount(conn, amount):
    command = "Select * from Filters order by TitleName LIMIT "+str(amount)+";"
    return SQLConn(conn, "television.db", command)

def enterTitle(conn, titleID): 
    id = titleID.strip()
    command = "Select * from TelevisionDB where TitleID = '{id}'".format(id = id)
    return SQLConn(conn, "television.db",command)

def listEpisodes(conn, titleID):
    id = titleID.strip()
    command = "Select EpisodeID, EpisodeNum, SeasonNum FROM EpisodeDB where ParentID = '"+id+"' order by SeasonNum asc, EpisodeNum asc;"
    print(command)
    return SQLConn(conn, "television.db",command)

def searchRating(conn, titleID):
    id = titleID.strip()
    command = "Select Rating, NumVotes FROM RatingsDB where TitleID = '"+id+"';"
    return SQLConn(conn, "television.db",command)

def SQLConn(conn, database, command):
    """
    Function to make SQl connection to database and perform passed command.  Opens connection, executes command,
    commits and closes connection.
    :param database: database file to connect to
    :param command: sql command to execute
    :return: result of SQL command
    """
    try:
        cur=conn.cursor()
        cur.execute(command)
        result=cur.fetchall()
        #print(result)
        conn.commit()
        return result
    except Exception as e:
        print (e)


conn = dbfunctions.dbConnect()
clearFilters(conn)


dbfunctions.dbClose(conn)
