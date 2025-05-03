// src/services/mockTwoFactorService.js
/**
 * Service de simulation pour l'authentification à deux facteurs sans backend
 * Utilisé pour les tests de l'interface utilisateur
 */

// Simuler un délai réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Générer un QR code simulé (format base64)
const generateMockQRCode = () => {
  return 'data:image/png;base64,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';
};

// Générer une clé secrète simulée
const generateMockSecret = () => {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
};

// Générer des codes de secours simulés
const generateMockBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.push(code);
  }
  return codes;
};

// Simuler la validation d'un token 2FA
const validateToken = (token, secret) => {
  // Simuler la validation d'un code à 6 chiffres
  return token && token.length === 6 && !isNaN(parseInt(token, 10));
};

const mockTwoFactorService = {
  // Récupère les données de configuration pour le 2FA
  setup2FA: async () => {
    await delay(800); // Simuler un délai réseau
    
    const qrCode = generateMockQRCode();
    const secret = generateMockSecret();
    
    return {
      success: true,
      data: {
        qrCode,
        secret
      }
    };
  },
  
  // Vérifie et active la 2FA
  verify2FA: async (token) => {
    await delay(1000); // Simuler un délai réseau
    
    if (!token || token.length !== 6 || isNaN(parseInt(token, 10))) {
      return {
        success: false,
        error: 'Code invalide. Le code doit être à 6 chiffres.'
      };
    }
    
    // Codes de secours générés une fois que le 2FA est activé
    const backupCodes = generateMockBackupCodes();
    
    return {
      success: true,
      data: {
        backupCodes
      }
    };
  },
  
  // Désactive le 2FA
  disable2FA: async (password) => {
    await delay(800); // Simuler un délai réseau
    
    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Mot de passe invalide'
      };
    }
    
    return {
      success: true,
      message: 'Authentification à deux facteurs désactivée avec succès'
    };
  },
  
  // Vérifie le code 2FA lors de la connexion
  verifyLogin2FA: async (tempToken, token) => {
    await delay(700); // Simuler un délai réseau
    
    if (!tempToken) {
      return {
        success: false,
        error: 'Token temporaire invalide'
      };
    }
    
    if (!token || token.length !== 6 || isNaN(parseInt(token, 10))) {
      return {
        success: false,
        error: 'Code invalide. Le code doit être à 6 chiffres.'
      };
    }
    
    // Extraire l'ID utilisateur du tempToken (pour la simulation)
    const userId = tempToken.split('_').pop();
    
    // Simuler les données utilisateur après vérification 2FA réussie
    return {
      success: true,
      data: {
        id: userId,
        username: userId === '1' ? 'admin' : 'user',
        email: userId === '1' ? 'admin@example.com' : 'user@example.com',
        firstname: userId === '1' ? 'Admin' : 'Normal',
        lastname: userId === '1' ? 'User' : 'User',
        role: userId === '1' ? 'ADMIN' : 'USER',
        accessToken: `access_token_verified_${userId}`,
        refreshToken: `refresh_token_verified_${userId}`,
        twoFactorEnabled: true
      }
    };
  },
  
  // Génère de nouveaux codes de secours
  generateBackupCodes: async () => {
    await delay(600); // Simuler un délai réseau
    
    const backupCodes = generateMockBackupCodes();
    
    return {
      success: true,
      data: {
        backupCodes
      }
    };
  }
};

export default mockTwoFactorService;