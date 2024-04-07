import {useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Filter from "../components/Filter";
import { Link } from "react-router-dom";
import { searchByTitle } from "../api/ApiFunctions"

//maybe store the search result with sessions later to avoid too much reload
export default function Home() { 
    const[openFilter, setOpenFilter] = useState(false); 
    const[searchQuery, setSearchQuery] = useState(''); 
    const[loading, setLoading] = useState(false);

    const [titles, setTitles] = useState([]);

    useEffect(() => { //replace with call to api once results limited
        setTitles([["123456789", "Placeholder"]])
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
                <button onClick = {() => handleOpenFilter()}>FilterPlaceholder</button>
                <input
                    type = "text"
                    placeholder = "Search by title or crew"
                    onKeyDown={(event) => { 
                        if (event.key === 'Enter') { 
                            event.preventDefault();
                            handleSearchTitle();
                        }
                    }}
                    onChange={event => {
                        setSearchQuery(event.target.value);
                    }}
                />
                {titles && titles.map((title) => (
                    <Link key={title[0]} to={`/title/${title[0]}`}>
                        <button>{title[1]}</button>
                    </Link>
                ))}
            </div>
        )}
             {openFilter && <Filter/>}
        </div>
    )
}
