// src/api/axios.js
import axios from 'axios';
import authService from '../services/authService';

// Instance axios de base
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
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

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si erreur 401 et la requête n'a pas déjà été réessayée
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