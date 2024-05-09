import { useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useEffect, useState } from 'react';
import { enterTitle, getRating } from "../api/ApiFunctions"
import { getReviews, createReview } from "../api/Reviews"

//@TODO: Fix the post reviews
export default function EpisodesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get("parentId")
  const episodeId = searchParams.get("episodeId")
  const episodeNum = searchParams.get("episodeNum")
  const season = searchParams.get("season")
  
  const [titleInfo, setTitleInfo] = useState({});
  const [ratingInfo, setRatingInfo] = useState([]); 
  const [userReviews, setUserReviews] = useState([]); 
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("");

  const[loading, setLoading] = useState(false);

  async function fetchTitleInfo() {
    const apiResponse = await enterTitle(parentId);
    setTitleInfo(apiResponse[0]);
  }
  async function fetchRatingInfo() { 
    const apiResponse = await getRating(episodeId);
    if (apiResponse.length === 0) { 
      setRatingInfo(["N/A", "N/A"])
    }
    else { 
      setRatingInfo(apiResponse[0]);
    }
  }
  
  async function fetchUserReviews() { 
    const apiResponse = await getReviews("title", episodeId);
    console.log("review info", apiResponse)
    if (apiResponse.length > 0) { 
      setUserReviews(apiResponse);
    }
  } 

  useEffect(() => {
    setLoading(true);
    fetchTitleInfo();
    fetchUserReviews(); 
    fetchRatingInfo(); 
    setLoading(false);
    }, [parentId]); 

  useEffect(() => {
    setLoading(true);
    fetchUserReviews(); 
    fetchRatingInfo(); 
    setLoading(false);
    }, [ rating, reviewText]); 


   async function postReview(e){
    e.preventDefault();
    console.log(localStorage.getItem("user_id"), episodeId, rating, reviewText)
    createReview(localStorage.getItem("user_id"), episodeId, rating, reviewText)
  } 
  return (
    <div>
      <Navigation/>
      {loading ? (<p>Loading</p>) : (
        <>
        <div className = "Show Info">
          <h1>{titleInfo[1]}</h1>
          <p>Release Date: {titleInfo[3]}</p>
          <p>Genre: {titleInfo[5]}</p> 
          <p>Rating: {ratingInfo[0]} </p>
          <p> Votes: {ratingInfo[1]}</p>
        </div>
        <div> 
            <h2>Episode: {episodeNum} - Season {season} </h2>
        </div>
        <div className = "userReviews"> 
          <h2>User Reviews: </h2>
          <div>
            <form onSubmit = {postReview}> 
             <input type="range" min="0" max="10" defaultValue="5" onInput = {e =>setRating(e.target.value)} class="slider" id="myRange"/> {rating}/10
             <br/>
             <textarea onInput = {e => setReviewText(e.target.value)}>Keyboard Warriors UNITE</textarea>
             <button type = "submit">Post!</button>
            </form>
          </div>
          <div>
            {userReviews && userReviews.map((reviews) => (
              <div key={reviews[0]}>
              <p>Username: {reviews[1]}</p>
              <p>Rating: {reviews[2]}</p>
              <p>{reviews[3]}</p>
              </div>
            ))}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
