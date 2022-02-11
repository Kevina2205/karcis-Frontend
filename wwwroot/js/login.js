const login = async() => {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
    if (email.length == 0 || password.length == 0)
        return alert("Email and password required")

  const requestObject = {
    UserEmail: email,
    UserPassword: password
  }
    const requestjson = JSON.stringify(requestObject)
    const requestQuery = await fetch("../Registry/LoginRequest", {
        method: "POST",
        body: requestjson,
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(err => {
        console.log(err)
        return alert("There seems to be an error")
    })
    const responsejson = await requestQuery.json()
    if (!responsejson.status) {
        document.querySelector(".LoginAlert").style.display = "block"
        return
    }
  return window.location.replace("/")
}