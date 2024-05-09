import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useEffect, useState } from 'react';
import { enterTitle, getRating } from "../api/ApiFunctions"
import { getReviews, createReview } from "../api/Reviews"

//@TODO: If it is a series, include an option to look into the episode specifics and omit the reviews 
export default function MoviePage() {
  const { titleId } = useParams();
  const [titleInfo, setTitleInfo] = useState({});
  const [ratingInfo, setRatingInfo] = useState([]); 
  const [userReviews, setUserReviews] = useState([]); 
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setLogIn] = useState(false)

  const[loading, setLoading] = useState(false);

  async function fetchTitleInfo() {
    const apiResponse = await enterTitle(titleId);
    setTitleInfo(apiResponse[0]);
  }
  async function fetchRatingInfo() { 
    const apiResponse = await getRating(titleId);
    if (apiResponse.length === 0) { 
      setRatingInfo(["0", "0"])
    }
    else { 
      setRatingInfo(apiResponse[0]);
    }
  }
  async function fetchUserReviews() { 
    const apiResponse = await getReviews("title", titleId);
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
    }, [titleId]); 

  useEffect(() => {
    setLoading(true);
    fetchUserReviews(); 
    fetchRatingInfo(); 
    setLoading(false);
    }, [ rating, reviewText]); 

  useEffect(() => {
    setUserId(sessionStorage.getItem("user_id"))
    if(userId != null){
      setLogIn(true)
    }
  }, [userId]);


  function postReview(){
    createReview(userId, titleId, rating, reviewText)
  } 
  return (
    <div>
      <Navigation/>
      {loading ? (<p>Loading</p>) : (
        <>
        <div className = "basicInfo">
          <h1>{titleInfo[1]}</h1>
          <p>Release Date: {titleInfo[3]}</p>
          <p>Genre: {titleInfo[5]}</p> 
          <p>Rating: {ratingInfo[0]} </p>
          <p> Votes: {ratingInfo[1]}</p>
        </div>
        <div className = "userReviews"> 
          <h2>User Reviews: </h2>
          <div>
            {isLoggedIn ? (
              <form onSubmit = {postReview}> 
                <input type="range" min="0" max="10" defaultValue="5" onInput = {e =>setRating(e.target.value)} class="slider" id="myRange"/> {rating}/10
                <br/>
                <textarea onInput = {e => setReviewText(e.target.value)}>Keyboard Warriors UNITE</textarea>
                <button type = "submit">Post!</button>
             </form>
            ): (
              <button><Link to = "/login">Login to post reviews! </Link></button>
            )}
            
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



