// authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Configuration des en-têtes par défaut
const setAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Service pour la connexion
export const login = async (credentials) => {
  try {
    // Utilisation du bon endpoint
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    
    if (response.data.result) {
      // Vérifier si 2FA est requis
      if (response.data.requires2FA) {
        return {
          result: true,
          requires2FA: true,
          tempToken: response.data.tempToken
        };
      }
      
      const { accessToken, refreshToken } = response.data.data;
      
      // Stocker les tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      setAuthHeader();
      
      return { result: true, data: response.data.data };
    } else {
      throw new Error(response.data.error || 'Échec de la connexion');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Service pour la vérification 2FA lors de la connexion
export const verify2FALogin = async (tempToken, token) => {
  try {
    const response = await axios.post(`${API_URL}/2fa/login-verify`, {
      tempToken,
      token
    });
    
    if (response.data.result) {
      const { accessToken, refreshToken } = response.data.data;
      
      // Stocker les nouveaux tokens après 2FA
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      
      setAuthHeader();
      
      return { result: true, data: response.data.data };
    } else {
      throw new Error(response.data.error || 'Échec de la vérification 2FA');
    }
  } catch (error) {
    console.error('Erreur de vérification 2FA:', error);
    throw error;
  }
};

// Service pour la configuration 2FA
export const setup2FA = async () => {
  try {
    setAuthHeader();
    const response = await axios.get(`${API_URL}/2fa/setup`);
    
    if (response.data.result) {
      return { result: true, data: response.data.data };
    } else {
      throw new Error(response.data.error || 'Échec de la configuration 2FA');
    }
  } catch (error) {
    console.error('Erreur de configuration 2FA:', error);
    throw error;
  }
};

// Service pour vérifier et activer 2FA
export const verify2FASetup = async (token) => {
  try {
    setAuthHeader();
    const response = await axios.post(`${API_URL}/2fa/verify`, { token });
    
    if (response.data.result) {
      return { result: true, data: response.data.data };
    } else {
      throw new Error(response.data.error || 'Échec de la vérification du code');
    }
  } catch (error) {
    console.error('Erreur de vérification 2FA:', error);
    throw error;
  }
};

// Service pour désactiver 2FA
export const disable2FA = async (password) => {
  try {
    setAuthHeader();
    const response = await axios.post(`${API_URL}/2fa/disable`, { password });
    
    if (response.data.result) {
      return { result: true };
    } else {
      throw new Error(response.data.error || 'Échec de la désactivation 2FA');
    }
  } catch (error) {
    console.error('Erreur de désactivation 2FA:', error);
    throw error;
  }
};

// Service pour la déconnexion
export const logout = async () => {
  try {
    setAuthHeader();
    await axios.post(`${API_URL}/users/logout`);
    
    // Nettoyer les données de session
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return { result: true };
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    // Nettoyer quand même les données
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

// Service pour rafraîchir le token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Pas de refresh token disponible');
    }
    
    const response = await axios.post(`${API_URL}/users/refreshToken`, { refreshToken });
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      setAuthHeader();
      return { result: true };
    } else {
      throw new Error('Échec du rafraîchissement du token');
    }
  } catch (error) {
    console.error('Erreur de rafraîchissement du token:', error);
    throw error;
  }
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!token && !!user;
};

// Récupérer les informations de l'utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Vérifier si l'utilisateur a un rôle spécifique
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Intercepteur pour gérer automatiquement les erreurs 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si erreur 401 et pas déjà en train d'essayer de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenter de rafraîchir le token
        await refreshToken();
        
        // Refaire la requête originale avec le nouveau token
        return axios(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Rediriger vers la page de connexion
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Initialiser l'en-tête d'autorisation au chargement du service
setAuthHeader();

export default {
  login,
  logout,
  setup2FA,
  verify2FASetup,
  verify2FALogin,
  disable2FA,
  refreshToken,
  isAuthenticated,
  getCurrentUser,
  hasRole
};