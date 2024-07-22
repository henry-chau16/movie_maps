import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import AddReview from '../components/AddReview';
import { useEffect, useState, useCallback } from 'react';
import { enterTitle, getRating } from "../api/ApiFunctions"
import { getReviews } from "../api/Reviews"

//@TODO: If it is a series, include an option to look into the episode specifics and omit the reviews 
export default function MoviePage() {
  const { titleId } = useParams();
  const [titleInfo, setTitleInfo] = useState({});
  const [ratingInfo, setRatingInfo] = useState([]); 
  const [userReviews, setUserReviews] = useState([]); 
  const [addReviewToggle, setAddReviewToggle] = useState(false); 

  const[loading, setLoading] = useState(false);


  const fetchTitleInfo = useCallback(async () => {
    const apiResponse = await enterTitle(titleId);
    setTitleInfo(apiResponse[0]);
  }, [titleId]);

  const fetchRatingInfo = useCallback(async () => {
    const apiResponse = await getRating(titleId);
    if (apiResponse.length === 0) {
      setRatingInfo(["0", "0"]);
    } else {
      setRatingInfo(apiResponse[0]);
    }
  }, [titleId]);

  const fetchUserReviews = useCallback(async () => {
    const apiResponse = await getReviews("title", titleId);
    console.log("review info", apiResponse);
    if (apiResponse.length > 0) {
      setUserReviews(apiResponse);
    }
  }, [titleId]);

  function toggleReview() { 
    setAddReviewToggle(!addReviewToggle);
  }

  useEffect(() => {
    setLoading(true);
    fetchTitleInfo();
    fetchUserReviews(); 
    fetchRatingInfo(); 
    setLoading(false);
    }, [fetchRatingInfo, fetchUserReviews, fetchTitleInfo]); 

  return (
    <div>
      <Navigation/>
      {loading ? (<p>Loading</p>) : (
        <>
        <div className = "basicInfo">
          <h1>{titleInfo[1]}</h1>
          <p>Release Date: {titleInfo[3]}</p>
          <p>Genre: {titleInfo[5]}</p> 
          <p>Rating: {parseFloat(ratingInfo[0]).toFixed(1)} </p>
          <p> Votes: {ratingInfo[1]}</p>
        </div>
        <div className = "userReviews"> 
          <button onClick = {toggleReview}> Add My Review</button>
          {addReviewToggle && <AddReview watchId = {titleId} isEpisode = {false}/>}
           <h2>User Reviews: </h2>
          <div>
            {userReviews.length !== 0 ? userReviews.map((reviews) => (
              <div className = "userReview" key={reviews[0]}>
              <p>Username: {reviews[1]}</p>
              <p>Rating: {reviews[2]}</p>
              <p>{reviews[3]}</p>
              </div>
            )) : <p>No user reviews found.</p>}
          </div>
        </div>
        </>
      )}
    </div>
  );
}



