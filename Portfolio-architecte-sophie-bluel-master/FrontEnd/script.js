const worksurl = "http://localhost:5678/api/works";
const categoryurl = "http://localhost:5678/api/categories";
let allWorks = []; 

// Function to retrieve projects
function getProjects() {
    fetch(worksurl)
        .then(response => response.json())
        .then(works => {
            allWorks = works; 
            showProjects(allWorks);
        })
        .catch(error => console.error('Erreur lors de la récupération des projets :', error));
}

// Function to retrieve categories and create filter buttons
function getCategories() {
    fetch(categoryurl)
        .then(response => response.json())
        .then(categories => {
            addFilterButtons(categories); 
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}

// Add filter buttons dynamically
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

// Function to display projects in gallery
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
