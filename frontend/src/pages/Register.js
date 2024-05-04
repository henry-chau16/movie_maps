import Navigation from "../components/Navigation"
import {register} from "../api/Account"

export default function Register() {  
    async function registerUser(event) { 
        event.preventDefault(); //prevents refresh on submit

        //@TODO: Add data validation later for password.
        const formData = new FormData(event.target)
        const username = formData.get("username")
        const password = formData.get("password")
        try {
            await register(username, password)
            alert("Successfully registered.")
        } catch (error) { 
            console.error("Registration error: ", error)
        }
    }
    return (
    <div className = "Register">
        <Navigation/>
        <form onSubmit={registerUser}> {/* name: identifer for form data, value: initial value, id: unique identifer*/}
            <label for = "username"> Username: </label>
            <input type="text" id = "username" name="username"/>
            <label for = "password"> Password: </label>
            <input type="password" id = "password" name="password"/>
            <button type="submit">Register</button>
        </form>
    </div>)
}