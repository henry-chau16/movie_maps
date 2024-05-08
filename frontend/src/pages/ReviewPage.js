import {useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { getReviews } from "../api/Reviews";
import { enterTitle } from "../api/ApiFunctions";

export default function ReviewPage(){
    const user_id = localStorage.getItem("user_id")
    const[loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([])



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

return (
    <div className = "Review List">
        <Navigation/>
        <h1>Review List</h1>
        {loading ? (<p>Loading..</p>) : (
        <div>
            {reviews && reviews.map((item) => (
            <>
                <h2 style = {{textAlign : 'Left'}} > Title: {item[0]} {item[3]} Type: {item[4]} Genre: {item[5]}
                </h2>
                <h3 style = {{textAlign : 'Left'}} > Rating: {item[1]}  Review: {item[2]}
                </h3>
            </>
            ))}
        </div>
    )}
    </div>
)
}