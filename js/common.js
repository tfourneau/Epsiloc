/**
 * common.js - Fonctions communes utilisées dans plusieurs pages
 * Ce fichier contient des utilitaires et des fonctions partagées
 * entre les différentes pages du site
 */

/**
 * Affiche un message d'erreur pour un champ de formulaire
 * @param {string} elementId - ID du champ concerné
 * @param {string} message - Message d'erreur à afficher
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

/**
 * Efface les messages d'erreur d'un formulaire
 * @param {string} formId - ID du formulaire
 */
function clearErrors(formId) {
    const errorElements = document.querySelectorAll(`#${formId} .error-message`);
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
}

/**
 * Affiche une notification temporaire
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification (success, error, warning, info)
 * @param {number} duration - Durée d'affichage en millisecondes
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Vérifier si le conteneur de notifications existe
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        // Créer le conteneur s'il n'existe pas
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles de la notification
    notification.style.padding = '10px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    
    // Appliquer les couleurs en fonction du type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            notification.style.color = 'white';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            notification.style.color = 'white';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
            break;
    }
    
    // Ajouter la notification au conteneur
    notificationContainer.appendChild(notification);
    
    // Afficher la notification avec une animation
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Supprimer la notification après la durée spécifiée
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, duration);
}

/**
 * Formate un prix en euros
 * @param {number} price - Prix à formater
 * @returns {string} - Prix formaté (ex: 42,00 €)
 */
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

/**
 * Formate une date au format français
 * @param {Date} date - Date à formater
 * @returns {string} - Date formatée (ex: 01/01/2025)
 */
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Génère un identifiant unique
 * @returns {string} - Identifiant unique
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} - True si l'email est valide, false sinon
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Récupère les paramètres de l'URL
 * @returns {Object} - Objet contenant les paramètres de l'URL
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.slice(1);
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
        if (pair) {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    
    return params;
}

/**
 * Applique un filtre de recherche sur une collection d'éléments
 * @param {Array} collection - Collection d'éléments à filtrer
 * @param {Object} filters - Critères de filtrage
 * @returns {Array} - Collection filtrée
 */
function applyFilters(collection, filters) {
    return collection.filter(item => {
        // Vérifier chaque critère de filtre
        for (const [key, value] of Object.entries(filters)) {
            // Ignorer les filtres vides
            if (!value) continue;
            
            // Vérifier si la propriété existe et correspond au critère
            if (item[key] !== undefined && item[key].toString() !== value.toString()) {
                return false;
            }
        }
        return true;
    });
}

/**
 * Crée un élément HTML avec des attributs et du contenu
 * @param {string} tag - Nom de la balise HTML
 * @param {Object} attributes - Attributs à ajouter à l'élément
 * @param {string|HTMLElement|Array} content - Contenu à ajouter à l'élément
 * @returns {HTMLElement} - Élément HTML créé
 */
function createElement(tag, attributes = {}, content = null) {
    const element = document.createElement(tag);
    
    // Ajouter les attributs
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            element.className = value;
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Ajouter le contenu
    if (content !== null) {
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(item => {
                if (item instanceof HTMLElement) {
                    element.appendChild(item);
                } else if (typeof item === 'string') {
                    element.appendChild(document.createTextNode(item));
                }
            });
        }
    }
    
    return element;
}

/**
 * Initialise les écouteurs d'événements pour la navigation
 */
function initializeNavigation() {
    const links = {
        'home-link': 'index.html',
        'login-link': 'login.html',
        'register-link': 'register.html',
        'catalog-link': 'catalog.html',
        'admin-link': 'admin.html',
        'contact-link': 'support.html'
    };
    
    // Ajouter des écouteurs d'événements pour chaque lien
    for (const [id, url] of Object.entries(links)) {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Vérifier les permissions pour certaines pages
                if (id === 'admin-link' && (!isLoggedIn() || !isAdmin())) {
                    showNotification('Vous devez être connecté en tant qu\'administrateur pour accéder à cette page.', 'error');
                    return;
                }
                
                // Rediriger vers la page
                window.location.href = url;
            });
        }
    }
}

// Initialiser les fonctions communes au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    
    // Mettre en surbrillance le lien de navigation actif
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});
