import dbfunctions

def accountinit(conn):
    tables = {
        "accounts" : (
                None,
                "AccountsDB",
                "CREATE TABLE IF NOT EXISTS AccountsDB(AccountID INTEGER PRIMARY KEY unique not null, Username TEXT unique not null, HashPassword TEXT unique not null, Salt TEXT not null)",
                ),
        "userRatings": (
                None,
                "UserRatingsDB",
                "CREATE TABLE IF NOT EXISTS UserRatingsDB(RatingID INTEGER PRIMARY KEY unique not null, AccountID INTEGER not null, TitleID TEXT not null, Rating REAL not null, Review TEXT, FOREIGN KEY (AccountID) REFERENCES accounts(AccountID))"
            )
        }
    triggers = { 
        "enterNewRatings" : (
            "enterNewRatingsTrigger",
            "AFTER",
            "INSERT",
            "UserRatingsDB",
            "WHEN NOT EXISTS (SELECT * FROM RatingsDB WHERE TitleID = NEW.TitleID) BEGIN INSERT INTO RatingsDB(TitleID, Rating, NumVotes) VALUES(NEW.TitleID, NEW.Rating, 1); END"
        ),
        "insertRatings": (
            "InsertRatingsTrigger",
            "AFTER",
            "INSERT",
            "UserRatingsDB",
            "BEGIN UPDATE RatingsDB SET Rating = (Rating * NumVotes + NEW.Rating) / (NumVotes + 1), NumVotes = NumVotes + 1 WHERE TitleID = NEW.TitleID; END"
        ),
        "editRatings" : (
            "EditRatingsTrigger",
            "AFTER",
            "UPDATE",
            "UserRatingsDB",
            "WHEN (OLD.Rating <> NEW.Rating) BEGIN UPDATE RatingsDB SET Rating = (Rating * NumVotes + NEW.Rating - OLD.Rating) / (NumVotes) WHERE TitleID = NEW.TitleID; END"
        ),
        "deleteRatings" : (
            "DeleteRatingsTrigger",
            "AFTER",
            "DELETE",
            "UserRatingsDB",
            "BEGIN UPDATE RatingsDB SET Rating = (Rating * NumVotes - OLD.Rating) / (NumVotes - 1), NumVotes = NumVotes - 1 WHERE TitleID = OLD.TitleID; END"
        )
    }
    try:
        for key in tables:
            print("passing:", *tables[key])
            dbfunctions.createTable(conn, *tables[key])
        for key in triggers:
            print("passing:", *triggers[key])
            dbfunctions.createTrigger(conn, *triggers[key])
        
    except Exception as e:
        print(e)

conn = dbfunctions.dbConnect()
accountinit(conn)
dbfunctions.dbClose(conn)