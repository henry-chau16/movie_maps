import sqlite3

def filterGenre(conn, genres):
    """
    Function to filter by genre in televisionDB table for search value
    :param genres: list to match to genres
    :return: list of TVseries  tuple data matching the search criteria sorted by titleName.
    Tuples consist of titleID, titleName, startYear, endYear, genre
    """
    gen=genres.strip()

    command="Select titleID, titleName,startYear,endYear, genre " \
            "from TelevisionDB t " \
            "where "
    
    genres = gen.split(',')
    genre_conditions = []
    for genre in genres:
        genre_conditions.append("genre LIKE '%{:s}%'".format(genre.strip()))
    
    command += " OR ".join(genre_conditions) 

    command=command + " order by titleName LIMIT 50"
    return SQLConn(conn, "television.db",command)

def filterYears(conn, startYr, endYr):
    """
    Function to filter by years in televisionDB table by start and end year.
    :param startYr: int to match to startYear endYr: int to match to endYear
    :return: list of TVseries tuple data matching the search criteria sorted by titleName.
    Tuples consist of titleID, titleName, startYear, endYear, genres
    """
    print(startYr, endYr)
    if (endYr != "n"):
        command = "Select titleID, titleName,startYear,endYear, genre " \
            "from TelevisionDB t " \
            "where startYear = '{sY}' and endYear = '{eY}' order by titleName".format(sY = startYr, eY = endYr)
    else:
        command = "Select titleID, titleName,startYear,endYear, genre " \
            "from TelevisionDB t " \
            "where startYear = '{sY}' order by titleName LIMIT 50".format(sY = startYr)
        
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
            "from TelevisionDB " \
            "where TitleName like '%{:s}%'".format(sv)
    command=command + " order by titleName LIMIT 50"
    return SQLConn(conn, "television.db",command)

def enterTitle(conn, titleID): 
    id = titleID.strip()
    command = "Select * from TelevisionDB where TitleID = '{id}'".format(id = id)
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