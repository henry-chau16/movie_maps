//Context not needed here, use it for authentication instead

    const backendUrl = 'http://localhost:8000'

    export async function displayTitles(searchTitle) {
        try { 
            const response = await fetch(backendUrl + '/filter/years?startYr=2024');
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    } 

    export async function searchByTitle(searchTitle) { 
        try { 
            const response = await fetch(backendUrl + `/search/title/${searchTitle}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }

    export async function enterTitle(titleID) {
        try { 
            const response = await fetch(backendUrl + `/${titleID}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }