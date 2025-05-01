import api from '../api/axios';

/**
 * Service pour gérer les requêtes API liées à l'authentification
 */

const authService = {

    // Authentifie un USEr

    login: async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password })

            // Check si 2FA est requis
            if (response.data.requires2FA) {
                return {
                    success: true,
                    requires2FA: true,
                    tempToken: response.data.tempToken
                };
            }

            // Login réussi sans 2FA
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Identifiants invalides'
            };
        }
    },
    // Enregistre un nouvel USER
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de l\'inscription'
            };
        }
    },

    // Déconnecte le USER
    logout: async () => {
        try {
            const response = await api.post('/users/logout');
            return { success: true, message: response.data.data };
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la déconnexion'
            };
        }
    },

    // Refresh le token
    refreshToken: async (refreshToken) => {
        try {
            const response = await api.post('/users/refreshToken', { refreshToken });
            return { success: true, accessToken: response.data.accessToken };
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Session expirée'
            };
        }
    },


    getCurrentUser: async (userData) => {
        try {
            const response = await api.post('/users/account', userData);
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Identifiant non trouvé', error)        
            return {
                success: false, 
                error: error.response?.data?.error || 'User non trouvé'
            }
        }
    }
};

export default authService;                                                        