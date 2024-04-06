//Context not needed here, use it for authentication instead

export default function ApiFunctions() { 
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

    const enterTitle = async(titleID) => {
        try { 
            const response = await fetch(backendUrl + `/${titleID}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
    }
}