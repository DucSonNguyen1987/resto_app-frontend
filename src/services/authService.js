import api from '../api/axios';

/**
 * Service pour gérer les requêtes API liées à l'authentification
 */

const authService = {
    // Authentifie un User
    login: async (email, password) => {
        try {
            console.log('Attempting login with:', email);
            const response = await api.post('/users/login', { email, password });
            
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
                    id: userData.id || userData._id,
                    username: userData.username,
                    email: userData.email,
                    firstname: userData.firstname || '',
                    lastname: userData.lastname || '',
                    accessToken: userData.accessToken || userData.token,
                    refreshToken: userData.refreshToken,
                    role: userData.role || 'USER',
                    twoFactorEnabled: userData.twoFactorEnabled || true
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
    
    // Rest of the authService methods...
    // (Keep the remaining methods unchanged)
};

export default authService;