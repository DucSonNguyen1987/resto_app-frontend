import api from '../api/axios';

/**
 * Service pour gérer les requêtes API liées à l'authentification
 */

const authService = {

    // Authentifie un USEr

    login: async (email, password) => {
        try {
            console.log('Tentative de connexion:', email);
            const response = await api.post('/users/login', { email, password });
            console.log('Réponse de connexion:', response.data);
            console.log('Structure de la réponse:', {
                data: response.data,
                nestedData: response.data.data,
                hasData: !!response.data.data
            });

            // Check si 2FA est requis
            if (response.data.requires2FA) {
                return {
                    success: true,
                    requires2FA: true,
                    tempToken: response.data.tempToken
                };
            }

            // Vérifiez la structure de la réponse
            const userData = response.data.data || response.data;
            console.log('Données utilisateur extraites:', userData);

            // Créez un objet conforme à la structure attendue
            const normalizedUserData = {
                username: userData.username || '',
                email: userData.email || '',
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                accessToken: userData.accessToken || userData.token || '',  // Parfois le token peut avoir un nom différent
                refreshToken: userData.refreshToken || '',
                role: userData.role || 'USER',  // Valeur par défaut si non fourni
                twoFactorEnabled: userData.twoFactorEnabled || false
            };

            console.log('Données normalisées:', normalizedUserData);

            // Vérifiez que toutes les propriétés attendues existent
            const expectedProps = ['username', 'email', 'firstname', 'lastname', 'accessToken', 'refreshToken', 'role'];
            const missingProps = expectedProps.filter(prop => !userData[prop]);

            if (missingProps.length > 0) {
                console.warn('Propriétés manquantes dans la réponse:', missingProps);
            }



            // Login réussi sans 2FA
            return { success: true, data: response.data.data || response.data };
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