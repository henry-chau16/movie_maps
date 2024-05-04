import Navigation from "../components/Navigation"
import {login} from "../api/Account"

export default function Login() { 
    async function loginUser(event) { 
        event.preventDefault();
        const formData = new FormData(event.target)
        const username = formData.get("username")
        const password = formData.get("password")
        try {
            await login(username, password)
            alert("Successfully logged in.")
        } catch (error) { 
            console.error(error)
            alert("Unable to login!")
        }
    }

    return (
    <div className = "login">
        <Navigation/>
        <form onSubmit={loginUser}>
            <label for = "username"> Username: </label>
            <input type="text" id = "username" name="username"/>
            <label for = "password"> Password: </label>
            <input type="password" id = "password" name="password"/>
            <button type="submit">Login</button>
        </form>
    </div>)
}