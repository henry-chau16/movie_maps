import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { createReview } from '../api/Reviews';

export default function AddReview ({watchId, isEpisode}) { 
    const [rating, setRating] = useState(5)
    const [reviewText, setReviewText] = useState("");
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setLogIn] = useState(false);

    useEffect(() => {
        setUserId(sessionStorage.getItem("user_id"))
        if(userId != null){
        setLogIn(true)
        }
    }, [userId]);

    function handlePostReview(e) {
        if (isEpisode) {
            e.preventDefault();
        }
        createReview(userId, watchId, rating, reviewText);
    }

    return (
    <div className = "reviewContainer"> 
        {isLoggedIn ? ( 
            <form className = "postReview" onSubmit = {handlePostReview}> 
            {rating}/10 <input type="range" min="0" max="10" defaultValue="5" onInput = {e =>setRating(e.target.value)} class="slider" id="myRange"/> 
            <br/>
            <textarea onInput = {e => setReviewText(e.target.value)} placeholder='Keyboard Warriors UNITE'></textarea>
            <button type = "submit">Post!</button>
            </form>
        ): (
            <button><Link to = "/login">Login to post reviews! </Link></button>
        )}
    </div>
    )
}
