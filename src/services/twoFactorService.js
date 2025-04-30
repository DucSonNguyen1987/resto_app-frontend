import api from '../api/axios';


/**
 * Service pour gérer les requêtes API liées à l'authentification à deux facteurs
 */

const twoFactorService = {

    // Récupère les données de configuration pour le 2FA

    setup2FA: async () => {
        try {
            const response = await api.get('/2fa/setup');
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Erreur lors de la configuration 2FA:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la configuration 2FA'
            };
        }
    },

    // Vérifie et active la 2FA

    verify2FA: async (token) => {
        try {
            const response = await api.post('/2fa/verify', { token });
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error('Erreur lors de la vérification 2FA:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Code invalide'
            };
        }
    },

    // Désactive le 2FA 
    disable2FA: async (password) => {
        try {
            const response = await api.post('/2fa/disable', { password });
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Erreur lors de la désactivation 2FA:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la déactivation'
            };
        }
    },

    // Vérifie le code 2FA lors de la connexion
    verifyLogin2FA : async(tempToken, token) => {
        try {
            const response = await api.post('/2fa/login-verify', { tempToken, token});
            return { success: true, data : response.data.data};
        } catch(error) {
            console.error('Erreur lors de la vérification 2FA pour login:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Code invalide'
            };
        }
    },

    // Génère de nouveaux codes

    generateBackupCodes : async () => {
        try {
            const response = await api.post('/2fa/generate-backup-codes');
            return {success: true, data: response.data.data};
        } catch(error) {
            console.error('Erreur lors de la génération des codes de secours:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Erreur lors de la génération des codes'
            };
        }
    }

};

export default twoFactorService;
