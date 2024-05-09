import {Link} from "react-router-dom"; 

export default function Navigation() { 
    return (
        <div className = "navigation">
            <div className = "title">
                <Link to = "/">Movie Maps</Link>
            </div>
            <div className = "options">
                <Link to = "/register">Register</Link>
                <Link to= "/login">Login</Link>
            </div>
        </div>
    )
}


