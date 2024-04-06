import { useContext, useState } from "react";
import Navigation from "../components/Navigation";
import Filter from "../components/Filter";
import { Link } from "react-router-dom";

export default function Home() { 
    const[openFilter, setOpenFilter] = useState(false); 
    const[searchQuery, setSearchQuery] = useState(''); 

    const [titles, setTitles] = useState([
        { id: 1, name: "Title 1" },
        { id: 2, name: "Title 2" },
        { id: 3, name: "Title 3" }
    ]);

    const handleOpenFilter = () => { 
        setOpenFilter(!openFilter);
        console.log("filter button clicked")
    }

    async function handleEnterTitle() { 
        
    }
    
    return (
        <div className = "Home">
            <Navigation/>
            <button onClick = {() => handleOpenFilter()}>FilterPlaceholder</button>
            <input
                type = "text"
                placeholder = "Search by title or crew"
                onKeyDown={(event) => { 
                    if (event.key === 'Enter') { 
                        event.preventDefault();
                        handleEnterTitle();
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
             {openFilter && <Filter/>}
        </div>
    )
}
