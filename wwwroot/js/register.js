const register = async () => {
    const name = document.getElementById("name").value
    const birthdate = document.getElementById("birthdate").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmpassword = document.getElementById("confirmpassword").value

    if (email.length == 0 || password.length == 0 || email === undefined || password === undefined)
        return alert("Email and password required")
    const year = birthdate.split("-")[0]
    const month = birthdate.split("-")[1]
    const day = birthdate.split("-")[2]

    const newdate = `${year}/${month}/${day}`

    console.log(newdate)

    const requestObject = {
        UserName: name,
        UserDOB: newdate,
        UserPhone: phone,
        UserEmail: email,
        UserPassword: password
    }
    const requestjson = JSON.stringify(requestObject)
    console.log(requestjson);
    const requestQuery = await fetch("../Registry/SendEmail", {
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
    console.log(JSON.stringify(responsejson))
    if (!responsejson.status) {
        //yang ini jangan lupa nanti bikin styling buat eror eror
        //document.querySelector(".RegisterAlert").style.display = "block"
        alert("There seems to be a problem loggin in")
        return
    }
    //window.localStorage.setItem("token", newtoken)
    return window.location.replace("/Registry/Login")

}