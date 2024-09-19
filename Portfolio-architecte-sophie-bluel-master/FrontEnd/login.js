document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname; 

  if (currentPage.includes("index.html") || currentPage === "/") {
      const loginButton = document.getElementById("btnlogin");
      const logoutButton = document.getElementById("btnlogout");
      const banner = document.getElementById("banner");
      const token = localStorage.getItem("token");
      const filter = document.getElementById("filter");
      const openModalButton = document.getElementById("openModal");
      const editIcon = document.getElementById("editIcon");
      const modal = document.getElementById("modal");
      const closeModalButton = document.getElementById("closeModal");

      if (token) {
          loginButton.style.display = "none";
          logoutButton.style.display = "block";
          banner.style.display = "flex";
          filter.style.display = "none";
          openModalButton.style.display = "block";
          editIcon.style.display = "block";
      } else {
          loginButton.style.display = "block";
          logoutButton.style.display = "none";
          banner.style.display = "none";
          filter.style.display = "flex";
          openModalButton.style.display = "none";
          editIcon.style.display = "none";
      }
      if (openModalButton && editIcon) {
          openModalButton.addEventListener("click", function () {
              modal.style.display = "flex";  
          });

          editIcon.addEventListener("click", function () {
              modal.style.display = "flex"; 
          });
      }

      if (closeModalButton) {
          closeModalButton.addEventListener("click", function () {
              modal.style.display = "none";  
          });
      }

      window.addEventListener("click", function (event) {
          if (event.target === modal) {
              modal.style.display = "none"; 
          }
      });
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
              filter.style.display = "flex";
              openModalButton.style.display = "none";
              editIcon.style.display = "none";
          });
      }
  } else if (currentPage.includes("login.html")) {
      const loginForm = document.querySelector(".loginform");

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
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const gallerymodale = document.getElementById("gallery-modale");
  const closeModalButton = document.getElementById("closeModal");
  const addPhotoBtn = document.getElementById("addPhotoBtn");

  function loadProjects() {
    fetch("http://localhost:5678/api/works")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des projets : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Projets récupérés :", data);  
        gallerymodale.innerHTML = '';
        if (data.length === 0) {
          gallery.innerHTML = '<p>Aucun projet disponible.</p>';
        } else {
          data.forEach(project => {
            const projectDiv = document.createElement("div");
            projectDiv.classList.add("project");
  
            const projectImg = document.createElement("img");
            projectImg.src = project.imageUrl;
            projectImg.alt = project.title;
            projectDiv.appendChild(projectImg);
  
            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");
            deleteIcon.addEventListener("click", function () {
              deleteProject(project.id);
            });
            projectDiv.appendChild(deleteIcon);
  
            gallerymodale.appendChild(projectDiv); 
          });
        }
      })
      .catch(error => console.error("Erreur lors du chargement des projets :", error));
  }
  
  function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/{id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          loadProjects(); 
        }
      })
      .catch(error => console.error("Erreur lors de la suppression du projet :", error));
  }

  addPhotoBtn.addEventListener("click", function () {
    console.log("Ajout d'une nouvelle photo"); 
  });

  closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  loadProjects();
});
