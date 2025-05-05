// src/services/mockTwoFactorService.js
import { jwtDecode } from 'jwt-decode';

let bypassSetupCheck = true; // Variable pour contourner la vérification en développement

// Données utilisateur mockées (les mêmes que dans mockAuthService)
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    firstname: 'Admin',
    lastname: 'User',
    phone: '+33123456789',
    role: 'ADMIN',
    twoFactorEnabled: false
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    password: 'manager123',
    firstname: 'Manager',
    lastname: 'User',
    phone: '+33123456780',
    role: 'MANAGER',
    twoFactorEnabled: false
  },
  {
    id: '3',
    username: 'staff',
    email: 'staff@example.com',
    password: 'staff123',
    firstname: 'Staff',
    lastname: 'User',
    phone: '+33123456781',
    role: 'STAFF',
    twoFactorEnabled: false
  },
  {
    id: '4',
    username: 'twofa',
    email: 'twofa@example.com',
    password: 'twofa123',
    firstname: 'TwoFA',
    lastname: 'User',
    phone: '+33123456782',
    role: 'ADMIN',
    twoFactorEnabled: true
  }
];

// Fonction pour générer un token JWT
const generateToken = (user, expiresIn = '1h') => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresIn === '1h' ? 3600 : 86400);
  
  const payload = {
    sub: user.id,
    name: user.username,
    email: user.email,
    role: user.role,
    iat: now,
    exp
  };
  
  // Encoder en base64
  const headerStr = btoa(JSON.stringify(header));
  const payloadStr = btoa(JSON.stringify(payload));
  
  // Simuler une signature
  const signature = btoa('mockSignature');
  
  return `${headerStr}.${payloadStr}.${signature}`;
};

// Fonction pour générer des codes de secours
const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.push(`${code.slice(0, 3)}-${code.slice(3)}`);
  }
  return codes;
};

// Stocker les états temporaires (normalement côté serveur)
const tempState = {
  setupSecrets: {},  // { userId: secret }
  tempTokens: {},    // { tempToken: userId }
  backupCodes: {}    // { userId: [codes] }
};

const mockTwoFactorService = {
  // Générer un nouveau secret et QR code pour le setup 2FA
  setup2FA: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Récupérer l'ID utilisateur à partir du token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return {
        success: false,
        error: 'Non authentifié'
      };
    }
    
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      
      // Générer un "secret" mock
      const secret = `SECRET${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Stocker le secret temporairement
      tempState.setupSecrets[userId] = secret;
      
      // Simuler un QR code (normalement, ce serait une URL otpauth)
      // Dans un cas réel, on utiliserait QRCode.toDataURL avec une URL otpauth
      const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;
      
      return {
        success: true,
        data: {
          secret,
          qrCode
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token invalide'
      };
    }
  },
  
  // Vérifier le code OTP lors de la configuration
  verify2FASetup: async (token, code) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
     // En mode développement, accepter toujours 123456 sans vérifier le secret
  if (bypassSetupCheck && code === '123456') {
    // Générer des codes de secours
    const backupCodes = generateBackupCodes();

    // Simuler la mise à jour de l'utilisateur
    const userId = token || 'defaultUserId';
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].twoFactorEnabled = true;
    }
    
    // Stocker les codes
    tempState.backupCodes[userId] = backupCodes;
    
    return {
      success: true,
      data: {
        backupCodes
      }
    };
  }

    // Simuler la vérification du code (normalement via une bibliothèque OTP)
    // Accepter '123456' comme code valide pour le test
    if (code !== '123456') {
      return {
        success: false,
        error: 'Code invalide'
      };
    }
    
    // Récupérer l'ID utilisateur
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return {
        success: false,
        error: 'Non authentifié'
      };
    }
    
    try {
      const decoded = jwtDecode(accessToken);
      const userId = decoded.sub;
      
      // Vérifier que le secret existe
      if (!tempState.setupSecrets[userId]) {
        return {
          success: false,
          error: 'Configuration non initialisée'
        };
      }
      
      // Générer des codes de secours
      const backupCodes = generateBackupCodes();
      tempState.backupCodes[userId] = backupCodes;
      
      // Mettre à jour l'utilisateur pour activer la 2FA
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].twoFactorEnabled = true;
      }
      
      return {
        success: true,
        data: {
          backupCodes
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token invalide'
      };
    }
  },
  
  // Vérifier le code OTP lors de la connexion
  verify2FA: async (tempToken, code) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Vérifier que le token temporaire est valide
    const userId = tempToken.replace('temp_token_', '');
    if (!userId) {
      return {
        success: false,
        error: 'Token temporaire invalide'
      };
    }
    
    // Simuler la vérification du code (dans un environnement réel, utiliser une bibliothèque OTP)
    // Accepter '123456' comme code valide pour les tests
    if (code !== '123456' && !tempState.backupCodes[userId]?.includes(code)) {
      return {
        success: false,
        error: 'Code invalide'
      };
    }
    
    // Trouver l'utilisateur
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }
    
    // Générer des tokens JWT
    const accessToken = generateToken(user, '1h');
    const refreshToken = generateToken(user, '7d');
    
    // Stocker les tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        accessToken,
        refreshToken
      }
    };
  },
  
  // Désactiver la 2FA
  disable2FA: async (password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Récupérer l'utilisateur à partir du token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return {
        success: false,
        error: 'Non authentifié'
      };
    }
    
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      
      // Trouver l'utilisateur
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }
      
      // Pour la démo, accepter n'importe quel mot de passe
      // Dans un environnement réel, il faudrait vérifier le mot de passe
      
      // Désactiver la 2FA
      mockUsers[userIndex].twoFactorEnabled = false;
      
      // Supprimer les codes de secours
      delete tempState.backupCodes[userId];
      
      return {
        success: true,
        message: 'Authentification à deux facteurs désactivée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token invalide'
      };
    }
  },
  
  // Générer de nouveaux codes de secours
  generateBackupCodes: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Récupérer l'utilisateur à partir du token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return {
        success: false,
        error: 'Non authentifié'
      };
    }
    
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      
      // Vérifier que la 2FA est activée
      const user = mockUsers.find(u => u.id === userId);
      if (!user || !user.twoFactorEnabled) {
        return {
          success: false,
          error: 'La 2FA n\'est pas activée pour cet utilisateur'
        };
      }
      
      // Générer de nouveaux codes
      const backupCodes = generateBackupCodes();
      tempState.backupCodes[userId] = backupCodes;
      
      return {
        success: true,
        data: {
          backupCodes
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token invalide'
      };
    }
  }
};

export default mockTwoFactorService;