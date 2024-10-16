// const  //
const loginButton = document.getElementById("btnlogin");
const logoutButton = document.getElementById("btnlogout");
const banner = document.getElementById("banner");
const token = localStorage.getItem("token");
const filter = document.getElementById("filter");
// const modale
const openModalButton = document.getElementById("openModal");
const editIcon = document.getElementById("editIcon");
const modal = document.getElementById("modal");
const gallerymodale = document.getElementById("gallery-modale");
const closeModalButton = document.getElementById("closeModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const addPhotoModal = document.getElementById("addPhotoModal");
const closeAddPhotoModal = document.getElementById("closeAddPhotoModal");
// const formulaire
const addPhotoForm = document.getElementById("addPhotoForm")
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");
const imageInput = document.getElementById("image");
const iconeImage = document.querySelector(".image-label")
const textInput = document.getElementById("uploadphoto")
const uploadcontainer = document.getElementById("image-upload")
const imagePreview = document.getElementById("imagePreview");
const uploadText = document.getElementById("uploadText");
const ReturnArrow = document.querySelector(".returnarrow")
const worksurl = "http://localhost:5678/api/works";
const categoryurl = "http://localhost:5678/api/categories";
let allWorks = []; 

// redirection login 
loginButton.addEventListener('click', function (){
    window.location.href = "login.html";

})

// Récupérer les projets
function getProjects() {
    fetch(worksurl)
        .then(response => response.json())
        .then(works => {
            allWorks = works; 
            showProjects(allWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));
}

// Récupérer les catégories
function getCategories() {
    fetch(categoryurl)
        .then(response => response.json())
        .then(categories => {
            addFilterButtons(categories); 
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}

// Ajout des boutons de filtres dynamiquement 
function addFilterButtons(categories) {
    const filterContainer = document.getElementById("filter");
    filterContainer.innerHTML = ''; 

    const allButton = document.createElement('h3');
    allButton.textContent = "Tous";
    allButton.dataset.id = 'all'; 
    filterContainer.appendChild(allButton);

    categories.forEach(category => {
        const filterButton = document.createElement('h3');
        filterButton.textContent = category.name;
        filterButton.dataset.id = category.id;
        filterContainer.appendChild(filterButton);
    });

    allButton.classList.add('selected');

    const filterButtons = document.querySelectorAll('#filter h3');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            const categoryId = button.dataset.id;
            if (categoryId === 'all') {
                showProjects(allWorks); 
            } else {
                const filteredWorks = allWorks.filter(work => work.categoryId == categoryId);
                showProjects(filteredWorks); 
            }
        });
    });
}

// Fonction pour afficher les projets dynamiquement
function showProjects(works) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ''; 

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

getCategories();
getProjects();

//******** EDITION **********//

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
async function loadProjects() {
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
async function deleteProject(projectId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            await loadProjects();
            await getProjects() 
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}    
document.querySelectorAll(".delete-icon").forEach(icon => {
      icon.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation ();
      const projectId = this.getAttribute("data-project-id"); 
      deleteProject(projectId);
    });
});

// prévualisation de l'image
textInput.addEventListener("click", function () {
    imageInput.click();
});
imageInput.addEventListener("change", function () {
    const file = this.files[0];
    
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        iconeImage.style.display = "none";
        textInput.style.display = "none";
        imagePreview.style.display = "block";
        imagePreview.src = imageUrl;  
    }
});

// ajouté une nouvelle photo
addPhotoBtn.addEventListener("click", function () {
    modal.style.display = "none";  
    addPhotoModal.style.display = "flex";
    close
});

// Bouton d'envoi passe au vert si tout est rempli
function VerificationForm() {
    const titleFilled = titleInput.value.trim() !== '';
    const categoryFilled = categorySelect.value > 0; 
    const imageFilled = imageInput.files.length > 0;
    if (titleFilled && categoryFilled && imageFilled) {
        submitBtn.style.backgroundColor = 'green';
        submitBtn.style.color = 'white';
    } else {
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
    }
}

titleInput.addEventListener('input', VerificationForm);
categorySelect.addEventListener('change', VerificationForm);
imageInput.addEventListener('change', VerificationForm);

VerificationForm();

// Formulaire d'envoi du nouveau projet
addPhotoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const categoryId = document.getElementById("category").value;
    const imageFile = document.getElementById("image").files[0];

    if (!title || !categoryId || !imageFile) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", imageFile);  
    

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData 
    })
    .then(response => {
        if (!response.ok) {
            alert("Erreur lors de l'ajout du projet");
        }else{
            loadProjects(); 
                addPhotoModal.style.display = "none";
                modal.style.display = "flex";
            getProjects();
            addPhotoForm.reset();
            imagePreview.style.display = "none";
            imagePreview.src = "";
            iconeImage.style.display = "block";
            textInput.style.display = "block";
            VerificationForm();
        }
        return response.json()
    })
    .then (response => {
        console.log(response)
    })
    .catch(error => console.error("Erreur:", error));
});

//chargement des catégories
function loadCategories() {
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById("category");
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
    .catch(error => console.error("Erreur lors du chargement des catégories :", error));
}

loadCategories(); 

// fermer la modale  
closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
});
closeAddPhotoModal.addEventListener("click", function () {
    addPhotoModal.style.display = "none";
});
// Fleche de retour 
ReturnArrow.addEventListener("click", function(){
    addPhotoModal.style.display = "none";
    modal.style.display = "flex";
}) 
// Gestion du clic en dehors de la modale
window.addEventListener("click", function (event) {
    if (event.target === modal) {
    modal.style.display = "none";
    }
});
modalefunction()
editpage ()
loadProjects()
