// src/services/mockAuthService.js
import { jwtDecode } from 'jwt-decode';

// Données utilisateur mockées
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

// Générer un token JWT simple
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
  
  // Simuler une signature (dans un environnement réel, elle serait cryptographique)
  const signature = btoa('mockSignature');
  
  return `${headerStr}.${payloadStr}.${signature}`;
};

const mockAuthService = {
  // Connexion avec email et mot de passe
  login: async (email, password) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return {
        success: false,
        error: 'Identifiants invalides'
      };
    }
    
    // Si l'utilisateur a la 2FA activée, renvoyer un token temporaire
    if (user.twoFactorEnabled) {
      return {
        success: true,
        requires2FA: true,
        tempToken: `temp_token_${user.id}`
      };
    }
    
    // Générer des tokens JWT
    const accessToken = generateToken(user, '1h');
    const refreshToken = generateToken(user, '7d');
    
    // Stocker les tokens dans localStorage
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
  
  // Déconnexion
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return { success: true };
  },
  
  // Rafraîchir le token
  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return { success: false, error: 'Pas de token de rafraîchissement' };
    }
    
    try {
      // Décoder le token pour obtenir les informations de l'utilisateur
      const decoded = jwtDecode(refreshToken);
      const userId = decoded.sub;
      
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }
      
      // Générer un nouveau token d'accès
      const accessToken = generateToken(user, '1h');
      
      // Stocker le nouveau token
      localStorage.setItem('accessToken', accessToken);
      
      return {
        success: true,
        accessToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token invalide'
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

export default mockAuthService;