import {Link} from "react-router-dom"; 

export default function Navigation() { 
    return (
        <div className = "links">
            <Link to = "/">Home</Link>
            <Link to = "/register">Register</Link>
            <Link to= "/login">Login</Link>
        </div>
    )
}


