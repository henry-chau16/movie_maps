const backendUrl = 'http://localhost:8000' 

export async function login(username, password) { 
    fetch(backendUrl + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ 
                username: username,
                password: password
            }),
        })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch(error => console.error("Error with login: ", error))
}

export async function register(username, password) { 
    fetch(backendUrl + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({ 
            username: username,
            password: password
        }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch(error => console.error("Error with register: ", error))
}