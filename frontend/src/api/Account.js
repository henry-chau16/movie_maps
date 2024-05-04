const backendUrl = 'http://localhost:8000' 

export async function login(username, password) { 
    try { 
        const response = await fetch(backendUrl + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ 
                username: username,
                password: password
            }),
        })
        if (!response.ok) {
            throw new Error("Login failed")
        }
        const data = await response.json()
        const userId = data.user_id;
        localStorage.setItem("user_id", userId); //stores id in local storage for persisting 
        localStorage.setItem("username", username);
    }
    catch (error) { 
        throw error;
    }
}

export async function register(username, password) { 
    try { 
        const response = await fetch(backendUrl + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ 
                username: username,
                password: password
            }),
        })
        if (!response.ok) {
            throw new Error("Register failed")
        }
    }
    catch (error) { 
        throw error;
    }
}