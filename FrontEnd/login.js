logoredirect = document.querySelector(".indexredirect").addEventListener("click", function (){
  window.location.href = "index.html"
})
loginForm = document.querySelector(".loginform")
// Envoi du formulaire
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
  const data = { 
    email: email,
    password: password,
}
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
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

