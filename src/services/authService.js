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
            
            // Extract and normalize the user data
            const userData = response.data.data || response.data;
            console.log('Login successful, received data:', userData);
            
            // Ensure token is properly formatted in the store
            return { 
                success: true, 
                data: {
                    id: userData.id || userData._id,
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
            console.error('Login error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || 'Authentication failed'
                error: error.response?.data?.message || 'Authentication failed'
            };
        }
    },
    
    // Enregistre un nouvel USER
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            return { 
                success: true, 
                data: {
                    id: response.data.data.id || response.data.data._id,
                    username: response.data.data.username,
                    email: response.data.data.email,
                    firstname: response.data.data.firstname || '',
                    lastname: response.data.data.lastname || '',
                    accessToken: response.data.data.accessToken || response.data.data.token,
                    refreshToken: response.data.data.refreshToken,
                    role: response.data.data.role || 'USER',
                    twoFactorEnabled: response.data.data.twoFactorEnabled || false
                }
            };
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
            const response = await api.post('/auth/logout');
            return { success: true, message: response.data.message || 'Déconnexion réussie' };
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
            const response = await api.post('/auth/refreshToken', { refreshToken });
            return { 
                success: true, 
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken || refreshToken // Retourner le nouveau refreshToken s'il existe, sinon garder l'ancien
            };
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Session expirée'
            };
        }
    },

    // Récupérer les informations du profil utilisateur actuel
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/profile');
            const userData = response.data.data || response.data;
            
            return { 
                success: true, 
                data: {
                    id: userData.id || userData._id,
                    username: userData.username,
                    email: userData.email,
                    firstname: userData.firstname || '',
                    lastname: userData.lastname || '',
                    phone: userData.phone || '',
                    role: userData.role || 'USER',
                    twoFactorEnabled: userData.twoFactorEnabled || false
                }
            };
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la récupération du profil'
            };
        }
    },
    
    // Mettre à jour le profil utilisateur
    updateProfile: async (userData) => {
        try {
            const response = await api.put('/auth/profile', userData);
            const updatedUserData = response.data.data || response.data;
            
            return { 
                success: true, 
                data: {
                    id: updatedUserData.id || updatedUserData._id,
                    username: updatedUserData.username,
                    email: updatedUserData.email,
                    firstname: updatedUserData.firstname || '',
                    lastname: updatedUserData.lastname || '',
                    phone: updatedUserData.phone || '',
                    role: updatedUserData.role || 'USER',
                    twoFactorEnabled: updatedUserData.twoFactorEnabled || false
                }
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la mise à jour du profil'
            };
        }
    },
    
    // Changer le mot de passe
    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            
            return { 
                success: true, 
                message: response.data.message || 'Mot de passe modifié avec succès'
            };
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors du changement de mot de passe'
            };
        }
    }
};

export default authService;