
const backendUrl = 'http://localhost:8000'

export async function createReview(accID, titleID, rating, review){
    try{
        const response = await fetch(backendUrl + `/create/review/${accID}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({ 
              titleID: titleID,
              rating: rating,
              review: review
          })
        });
            const data = await response.json();
            if (response.ok) {
              return data; 
            }
            else{
              throw new Error("Failed to create review")
            } 
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
}

export async function getReviews(field, id){
    try{
        const response = await fetch(backendUrl + `/fetch/review/${field}?id=${id}`);
            const data = await response.json();
            if (response.ok) {
              return data; 
            }
            else{
              throw new Error("Failed fetch review(s)")
            }
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
}

export async function updateReviews(ratingID, rating, review){
  try{
      const response = await fetch(backendUrl + `/update/review/${ratingID}?rating=${rating}&review=${review}`);
          const data = await response.json();
          if (response.ok) {
            return data; 
          }
          else{
              throw new Error("Failed to update review")
          }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
}

export async function deleteReviews(ratingID){
  try{
      const response = await fetch(backendUrl + `/delete/review/${ratingID}`);
          const data = await response.json();
          if (response.ok) {
            return data; 
          }
          else{
            throw new Error("Failed to delete review")
          }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
}

