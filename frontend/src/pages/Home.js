import {useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Filter from "../components/Filter";
import { Link } from "react-router-dom";
import { displayTitles, searchByTitle } from "../api/ApiFunctions"

//maybe store the search result with sessions later to avoid too much reload
export default function Home() { 
    const[openFilter, setOpenFilter] = useState(false); 
    const[searchQuery, setSearchQuery] = useState(''); 
    const[loading, setLoading] = useState(false);

    const [titles, setTitles] = useState([]);

    useEffect(() => { //replace with call to api once results limited
       setLoading(true);
       const fetchData = async () => { 
        const apiResponse = await displayTitles();
        console.log(apiResponse)
        setTitles(apiResponse)
        setLoading(false);
       }
        fetchData(); 
    }, []); 

    const handleOpenFilter = () => { 
        setOpenFilter(!openFilter);
    }

    async function handleSearchTitle() { 
        setLoading(true);
        const apiResponse = await searchByTitle(searchQuery);
        setTitles(apiResponse);
        setLoading(false);
    }
    
    return (
        <div className = "Home">
            <Navigation/>
            {loading ? (<p>Loading..</p>) : (
            <div>
                <button onClick = {() => handleOpenFilter()}>Filter</button>
                <input
                    type = "text"
                    placeholder = "Search by title"
                    onChange={event => {
                        setSearchQuery(event.target.value);
                    }}
                />
                <button onClick = {() => handleSearchTitle()}>Search</button>

                {titles && titles.map((title) => ( //goes to either movie or episode 
                    <Link key={title[0]} to={`/${title[2] === 'movie' ? 'movie' : 'series'}/${title[0]}`}>
                        <button>{title[1]}</button>
                    </Link>
                ))}
            </div>
        )}
             {openFilter && <Filter/>}
        </div>
    )
}
