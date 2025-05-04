// src/api/axios.js - version corrigée
import axios from 'axios';
import { setAccessToken } from '../reducers/userSlice';

let store;

// Fonction pour injecter le store dans le module
export const injectStore = _store => {
  store = _store;
}

// Récupération de l'URL du backend depuis les variables d'environnement
// Avec une valeur par défaut au cas où la variable d'environnement n'est pas définie
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Création de l'instance axios avec la bonne URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    // Ajouter un timeout pour éviter des attentes infinies
    timeout: 10000
});

// Fonction pour obtenir les tokens actuels
const getAuthTokens = () => {
  const state = store?.getState();
  const reduxAccessToken = state?.user?.value?.accessToken;
  const reduxRefreshToken = state?.user?.value?.refreshToken;
  
  // Vérifier aussi dans localStorage pour des cas particuliers
  const localAccessToken = localStorage.getItem('accessToken');
  
  // Log pour débogage
  console.log('Tokens disponibles:', {
    reduxAccessToken: !!reduxAccessToken,
    localAccessToken: !!localAccessToken
  });
  
  return {
    accessToken: reduxAccessToken || localAccessToken,
    refreshToken: reduxRefreshToken || localStorage.getItem('refreshToken')
  };
};

// Intercepteur pour les requêtes
api.interceptors.request.use(
    (config) => {
        try {
            // Récupérer le token d'accès
            const { accessToken } = getAuthTokens();
            
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
                console.log('✅ Token ajouté à la requête:', config.url);
            } else {
                console.log('❌ Pas de token disponible pour:', config.url);
                
                // Pour les endpoints qui ne nécessitent pas d'authentification
                if (config.url.includes('/login') || 
                    config.url.includes('/register') || 
                    config.url.includes('/health-check')) {
                    console.log('Requête sans authentification autorisée');
                }
            }
            
            return config;
        } catch (error) {
            console.error('Erreur dans l\'intercepteur de requête:', error);
            return config; // Continuer la requête même en cas d'erreur
        }
    },
    (error) => {
        console.error('Erreur avant envoi de la requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        try {
            // Traitement uniquement pour les erreurs 401 (non autorisé)
            if (error.response?.status === 401 && !originalRequest._retry && store) {
                console.log('Tentative de rafraîchissement du token...');
                originalRequest._retry = true;
                
                const { refreshToken } = getAuthTokens();
                
                if (!refreshToken) {
                    console.error('Pas de refresh token disponible');
                    // Rediriger vers la page de connexion
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
                
                try {
                    // Requête pour rafraîchir le token
                    const response = await axios.post(`${API_URL}/auth/refreshToken`, { refreshToken });
                    
                    if (response.data && response.data.accessToken) {
                        const newAccessToken = response.data.accessToken;
                        
                        // Mise à jour du token dans Redux
                        store.dispatch(setAccessToken(newAccessToken));
                        
                        // Mise à jour du localStorage
                        localStorage.setItem('accessToken', newAccessToken);
                        
                        // Ajouter le nouveau token à la requête originale
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        
                        console.log('Token rafraîchi avec succès');
                        
                        // Réessayer la requête originale
                        return axios(originalRequest);
                    } else {
                        console.error('Format de réponse invalide lors du rafraîchissement du token');
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    console.error('Erreur lors du rafraîchissement du token:', refreshError);
                    
                    // Si le refreshToken est invalide, déconnecter l'utilisateur
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    
                    // Rediriger vers la page de connexion
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            
            // Gestion des erreurs 403 (Interdit)
            if (error.response?.status === 403) {
                console.error('Erreur 403: Accès interdit');
                // Ici, vous pouvez gérer spécifiquement les erreurs d'autorisation
                // Par exemple, rediriger vers une page d'erreur ou afficher un message
            }
            
            // Gestion des erreurs de timeout
            if (error.code === 'ECONNABORTED') {
                console.error('Erreur de timeout: la requête a pris trop de temps');
            }
            
            // Gestion des erreurs réseau
            if (error.message === 'Network Error') {
                console.error('Erreur réseau: impossible de se connecter au serveur');
                // Vous pouvez afficher un message à l'utilisateur ici
            }
            
        } catch (handlingError) {
            console.error('Erreur lors du traitement de l\'erreur:', handlingError);
        }
        
        return Promise.reject(error);
    }
);

// Fonction utilitaire pour tester la connexion au backend
export const testConnection = async () => {
    try {
        const response = await api.get('/health-check');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Erreur lors du test de connexion:', error);
        return { success: false, error: error.message };
    }
};

export default api;