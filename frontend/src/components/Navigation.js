import {Link} from "react-router-dom"; 
import {useState, useEffect, redirect } from "react";

export default function Navigation() { 
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setLogIn] = useState(false)

    useEffect(() => {
        setUserId(sessionStorage.getItem("user_id"))
        if(userId != null){
            setLogIn(true)
        }
        else{
            setLogIn(false)
            
        }
    }, [userId]);

    async function handleLogBtn(){
        sessionStorage.clear()
        alert("Successfully Logged Out")
        window.location.reload();
    }
    return (
        <div className = "navigation">
            <div className = "title">
                <Link to = "/">Movie Maps</Link>
            </div>
            <div className = "options">
            <Link to = "/">Home</Link>
            <Link to = "/register">Register</Link>
            {isLoggedIn ? (
                <Link onClick = {() => handleLogBtn()} >Log Out</Link>
            ): (
                <Link to = "/login">Login</Link>
            )}
            </div>
        </div>
    )
}


