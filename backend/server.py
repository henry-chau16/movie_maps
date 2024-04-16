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
@app.get("/filter/genre/{genre}")
def filter_genre(genre: str):
    try:
        return search_filter.filterGenre(conn, genre)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by genre")

@app.get("/filter/years")
def filter_years(startYr: str = Query(...), endYr: str = "n"):
    try:
        return search_filter.filterYears(conn, startYr, endYr)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot filter by years")
    
#search
@app.get("/search/title/{title}")
def search_title(title: str):
    try:
        print("testing")
        return search_filter.searchTitle(conn, title)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot search by title") 

@app.get("/search/crew/{crew}")
def search_crew(crew: str):
    try:
        return search_filter.searchCrew(conn, crew)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot search by crew")
        

#reviews
''' Create, read, update, delete 
@app.post("/review/create)

@app.get("/review/{id})
'''

#users
@app.post("/login")
async def login(request:Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    try:
        if (accountfunctions.verifyLogin(username, password)):
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
    except:
        raise HTTPException(status_code=500, detail="Unable to register.")

@app.post("/register", status_code = 201)
async def register(request:Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    
    try:
        accountfunctions.createAccount(username, password)
    except:
        raise HTTPException(status_code=500, detail="Cannot create the user.")
    

if __name__ == "__main__":
    uvicorn.run("server:app", host="localhost", port=8000)
    dbfunctions.dbClose(conn)
