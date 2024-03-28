import dbfunctions
import os
import hashlib

def createAccount(accID, username, password):
    hashed_password = encrypt(password)
    command = "INSERT INTO AccountDB(AccountID, Username, Password) VALUES (?,?,?);",
    (accID, username, hashed_password)

    return dbfunctions.SQLConn("television.db", command)

def searchAccountID(username):
    command = "SELECT AccountID FROM AccountsDB WHERE Username = '"+username+"';"

    return dbfunctions.SQLConn("television.db", command)

def verifyLogin(username, password):
    hashed_password = encrypt(password)
    command = "SELECT Password FROM AccountsDB WHERE Username = '"+username+"';"
    pword = dbfunctions.SQLConn("television.db", command)

    if(pword != None):
        if(hashed_password != pword):
            return False
        else:
            return True
        
def getReviews(accountID):
    command = "SELECT Rating, Review FROM RatingsDB WHERE AccountID = " \
        "(SELECT AccountID FROM AccountsDB WHERE AccountID = '"+accountID+"');"
    
    return(dbfunctions.SQLConn("television.db", command))
        
def encrypt(password):
    hash_object = hashlib.sha256()
    hash_object.update(password.encode())
    return hash_object.hexdigest()
