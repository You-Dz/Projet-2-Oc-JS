const form = document.querySelector(".login-form")
form.addEventListener("submit", (event) => {
    event.preventDefault()
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    sendLogin(email,password)
})
async function sendLogin(email, password) {
    const apiSubmit = await fetch("http://localhost:5678/api/users/login", {
        method : "POST",  //j'envoie des données
        headers : { 
            "Content-Type":"application/json" // indication les données = JSON
        },
        body: JSON.stringify({  // conversion des données en json
            email: email,
            password:password
        })
    })
    if (!apiSubmit.ok){  //apiSubmit.ok => vrai si le serveur répond sous la forme 2XX
        manageError()
    } else {
        const apiResponse = await apiSubmit.json() //→ transforme la réponse JSON en objet JS.
        window.localStorage.setItem("token",JSON.stringify(apiResponse.token))
        removeError()
        window.location.href ="index.html"
    }
}

function manageError () {
    const errorMessage = document.querySelector(".error-message")
    if (errorMessage) {
        errorMessage.innerText = "L'émail ou le mot de passe est invalide"
    } else {
        const messageContainer = document.createElement("p")
        messageContainer.className = "error-message"
        messageContainer.innerText = "L'émail ou le mot de passe est invalide"
        form.after(messageContainer)
    }
}
function removeError () {
    const errorMessage = document.querySelector(".error-message")
    if (errorMessage) errorMessage.remove()
}

