// src/api/axios.js
import axios from 'axios';
import authService from '../services/mockAuthService'; // Utiliser directement le service mock

// Instance axios de base
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL fixe pendant le développement
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store Redux pour dispatch des actions
let store;

// Méthode pour injecter le store
export const injectStore = (_store) => {
  store = _store;
};

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gérer manuellement les erreurs 404 pour éviter qu'elles ne remontent
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si l'erreur est 404, loguer l'URL pour le débogage
    if (error.response?.status === 404) {
      console.warn(`Erreur 404: URL non trouvée: ${error.config.url}`);
      // Pour le développement, retourner une réponse simulée au lieu de rejeter l'erreur
      if (error.config.url.includes('/2fa/setup')) {
        console.log("Simulation d'une réponse pour /2fa/setup");
        return {
          data: {
            success: true,
            data: {
              qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
              secret: "MOCKQRSECRET123456"
            }
          }
        };
      }
    }
    
    // Si erreur 401 et la requête n'a pas déjà été réessayée
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Essayer de rafraîchir le token
        const result = await authService.refreshToken();
        
        if (result.success) {
          // Mettre à jour le token dans l'en-tête de la requête originale
          originalRequest.headers['Authorization'] = `Bearer ${result.accessToken}`;
          // Réessayer la requête
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        if (store) {
          store.dispatch({ type: 'user/logout' });
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;