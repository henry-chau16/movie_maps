

export default function Filter() { 

    return (
        <div className = "filter">
            <ul> 
                <li>Type</li>
                    <ul>Movies</ul>
                    <ul>Series</ul>
                <li>Genre</li>
                <form onSubmit={handleFilterGenres}>
                    {['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Documentary', 'Fantasy', 'Horror', 'Sci-Fi'].map((genre) => (
                        <div key={genre}>
                            <input type="checkbox" id={genre} />
                            <label htmlFor={genre}>{genre}</label>
                        </div>
                    ))}
                    <input type="submit" value="Search"/>
                </form>
                <li>Years</li>
                <form onSubmit={handleFilterYears}>
                    <input
                    type = "text"
                    placeholder = "Start Year"
                    />
                    <input
                    type = "text"
                    placeholder = "End Year"
                    />
                    <input type="submit" value="Search"/>
                </form>
                <li>Reviewed Titles</li>
            </ul>
        </div>
    )
}