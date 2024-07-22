import {useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { deleteReviews, getReviews, updateReviews } from "../api/Reviews";

export default function ReviewPage(){
    const user_id = sessionStorage.getItem("user_id")
    const[loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(5)
    const [reviewText, setReviewText] = useState("");
    const [updateToggle, setUpdateToggle] = useState(false)

    useEffect(() => { //replace with call to api once results limited
        setLoading(true);
        const fetchData = async () => { 
         const apiResponse = await getReviews("account", user_id);
         console.log(apiResponse)
         setReviews(apiResponse)
         setLoading(false);
        }
         fetchData(); 
     }, [user_id]); 

     function handleDelete(id) { 
        deleteReviews(id)
        setReviews(prevReviews => prevReviews.filter(e => e[6] !== id))
     }

     function handleUpdateToggle() { 
        setUpdateToggle(!updateToggle)
     }

     function handleUpdate(id) { 
        updateReviews(id, rating, reviewText)
     }

return (
    <div className = "Review List">
        <Navigation/>
        <h1>Review List</h1>
        {loading ? (<p>Loading..</p>) : (
        <div>
            {reviews.length !== 0 ? reviews.map((item) => (
            <>
                <h2 style = {{textAlign : 'Left'}} > Title: {item[0]} Date: {item[3]} Type: {item[4]} Genre: {item[5]}
                </h2>
                <h3 style = {{textAlign : 'Left'}} > Rating: {item[1]}  Review: {item[2]}
                </h3>
                <button onClick = {() => handleDelete(item[6])}> Delete </button>
                <button onClick = {() => handleUpdateToggle()}> Update </button>
                {updateToggle && <div className = "reviewContainer">
                    <form  className = "postReview" onSubmit={() => handleUpdate(item[6])}> 
                    {rating}/10<input type="range" min="0" max="10" defaultValue="5" onInput = {e =>setRating(e.target.value)} class="slider" id="myRange"/>
                        <br/>
                        <textarea onInput = {e => setReviewText(e.target.value)} placeholder='Keyboard Warriors UNITE'></textarea>
                        <button type = "submit">Update!</button>
                    </form>
                </div>}
            </>
            )): (<p>No reviews found</p>)}
        </div>
    )}
    </div>
)
}