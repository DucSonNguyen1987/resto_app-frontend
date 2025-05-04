// src/services/twoFactorService.js
import axios from '../api/axios';
import QRCode from 'qrcode';

const twoFactorService = {
  // Générer un nouveau secret et QR code pour le setup 2FA
  setup2FA: async () => {
    try {
      const response = await axios.post('/2fa/setup');
      
      // Générer un QR code à partir de l'URL otpauth
      const qrCode = await QRCode.toDataURL(response.data.otpauthUrl);
      
      return {
        success: true,
        data: {
          secret: response.data.secret,
          qrCode
        }
      };
    } catch (error) {
      console.error('2FA setup error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la configuration 2FA'
      };
    }
  },
  
  // Vérifier le code OTP lors de la configuration
  verify2FASetup: async (token, code) => {
    try {
      const response = await axios.post('/2fa/verify-setup', { token, code });
      
      return {
        success: true,
        data: {
          backupCodes: response.data.backupCodes
        }
      };
    } catch (error) {
      console.error('2FA verification error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Code invalide'
      };
    }
  },
  
  // Vérifier le code OTP lors de la connexion
  verify2FA: async (tempToken, code) => {
    try {
      const response = await axios.post('/2fa/verify', { tempToken, code });
      
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
      console.error('2FA login verification error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Code invalide'
      };
    }
  },
  
  // Désactiver la 2FA
  disable2FA: async (password) => {
    try {
      const response = await axios.post('/2fa/disable', { password });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('2FA disable error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la désactivation 2FA'
      };
    }
  },
  
  // Générer de nouveaux codes de secours
  generateBackupCodes: async () => {
    try {
      const response = await axios.post('/2fa/generate-backup-codes');
      
      return {
        success: true,
        data: {
          backupCodes: response.data.backupCodes
        }
      };
    } catch (error) {
      console.error('Generate backup codes error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la génération des codes de secours'
      };
    }
  }
};

export default twoFactorService;