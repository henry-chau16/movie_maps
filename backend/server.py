from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import search_filter
import dbfunctions
import accountfunctions

app = FastAPI()
conn = dbfunctions.dbConnect()

# This middleware is required in order to accept requests from other domains such as a React app
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def getRoot():
    return {"message": "testing root"}

#entering title 
@app.get("/{id}")
def get_title(id: str):
    try: 
        return search_filter.enterTitle(conn, id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot find the title")

#filter
@app.get("/filter/search")
def filter_search(genre: str = "n", startYr: str = "n", endYr: str = "n", titleType: str = "n"):
    try:
        return search_filter.filter(conn, genre, startYr, endYr, titleType)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by genre")

#filter reset
@app.get("/filter/reset")
def reset_filter():
    try:
        return search_filter.clearFilters(conn)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by genre")

#search
@app.get("/search/title/{title}")
def search_title(title: str):
    try:
        print("testing")
        return search_filter.searchTitle(conn, title)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot search by title") 

@app.get("/select/years")
def select_years(startYr: str = Query(...), endYr: str = "n"):
    try:
        return search_filter.selectYears(conn, startYr, endYr)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by years")
    
@app.get("/show/{amount}")
def show_amount(amount: int):
    try:
        return search_filter.showAmount(conn, amount)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot display titles")

@app.get("/search/ratings/{id}")
def search_ratings(id: str):
    try:
        return search_filter.searchRating(conn, id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by years")

@app.get("/fetch/episodes/{id}")
def fetch_episodes(id: str):
    try:
        return (search_filter.listEpisodes(conn, id))
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by years")
        
#users
@app.post("/login")
async def login(request:Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    try:
        if (accountfunctions.verifyLogin(conn, username, password)):
            user_id = accountfunctions.searchAccountID(conn, username)[0][0]
            return {"message": "Login successful", "user_id": user_id}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
    except:
        raise HTTPException(status_code=500, detail="Unable to login.")

@app.post("/register", status_code = 201)
async def register(request:Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    
    try:
        accountfunctions.createAccount(conn, username, password)
    except:
        raise HTTPException(status_code=500, detail="Cannot create the user.")

#reviews

#remove the id in url later
@app.post("/create/review/{accID}")
async def createReview(accID: str, request:Request):
    data = await request.json()
    titleID = data.get("titleID")
    rating = data.get("rating")
    review = data.get("review")

    try:
        return accountfunctions.createReviews(conn, titleID, accID, str(rating), review)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Unable to add review.")

@app.get("/fetch/review/{field}")
def listReviews(field: str, id: str = Query(...)):
    try:
        if(field == "title"):
            return accountfunctions.fetchReviews(conn, id)
        elif(field == "account"):
            return accountfunctions.getUserReviews(conn, id)
        else:
            raise HTTPException(status_code=404, detail="page not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Unable to fetch reviews.")

@app.put("/update/review/{ratingID}")
async def updateReview(ratingID: int, request:Request):
    data = await request.json()
    rating = data.get("rating")
    review = data.get("review")
    try:
        return accountfunctions.updateReview(conn, ratingID, rating, review)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Unable to update reviews.")

@app.delete("/delete/review/{ratingID}")
def deleteReview(ratingID: int):
    try:
        return accountfunctions.deleteReview(conn, ratingID)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Unable to delete reviews.")

if __name__ == "__main__":
    if (dbfunctions.dbExists()): 
        uvicorn.run("server:app", host="localhost", port=8000)
        dbfunctions.dbClose(conn)
    else:
        print("Run accountsinit and dbinit first.")
