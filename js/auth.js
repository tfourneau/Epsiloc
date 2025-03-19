/**
 * auth.js - Gestion de l'authentification des utilisateurs
 * Ce fichier contient toutes les fonctions liées à la connexion, 
 * l'inscription et la gestion des sessions utilisateur
 */

// Structure de données pour les utilisateurs
let users = [
    {
        id: 1,
        fullName: "Admin Test",
        email: "admin@epsiloc.fr",
        password: "admin123",
        role: "admin"
    },
    {
        id: 2,
        fullName: "User Test",
        email: "user@epsiloc.fr",
        password: "user123",
        role: "user"
    }
];

// Gestion de la session utilisateur
let currentUser = null;

/**
 * Vérifie si un utilisateur est connecté au chargement de la page
 */
/**
 * auth.js - Gestion de l'authentification des utilisateurs
 * Ce fichier contient toutes les fonctions liées à la connexion,
 * l'inscription et la gestion des sessions utilisateur
 */

/**
 * Vérifie si un utilisateur est connecté au chargement de la page
 */
function checkLoginStatus() {
    fetch("session_status.php")  // Requête au serveur pour vérifier si l'utilisateur est connecté
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                currentUser = {
                    id: data.user_id,
                    fullName: data.user_name,
                    role: data.user_role
                };
                updateUIForLoggedInUser();
            }
        })
        .catch(error => console.log('Erreur de récupération de session:', error));
}

/**
 * Met à jour l'interface utilisateur en fonction du statut de connexion
 */
function updateUIForLoggedInUser() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userStatusElement = document.getElementById('user-status');
    const userNameElement = document.getElementById('user-name');
    const logoutLink = document.getElementById('logout-link');
    const adminLink = document.getElementById('admin-link');

    if (currentUser) {
        // Cacher les liens de connexion/inscription
        if (loginLink) loginLink.classList.add('hidden');
        if (registerLink) registerLink.classList.add('hidden');
        
        // Afficher les informations de l'utilisateur
        if (userStatusElement) userStatusElement.classList.remove('hidden');
        if (userNameElement) userNameElement.textContent = currentUser.fullName;
        
        // Afficher le lien d'administration uniquement pour les admins
        if (adminLink) {
            if (currentUser.role === 'admin') {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
            }
        }
    } else {
        // Afficher les liens de connexion/inscription
        if (loginLink) loginLink.classList.remove('hidden');
        if (registerLink) registerLink.classList.remove('hidden');
        
        // Cacher les informations de l'utilisateur
        if (userStatusElement) userStatusElement.classList.add('hidden');
        
        // Cacher le lien d'administration
        if (adminLink) adminLink.classList.add('hidden');
    }
}

/**
 * Connecte un utilisateur et met à jour l'interface
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {boolean} - True si la connexion réussit, false sinon
 */
function login(email, password) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Récupérer les informations utilisateur
            currentUser = {
                fullName: data.user_name,
                role: data.role
            };
            updateUIForLoggedInUser();
            window.location.href = 'index.html';  // Rediriger après connexion
        } else {
            // Afficher le message d'erreur
            const loginError = document.getElementById('login-error');
            if (loginError) {
                loginError.textContent = data.message;
            }
        }
    })
    .catch(error => console.log('Erreur de connexion:', error));
}

/**
 * Inscrit un nouvel utilisateur
 * @param {string} fullName - Nom complet de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {boolean} - True si l'inscription réussit, false sinon
 */
function register(fullName, email, password) {
    // Ajout de l'utilisateur à la liste (local ou serveur, selon ton implémentation)
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('password', password);

    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            login(email, password);  // Connecter l'utilisateur immédiatement après l'inscription
        } else {
            // Afficher l'erreur d'inscription
            const registerError = document.getElementById('register-error');
            if (registerError) {
                registerError.textContent = data.message;
            }
        }
    })
    .catch(error => console.log('Erreur d\'inscription:', error));
}

/**
 * Déconnecte l'utilisateur actuel
 */
function logout() {
    fetch('logout.php')
    .then(() => {
        currentUser = null;
        updateUIForLoggedInUser();
        window.location.href = 'index.html';  // Rediriger vers la page d'accueil après déconnexion
    })
    .catch(error => console.log('Erreur de déconnexion:', error));
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} - True si l'utilisateur est connecté, false sinon
 */
function isLoggedIn() {
    return currentUser !== null;
}

/**
 * Vérifie si l'utilisateur actuel est un administrateur
 * @returns {boolean} - True si l'utilisateur est admin, false sinon
 */
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

/**
 * Protège une page nécessitant une connexion
 * @param {boolean} adminRequired - True si la page nécessite des privilèges d'administrateur
 */
function protectPage(adminRequired = false) {
    if (!isLoggedIn()) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    
    if (adminRequired && !isAdmin()) {
        // Rediriger vers la page d'accueil si l'utilisateur n'est pas administrateur
        window.location.href = 'index.html';
        return;
    }
}

// Initialiser le statut de connexion au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    // Ajouter un gestionnaire d'événement pour le bouton de déconnexion
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});
