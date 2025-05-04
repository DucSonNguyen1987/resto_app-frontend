import api from '../api/axios';

/**
 * Service pour gérer les requêtes API liées à l'authentification
 */

const authService = {

    // Authentifie un User

    login: async (email, password) => {
        try {
            console.log('Attempting login with:', email);
            const response = await api.post('/auth/login', { email, password });
            
            // Check if 2FA is required
            if (response.data.requires2FA) {
                return {
                    success: true,
                    requires2FA: true,
                    tempToken: response.data.tempToken
                };
            }
            
            // Extract and normalize the user data
            const userData = response.data.data || response.data;
            console.log('Login successful, received data:', userData);
            
            // Ensure token is properly formatted in the store
            return { 
                success: true, 
                data: {
                    username: userData.username,
                    email: userData.email,
                    firstname: userData.firstname || '',
                    lastname: userData.lastname || '',
                    accessToken: userData.accessToken || userData.token,
                    refreshToken: userData.refreshToken,
                    role: userData.role || 'USER',
                    twoFactorEnabled: userData.twoFactorEnabled || false
                }
            };
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || 'Authentication failed'
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