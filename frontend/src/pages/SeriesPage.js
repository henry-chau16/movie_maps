import {useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { listEpisodes } from "../api/ApiFunctions";

export default function SeriesPage(){
    const { titleId } = useParams();
    const[loading, setLoading] = useState(false);
    const [episodes, setEpisodes] = useState([])


    useEffect(() => { //replace with call to api once results limited
        setLoading(true);
        const fetchData = async () => { 
         const apiResponse = await listEpisodes(titleId);
         console.log(apiResponse)
         setEpisodes(apiResponse)
         setLoading(false);
        }
         fetchData(); 
     }, []); 

return (
    <div className = "Episode List">
        <Navigation/>
        <h1>Episode List</h1>
        {loading ? (<p>Loading..</p>) : (
        <div>
            {episodes && episodes.map((item) => (
                <h3 style = {{textAlign : 'Center'}} > Episode {item[0]} : Season {item[1]}
                </h3>
            ))}
        </div>
    )}
    </div>
)
}