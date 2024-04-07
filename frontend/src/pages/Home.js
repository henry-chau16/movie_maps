import { useContext, useState } from "react";
import Navigation from "../components/Navigation";
import Filter from "../components/Filter";
import { Link } from "react-router-dom";
import { searchByTitle } from "../api/ApiFunctions"

export default function Home() { 
    const[openFilter, setOpenFilter] = useState(false); 
    const[searchQuery, setSearchQuery] = useState(''); 
    const[loading, setLoading] = useState(false);

    const [titles, setTitles] = useState([]);

    const handleOpenFilter = () => { 
        setOpenFilter(!openFilter);
        console.log("filter button clicked")
    }

    async function handleSearchTitle() { 
        setLoading(true);
        const apiResponse = await searchByTitle(searchQuery);
        console.log("API Response:", apiResponse);
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
                    <Link key={title.id} to={`/title/${title.id}`}>
                        <button>{title.name}</button>
                    </Link>
                ))}
            </div>
        )}
             {openFilter && <Filter/>}
        </div>
    )
}
