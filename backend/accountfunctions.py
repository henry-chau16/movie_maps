import dbfunctions
import os
import hashlib

#TODO: For the triggers make an entry in RatingsDB if it doesn't exist 

def createAccount(conn, username, password):
    salt = generate_salt()
    hashed_password = encrypt(password, salt)
    command = "INSERT INTO AccountsDB(Username, HashPassword, Salt) VALUES ('"+username+"', '"+hashed_password+"', '"+salt+"');"

    return dbfunctions.SQLConn(conn, "television.db", command)

def searchAccountID(conn, username):
    command = "SELECT AccountID FROM AccountsDB WHERE Username = '"+username+"';"

    return dbfunctions.SQLConn(conn, "television.db", command)

def verifyLogin(conn, username, password):
    command = "SELECT HashPassword, Salt FROM AccountsDB WHERE Username = '"+username+"';"
    result = dbfunctions.SQLConn(conn, "television.db", command)

    if(result is not None and len(result) > 0):
        database_password = result[0][0]
        salt = result[0][1]
        hashed_password = encrypt(password, salt) #add in the salt from the database to compare
        
        if database_password == hashed_password:
            return True
    return False

def getUserReviews(conn, accountID):
    command = "SELECT TitleName, Rating, Review, StartYear, TitleType, Genre, RatingID FROM UserRatingsDB u INNER JOIN TelevisionDB t ON u.TitleID = t.TitleID WHERE AccountID = "+str(accountID)+";"
    return(dbfunctions.SQLConn(conn, "television.db", command))

def createReviews(conn, titleID, accountID, rating, review):
    command = "INSERT INTO UserRatingsDB(TitleID, AccountID, Rating, Review) VALUES ('"+titleID+"', '"+accountID+"', '"+rating+"', '"+review+"');"
    return(dbfunctions.SQLConn(conn, "television.db", command))

def fetchReviews(conn, titleID):
    command = "SELECT RatingID, Username, Rating, Review FROM UserRatingsDB u INNER JOIN AccountsDB a ON u.AccountID = a.AccountID WHERE TitleID = '" + titleID + "';"
    return dbfunctions.SQLConn(conn, "television.db", command)

def updateReview(conn, ratingID, rating, review):
    command = "UPDATE UserRatingsDB SET Rating = "+str(rating)+", Review = '"+review+"' WHERE RatingID = "+str(ratingID)+";"
    return dbfunctions.SQLConn(conn, "television.db", command)

def deleteReview(conn, ratingID):
    command = "DELETE FROM UserRatingsDB WHERE RatingID = "+str(ratingID)+";"
    return dbfunctions.SQLConn(conn, "television.db", command)

def generate_salt():
    return os.urandom(16).hex()

def encrypt(password, salt):
    salted_password = password + salt
    hash_object = hashlib.sha256()
    hash_object.update(salted_password.encode())

    return hash_object.hexdigest()



#test
#account creations
#conn = dbfunctions.dbConnect()

#createAccount(conn, "User", "Pass")
#verifyLogin(conn, "User", "Pass")
#userID = searchAccountID(conn, "User") 

#reviews
#createReviews(conn, "tt0002591", str(userID[0][0]), str(10), "slaps") 
#createReviews(conn, "tt0000009", str(userID[0][0]), str(10), "slaps") 
#createReviews(conn, "tt29899777", str(userID[0][0]), str(10), "slaps") 
#updateReview(conn, 1, 7, "Good")
#print(getUserReviews(conn, str(userID[0][0])))
#print(fetchReviews(conn, "tt29899777"))

#dbfunctions.dbClose(conn)