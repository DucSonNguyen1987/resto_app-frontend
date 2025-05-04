// src/services/authService.js
import axios from '../api/axios';
import jwtDecode from 'jwt-decode';

const authService = {
  // Connexion avec email et mot de passe
  login: async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      
      // Si 2FA est requis, retourner le token temporaire
      if (response.data.requires2FA) {
        return {
          success: true,
          requires2FA: true,
          tempToken: response.data.tempToken
        };
      }
      
      // Sinon, connexion normale
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      return {
        success: true,
        data: {
          ...response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  },
  
  // Déconnexion
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return { success: true };
  },
  
  // Rafraîchir le token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return { success: false, error: 'Pas de token de rafraîchissement' };
      }
      
      const response = await axios.post('/users/refresh-token', { refreshToken });
      
      localStorage.setItem('accessToken', response.data.accessToken);
      
      return {
        success: true,
        accessToken: response.data.accessToken
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de rafraîchissement du token'
      };
    }
  },
  
  // Vérifier si le token est valide
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      // Vérifier si le token n'est pas expiré
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};

export default authService;