import { useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import AddReview from '../components/AddReview';
import { useEffect, useState, useCallback } from 'react';
import { enterTitle, getRating } from "../api/ApiFunctions"
import { getReviews} from "../api/Reviews"

//@TODO: Fix the post reviews
export default function EpisodesPage() {
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parentId")
  const episodeId = searchParams.get("episodeId")
  const episodeNum = searchParams.get("episodeNum")
  const season = searchParams.get("season")
  
  const [titleInfo, setTitleInfo] = useState({});
  const [ratingInfo, setRatingInfo] = useState([]); 
  const [userReviews, setUserReviews] = useState([]); 
  const [addReviewToggle, setAddReviewToggle] = useState(false);

  const[loading, setLoading] = useState(false);

  const fetchTitleInfo = useCallback(async () => {
    const apiResponse = await enterTitle(parentId);
    setTitleInfo(apiResponse[0]);
  }, [parentId]);

  const fetchRatingInfo = useCallback(async () => {
    const apiResponse = await getRating(episodeId);
    if (apiResponse.length === 0) {
      setRatingInfo(["0", "0"]);
    } else {
      setRatingInfo(apiResponse[0]);
    }
  }, [episodeId]);

  const fetchUserReviews = useCallback(async () => {
    const apiResponse = await getReviews("title", episodeId);
    console.log("review info", apiResponse);
    if (apiResponse.length > 0) {
      setUserReviews(apiResponse);
    }
  }, [episodeId]);
  
  function toggleReview() { 
    setAddReviewToggle(!addReviewToggle);
  }

  useEffect(() => {
    setLoading(true);
    fetchTitleInfo();
    fetchUserReviews(); 
    fetchRatingInfo(); 
    setLoading(false);
    }, [fetchRatingInfo, fetchTitleInfo, fetchUserReviews]); 

  return (
    <div>
      <Navigation/>
      {loading ? (<p>Loading</p>) : (
        <>
        <div className = "Show Info">
          <h1>{titleInfo[1]}</h1>
          <h2>Episode: {episodeNum} - Season {season} </h2>
          <p>Release Date: {titleInfo[3]}</p>
          <p>Genre: {titleInfo[5]}</p> 
          <p>Rating: {parseFloat(ratingInfo[0]).toFixed(1)} </p>
          <p> Votes: {ratingInfo[1]}</p>
        </div>
        <div className = "userReviews"> 
          <button onClick={toggleReview}>Add My Review</button>
          {addReviewToggle && <AddReview watchId={episodeId} isEpisode= {true}/>}
          <h2>User Reviews: </h2>
          <div>
            {userReviews.length !==0 ? userReviews.map((reviews) => (
              <div className = "userReview" key={reviews[0]}>
              <p>Username: {reviews[1]}</p>
              <p>Rating: {reviews[2]}</p>
              <p>{reviews[3]}</p>
              </div>
            )): <p>No user reviews found.</p>}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
