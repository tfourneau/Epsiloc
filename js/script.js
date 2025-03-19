function loadEquipmentTable() {
    fetch('get_equipment.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.equipment-table tbody');
            tableBody.innerHTML = '';
            
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" value="${item.id}"></td>
                    <td>${item.reference}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.status === 'available' ? 'Disponible' : 'En location'}</td>
                    <td>${item.price_per_day}€</td>
                    <td>
                        <div class="action-buttons">
                            <button class="admin-button edit-btn" data-id="${item.id}">Modifier</button>
                            <button class="admin-button danger delete-btn" data-id="${item.id}">Supprimer</button>
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Ajouter les gestionnaires d'événements pour les boutons d'édition et de suppression
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const equipmentId = this.getAttribute('data-id');
                    editEquipment(equipmentId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const equipmentId = this.getAttribute('data-id');
                    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement?')) {
                        deleteEquipment(equipmentId);
                    }
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

// Charger le tableau quand on clique sur l'onglet "Liste du matériel"
document.querySelector('.tab[data-tab="equipment-list"]').addEventListener('click', loadEquipmentTable);

// Charger également le tableau quand on accède à la page admin
document.getElementById('admin-link').addEventListener('click', function() {
    setTimeout(loadEquipmentTable, 100); // Léger délai pour s'assurer que le DOM est prêt
});

// Soumettre le formulaire d'ajout d'équipement
const addEquipmentForm = document.querySelector('#add-equipment form');
if (addEquipmentForm) {
    addEquipmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch('add_equipment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                this.reset();
                // Afficher l'onglet de liste et recharger les données
                document.querySelector('.tab[data-tab="equipment-list"]').click();
            } else {
                alert('Erreur: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

// Fonctions pour éditer et supprimer
function editEquipment(id) {
    // Rediriger vers un formulaire d'édition ou ouvrir un modal
    // À implémenter selon vos besoins
    alert('Fonction d\'édition à implémenter pour l\'ID: ' + id);
}

function deleteEquipment(id) {
    fetch('delete_equipment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Équipement supprimé avec succès');
            loadEquipmentTable();
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

        // Fonction pour charger et afficher le matériel
function loadEquipment(category = '', availability = '') {
    const catalogContainer = document.querySelector('.catalog');

    if (!catalogContainer) {
        console.error("Erreur : Impossible de trouver l'élément .catalog");
        return;
    }

    // Afficher un message de chargement temporaire
    catalogContainer.innerHTML = '<p class="loading">Chargement des équipements...</p>';

    fetch(`get_equipment.php?category=${category}&availability=${availability}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.text(); // On récupère la réponse en texte brut
        })
        .then(text => {
            try {
                return JSON.parse(text); // On essaie de convertir en JSON
            } catch (error) {
                console.error("Erreur JSON:", error, "Réponse brute :", text);
                throw new Error("La réponse du serveur n'est pas un JSON valide.");
            }
        })
        .then(data => {
            // Vérifier si la réponse contient une erreur PHP
            if (data.error) {
                throw new Error(`Erreur serveur : ${data.error}`);
            }

            catalogContainer.innerHTML = ''; // Efface l'ancien contenu
            
            if (data.length === 0) {
                catalogContainer.innerHTML = '<p class="no-results">Aucun équipement trouvé avec ces critères</p>';
                return;
            }

            // Affichage des équipements
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'equipment-card';

                const imagePath = item.image_path ? item.image_path : '/api/placeholder/280/200';

                card.innerHTML = `
                    <div class="equipment-image">
                        <img src="${imagePath}" alt="${item.name}">
                    </div>
                    <div class="equipment-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>Référence: ${item.reference}</p>
                        <div class="status ${item.status === 'available' ? 'available' : 'unavailable'}">
                            ${item.status === 'available' ? 'Disponible' : 'En location'}
                        </div>
                        <div class="equipment-actions">
                            <button class="rent-button ${item.status === 'available' ? '' : 'disabled'}">
                                ${item.status === 'available' ? 'Réserver' : 'Indisponible'}
                            </button>
                        </div>
                    </div>
                `;

                // Ajouter la fonction de réservation
                if (item.status === 'available') {
                    const rentButton = card.querySelector('.rent-button');
                    rentButton.addEventListener('click', function() {
                        if (isUserLoggedIn()) {
                            rentEquipment(item.id);
                        } else {
                            alert('Veuillez vous connecter pour réserver du matériel CACA');
                            document.getElementById('login-link').click();
                        }
                    });
                }

                catalogContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Erreur JSON ou réseau:", error);
            catalogContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        });
}



// Charger la liste d'équipements au chargement de la page catalogue
document.getElementById('catalog-link').addEventListener('click', function() {
    loadEquipment();
});

// Filtres pour le catalogue
const categoryFilter = document.getElementById('category-filter');
const availabilityFilter = document.getElementById('availability-filter');

if (categoryFilter && availabilityFilter) {
    categoryFilter.addEventListener('change', applyFilters);
    availabilityFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const category = categoryFilter.value;
    const availability = availabilityFilter.value;
    loadEquipment(category, availability);
}

// Fonction pour vérifier si l'utilisateur est connecté via session_status.php
async function isUserLoggedIn() {
    try {
        const response = await fetch('session_status.php');
        const data = await response.json();
        return data.logged_in; // Retourne true si l'utilisateur est connecté
    } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        return false;
    }
}

// Fonction pour réserver un équipement
function rentEquipment(equipmentId) {
    // Ouvrir un modal ou rediriger vers une page de réservation
    // Ici, on pourrait implémenter un modal simple pour sélectionner les dates
    alert('Fonctionnalité de réservation à implémenter');
    
    // Exemple d'implémentation à développer:
    
    const startDate = prompt('Date de début (YYYY-MM-DD):', '2025-03-01');
    const endDate = prompt('Date de fin (YYYY-MM-DD):', '2025-03-05');
    
    if (startDate && endDate) {
        const formData = new FormData();
        formData.append('equipment_id', equipmentId);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        
        fetch('rent_equipment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Réservation effectuée avec succès!');
                loadEquipment(); // Recharger la liste pour mettre à jour les disponibilités
            } else {
                alert('Erreur: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

        // Ajouter ce code à votre script.js ou dans une balise script

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirection en fonction du rôle
                    if (data.role === 'admin') {
                        window.location.href = '#admin-page';
                        document.getElementById('admin-link').click();
                    } else {
                        window.location.href = '#catalog-page';
                        document.getElementById('catalog-link').click();
                    }
                } else {
                    loginError.textContent = data.message;
                }
            })
            .catch(error => {
                loginError.textContent = 'Erreur de connexion au serveur';
                console.error('Error:', error);
            });
        });
    }
    
    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    const registerError = document.getElementById('register-error');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    this.reset();
                    // Afficher l'onglet de connexion
                    document.getElementById('login-link').click();
                } else {
                    registerError.textContent = data.message;
                }
            })
            .catch(error => {
                registerError.textContent = 'Erreur de connexion au serveur';
                console.error('Error:', error);
            });
        });
    }
});

        document.addEventListener('DOMContentLoaded', function() {

            const categoryFilter = document.getElementById("category-filter");
            const availabilityFilter = document.getElementById("availability-filter");
            const applyFiltersButton = document.getElementById("apply-filters");

            // Charger les équipements au chargement de la page
            loadEquipment();

            // Recharger les équipements lorsque l'utilisateur applique des filtres
            applyFiltersButton.addEventListener("click", function () {
                const category = categoryFilter.value;
                const availability = availabilityFilter.value;
                loadEquipment(category, availability);
            });

            const loginLink = document.getElementById('login-link');
            const catalogLink = document.getElementById('catalog-link');
            const adminLink = document.getElementById('admin-link');
            const contactLink = document.getElementById('contact-link');
            
            const loginPage = document.getElementById('login-page');
            const catalogPage = document.getElementById('catalog-page');
            const adminPage = document.getElementById('admin-page');
            const contactPage = document.getElementById('contact-page');
            
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllPages();
                loginPage.classList.remove('hidden');
            });
            
            catalogLink.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllPages();
                catalogPage.classList.remove('hidden');
            });
            
            adminLink.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllPages();
                adminPage.classList.remove('hidden');
            });
            
            contactLink.addEventListener('click', function(e) {
                e.preventDefault();
                hideAllPages();
                contactPage.classList.remove('hidden');
            });
            
            function hideAllPages() {
                loginPage.classList.add('hidden');
                catalogPage.classList.add('hidden');
                adminPage.classList.add('hidden');
                contactPage.classList.add('hidden');
            }
            
            // Fonctionnalité des onglets dans la page admin
            const tabs = document.querySelectorAll('.tab');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Enlever la classe active de tous les onglets
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Ajouter la classe active à l'onglet cliqué
                    this.classList.add('active');
                    
                    // Cacher tous les contenus d'onglets
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    
                    // Afficher le contenu de l'onglet sélectionné
                    document.getElementById(tabId).classList.remove('hidden');
                });
            });
        });