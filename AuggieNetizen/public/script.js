// script.js 
document.addEventListener("DOMContentLoaded", () => {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const loginButton = document.getElementById("login-button")
    const registerButton = document.getElementById("register-button")
  
    // if login button is selected, the user's email and password are sent to the server to be verified
    // if the login is successful, the user is send to the profile.html file
    if (loginButton) {
        loginButton.onclick = async () => {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value.toLowerCase().trim(), password: password.value })
        });
        const body = await res.json();
        if (res.ok) {
            window.location.href = "profile.html"
        } else {
          document.getElementById("error-message").textContent = body.error || "Login failed";
        }
      };
    }
  
    //if the user selects the register button, their email and password are sent to the server
    //if the registration is a success, the user is sent to the login page, else and error will show
    if (registerButton && !loginButton) {
        registerButton.onclick = async () => {
        const res = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value.toLowerCase().trim(), password: password.value })
        });
        const body = await res.json();
        if (res.ok) {
            window.location.href = "index.html"
        } else {
          document.getElementById("error-message").textContent = body.error || "Register failed";
        }
      };
    }
  });