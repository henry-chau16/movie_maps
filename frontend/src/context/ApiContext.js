import React, {createContext} from 'react';

/* Creates a context object, which providing values with ApiProvider containing API calls
and passes it to children. Reduces use of props. */

const ApiContext = createContext();

export const ApiProvider = ({children}) => { 
    //insert functions here. later for authentication
    const backendUrl = 'http://localhost:8000'
    //Too much data currently. Try to filter out the movies or just episodes if not possible
    /*
    const displayTitles = async() => { 
        try { 
            const response = await fetch(backendUrl + '/filter/years?startYr=2024');
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    } */

    const searchByTitle = async(searchTitle) => { 
        try { 
            const response = await fetch(backendUrl + `/search/title/${searchTitle}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }

    const enterByTitle = async(titleID) => {
        try { 
            const response = await fetch(backendUrl + `/${titleID}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }

    const contextData = { 
        searchByTitle: searchByTitle,
        enterByTitle: enterByTitle
    }

    return (
        <ApiContext.Provider value ={contextData}>
            {children}
        </ApiContext.Provider>
    )
}