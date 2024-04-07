import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useEffect, useState } from 'react';
import { enterTitle } from "../api/ApiFunctions"

export default function TitlePage() {
  const { titleId } = useParams();
  const [data, setData] = useState({});
  const[loading, setLoading] = useState(false);

  useEffect(() => { //replace with call to api once results limited
    async function fetchData() {
      setLoading(true);
      const apiResponse = await enterTitle(titleId);
      setData(apiResponse[0]);
      setLoading(false);
  }
  fetchData();
  }, [titleId]); 

  return (
    <div>
      <Navigation/>
      {loading ? (<p>Loading</p>) : (
        <>
          <h2>Title ID: {titleId}</h2>
          <p>Title Name: {data.TitleName}</p>
          <p>Title Type: {data.TitleType}</p>
          <p>Start Year: {data.StartYear}</p>
          <p>End Year: {data.EndYear}</p>
          <p>Genre: {data.Genre}</p>
        </>
      )}
    </div>
  );
}



