
    const backendUrl = 'http://localhost:8000'
//initial homepage
    export async function displayTitles() {
        try { 
            const response = await fetch(backendUrl + '/select/years?startYr=2024');
            const data = await response.json();
            if (response.ok) {
                return data; 
            }
            else{
                throw new Error("Display query failed")
            }
            
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    } 
//search by titleName substring
    export async function searchByTitle(searchTitle) { 
        try { 
            const response = await fetch(backendUrl + `/search/title/${searchTitle}`);
            const data = await response.json();
            if (response.ok) {
                return data; 
            }
            else{
                throw new Error("Failed to search by title substring")
            }
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }
//search by titleID (EXACT)
    export async function enterTitle(titleID) {
        try { 
            const response = await fetch(backendUrl + `/${titleID}`);
            const data = await response.json();
            if (response.ok) {
                return data; 
            }
            else{
                throw new Error("Failed request")
            } 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }

//search by year (EXACT)
export async function selectYears(start, end) {
    try { 
        const response = await fetch(backendUrl + `/select/years?startYr=${start}&endYr=${end}`);
        const data = await response.json();
        if (response.ok) {
            return data; 
        }
        else{
            throw new Error("Failed to search by year")
        }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

//search average Rating and number of votes by titleID (EXACT)
export async function getRating(id) {
    try { 
        const response = await fetch(backendUrl + `/search/ratings/${id}`);
        const data = await response.json();
        if (response.ok) {
            return data; 
        }
        else{
            throw new Error("Failed to retrieve rating info")
        }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

//list episodes by titleID (EXACT)
export async function listEpisodes(id) {
    try { 
        const response = await fetch(backendUrl + `/fetch/episodes/${id}`);
        const data = await response.json();
        if (response.ok) {
            return data; 
        }
        else{
            throw new Error("Failed to retrieve episodes")
        }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

//set filters for search
export async function filter(genre = "n", start = "n", end = "n", type = "n") {
    console.log(backendUrl + `/filter/search?genre=${genre}&startYr=${start}&endYr=${end}&titleType=${type}`)
    try { 
        const response = await fetch(backendUrl + `/filter/search?genre=${genre}&startYr=${start}&endYr=${end}&titleType=${type}`);
        const data = await response.json();
        if (response.ok) {
            return data; 
        }
        else{
            throw new Error("Failed to apply filters")
        } 
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } 
}

//clear filters
export async function clearFilter() {
    try { 
        const response = await fetch(backendUrl + '/filter/reset');
        const data = await response.json();
        if (response.ok) {
            return data; 
        }
        else{
            throw new Error("Failed to remove filter")
        } 
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}
