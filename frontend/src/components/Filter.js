import { useState } from "react";
import { filter, clearFilter} from "../api/ApiFunctions";

export default function Filter() {

    const [genres, setGenres] = useState([]);
    const [type, setType] = useState("n"); 
    const [startYear, setStartYear] = useState("n"); 
    const [endYear, setEndYear] = useState("n");
    
    //make sure it calls n
    function handleFilter(e) { 
        const genreString = genres.length > 0 ? genres.join(",") : "n";
        filter(genreString, startYear, endYear, type)
    }

    function handleClearFilter() { 
        clearFilter()
    }

    function handleGenreChange (e) { 
        const genre = e.target.value; 
        if (e.target.checked) {
            setGenres(prevGenres => [...prevGenres, genre]);
        } else {
            setGenres(prevGenres => prevGenres.filter(e => e !== genre));
        }
    }

    return (
        <div className = "filter">
        <form onSubmit = {handleFilter}>
            <ul> 
                <li>Type</li>
                <select onChange = {(e) => setType(e.target.value)}>
                    <option value="">Select an option</option> 
                    <option value="movie">Movie</option>
                    <option value="tvSeries">Series</option>
                </select>
                
                <li>Genre</li>
                {['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Documentary', 'Fantasy', 'Horror', 'Sci-Fi'].map((genre) => (
                    <div key={genre}>
                        <input type="checkbox" value={genre} onChange = {(e) => handleGenreChange(e)}/>
                        <label htmlFor={genre}>{genre}</label>
                    </div>
                ))}    
                <li>Years</li>
                <input
                type = "text"
                placeholder = "Start Year"
                onChange = {(e) => setStartYear(e.target.value)}
                />
                <input
                type = "text"
                placeholder = "End Year"
                onChange = {(e) => setEndYear(e.target.value)}
                />
            </ul>
            <button type = "submit">Filter</button>
            <button onClick = {() => handleClearFilter()}>Clear Filter</button>
        </form>
        </div>
    )
}