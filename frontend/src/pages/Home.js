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
    const [userId, setUserId] = useState(null);
    const [btnLink, setbtnLink] = useState("/login");

    useEffect(() => { //replace with call to api once results limited
       setLoading(true);
       const fetchData = async () => { 
        const apiResponse = await displayTitles();
        setTitles(apiResponse)
        setLoading(false);
       }
        fetchData(); 
    }, []); 

    useEffect(() => {
        setUserId(sessionStorage.getItem("user_id"))
        if(userId != null){
            setbtnLink("/review")
        } else { 
            setbtnLink("/login")
        }
    }, [userId]);

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
                {openFilter &&  <div className="filter-popup"><Filter/></div>}
                <div className = "modal-overlay" style={{ position: "relative" }}>
                <div className = "search">
                <button onClick = {() => handleOpenFilter()}>Filter</button>
                <input
                    type = "text"
                    placeholder = "Search by title"
                    onChange={event => {
                        setSearchQuery(event.target.value);
                    }}
                />
                <button onClick = {() => handleSearchTitle()}>Search</button>
                <button><Link to = {"/review"}>My Reviews</Link></button>
                </div>
                
                <div className="grid-container">
                {titles && titles.map((title) => ( //goes to either movie or episode 
                    <Link key={title[0]} to={`/${title[2] === 'movie' ? 'movie' : 'series'}/${title[0]}`}>
                        <button>{title[1]}</button>
                    </Link>
                ))}
                </div>
                </div>
            </div>
        )}
             {openFilter && <Filter/>}
        <button><Link to = {btnLink}>My Reviews </Link></button>
        </div>
    )
}
