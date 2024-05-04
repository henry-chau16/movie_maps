import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useEffect, useState } from 'react';
import { enterTitle, getRating } from "../api/ApiFunctions"
import { getReviews } from "../api/Reviews"

//@TODO: If it is a series, include an option to look into the episode specifics and omit the reviews 
export default function MoviePage() {
  const { titleId } = useParams();
  const [titleInfo, setTitleInfo] = useState({});
  const [ratingInfo, setRatingInfo] = useState([]); 
  const [userReviews, setUserReviews] = useState([]); 

  const[loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchTitleInfo() {
      const apiResponse = await enterTitle(titleId);
      setTitleInfo(apiResponse[0]);
    }
    async function fetchRatingInfo() { 
      const apiResponse = await getRating(titleId);
      if (apiResponse.length === 0) { 
        setRatingInfo(["N/A", "N/A"])
      }
      else { 
        setRatingInfo(apiResponse);
      }
    }
    async function fetchUserReviews() { 
      const apiResponse = await getReviews("title", titleId);
      if (apiResponse.length > 0) { 
        setUserReviews(apiResponse);
      }
    }
  fetchTitleInfo();
  fetchUserReviews(); 
  fetchRatingInfo(); 
  setLoading(false);
  }, [titleId]); 

  return (
    <div>
      <Navigation/>
      {loading ? (<p>Loading</p>) : (
        <>
        <div className = "basicInfo">
          <h1>{titleInfo[1]}</h1>
          <p>Release Date: {titleInfo[3]}</p>
          <p>Genre: {titleInfo[5]}</p> 
          <p>Rating: {ratingInfo[0]} Votes: {ratingInfo[1]}</p>
        </div>
        <div className = "userReviews"> 
          <h2>User Reviews: </h2>
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



