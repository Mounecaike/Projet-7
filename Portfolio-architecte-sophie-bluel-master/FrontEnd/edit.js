// constante 
const loginButton = document.getElementById("btnlogin");
const logoutButton = document.getElementById("btnlogout");
const banner = document.getElementById("banner");
const token = localStorage.getItem("token");
const filter = document.getElementById("filter");
const openModalButton = document.getElementById("openModal");
const editIcon = document.getElementById("editIcon");
const modal = document.getElementById("modal");
const gallerymodale = document.getElementById("gallery-modale");
const closeModalButton = document.getElementById("closeModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");

// aspect visuel connecté/deconnecté 
function editpage () {
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
}
// fonction de la modale
function modalefunction () {
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
})};
// déconnexion
logoutButton.addEventListener("click", function (){
        localStorage.removeItem("token");
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        banner.style.display = "none";
        filter.style.display = "flex";
        openModalButton.style.display = "none";
        editIcon.style.display = "none";
});
// injecter projets
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
              deleteIcon.addEventListener("click", function (event) {
                event.preventDefault ();
                event.stopPropagation ();
                deleteProject(project.id);
              });
              projectDiv.appendChild(deleteIcon);
    
              gallerymodale.appendChild(projectDiv); 
            });
          }
        })
        .catch(error => console.error("Erreur lors du chargement des projets :", error));
}
// supprimez les projets de la modale 
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
        })
        .then(response => {
          if (response.ok) {
            loadProjects(); 
          }
        })
        .catch(error => console.error("Erreur lors de la suppression du projet :", error));
    }
    
document.querySelectorAll(".delete-icon").forEach(icon => {
      icon.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation ();
      const projectId = this.getAttribute("data-project-id"); 
      deleteProject(projectId);
    });
});
// ajouté une nouvelle photo
addPhotoBtn.addEventListener("click", function () {
  console.log("Ajout d'une nouvelle photo"); 
});
// fermer la modale  
closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
});
  
window.addEventListener("click", function (event) {
    if (event.target === modal) {
    modal.style.display = "none";
    }
});
modalefunction()
editpage ()
loadProjects()
