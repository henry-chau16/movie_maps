
const backendUrl = 'http://localhost:8000'

export async function createReview(accID, titleID, rating, review){
    try{
        const response = await fetch(backendUrl + `/create/review/${accID}?titleID=${titleID}&rating=${rating}&review=${review}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
}

export async function getReviews(field, id){
    try{
        const response = await fetch(backendUrl + `/create/review/${field}?id=${id}`);
            const data = await response.json();
            return data; 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
}

