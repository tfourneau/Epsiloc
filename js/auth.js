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
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
        return true;
    }
    return false;
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
        
        // Préremplir les formulaires avec les informations de l'utilisateur
        const contactNameInput = document.getElementById('contact-name');
        const contactEmailInput = document.getElementById('contact-email');
        if (contactNameInput) contactNameInput.value = currentUser.fullName;
        if (contactEmailInput) contactEmailInput.value = currentUser.email;
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
    // Rechercher l'utilisateur dans la base de données
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Créer une copie de l'utilisateur sans le mot de passe pour la session
        const userSession = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };
        
        // Enregistrer l'utilisateur dans le stockage local
        currentUser = userSession;
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        // Mettre à jour l'interface
        updateUIForLoggedInUser();
        return true;
    }
    
    return false;
}

/**
 * Inscrit un nouvel utilisateur
 * @param {string} fullName - Nom complet de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {boolean} - True si l'inscription réussit, false sinon
 */
function register(fullName, email, password) {
    // Vérifier si l'email est déjà utilisé
    if (users.some(u => u.email === email)) {
        return false;
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
        id: users.length + 1,
        fullName: fullName,
        email: email,
        password: password,
        role: "user" // Par défaut, tous les nouveaux utilisateurs sont des utilisateurs standard
    };
    
    // Ajouter l'utilisateur à la liste
    users.push(newUser);
    
    // Connecter automatiquement le nouvel utilisateur
    return login(email, password);
}

/**
 * Déconnecte l'utilisateur actuel
 */
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedInUser();
    
    // Rediriger vers la page d'accueil
    window.location.href = 'index.html';
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
