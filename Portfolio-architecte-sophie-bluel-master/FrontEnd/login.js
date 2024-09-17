document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".loginform");
    const loginButton = document.getElementById("btnlogin");
    const logoutButton = document.getElementById("btnlogout");
    const banner = document.getElementById("banner");
    const token = localStorage.getItem("token");
    if (token) {
      loginButton.style.display = "none";
      logoutButton.style.display = "block";
      banner.style.display = "flex";
    } else {
      loginButton.style.display = "block";
      logoutButton.style.display = "none";
      banner.style.display = "none";
    }
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem("token", data.token);
              window.location.href = "index.html";
            } else {
              alert("Erreur : email ou mot de passe incorrect");
            }
          })
          .catch((error) => {
            console.error("Erreur:", error);
          });
      });
    }
    if (loginButton) {
      loginButton.addEventListener("click", function () {
        window.location.href = "login.html";
      })
    }
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        banner.style.display = "none";
      });
    }
  });
