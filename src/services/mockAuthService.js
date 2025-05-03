/**
 * Service de simulation pour l'authentification sans backend
 * Utilisé pour les tests de l'interface utilisateur
 */

// Données utilisateur simulées
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstname: 'Admin',
    lastname: 'User',
    password: 'password123',
    role: 'ADMIN',
    twoFactorEnabled: false
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    firstname: 'Normal',
    lastname: 'User',
    password: 'password123',
    role: 'USER',
    twoFactorEnabled: false
  }
];

// Simuler un délai réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockAuthService = {
  // Authentifie un utilisateur
  login: async (email, password) => {
    await delay(800); // Simuler un délai réseau
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return {
        success: false,
        error: 'Identifiants invalides'
      };
    }
    
    // Si l'utilisateur a activé 2FA, on demande une vérification
    if (user.twoFactorEnabled) {
      return {
        success: true,
        requires2FA: true,
        tempToken: `temp_token_${user.id}`
      };
    }
    
    // Login réussi sans 2FA
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        accessToken: `access_token_${user.id}`,
        refreshToken: `refresh_token_${user.id}`,
        twoFactorEnabled: user.twoFactorEnabled
      }
    };
  },
  
  // Enregistre un nouvel utilisateur
  register: async (userData) => {
    await delay(1000); // Simuler un délai réseau
    
    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const emailExists = mockUsers.some(u => u.email === userData.email);
    const usernameExists = mockUsers.some(u => u.username === userData.username);
    
    if (emailExists) {
      return {
        success: false,
        error: 'Cet email est déjà utilisé'
      };
    }
    
    if (usernameExists) {
      return {
        success: false,
        error: 'Ce nom d\'utilisateur est déjà utilisé'
      };
    }
    
    // Créer un nouvel utilisateur simulé
    const newUser = {
      id: `${mockUsers.length + 1}`,
      ...userData,
      role: 'USER',
      twoFactorEnabled: false
    };
    
    // Dans une implémentation réelle, on sauvegarderait l'utilisateur dans la base de données
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        role: newUser.role,
        accessToken: `access_token_${newUser.id}`,
        refreshToken: `refresh_token_${newUser.id}`,
        twoFactorEnabled: newUser.twoFactorEnabled
      }
    };
  },
  
  // Déconnecte l'utilisateur
  logout: async () => {
    await delay(500); // Simuler un délai réseau
    return {
      success: true,
      message: 'Déconnexion réussie'
    };
  },
  
  // Rafraîchit le token d'accès
  refreshToken: async (refreshToken) => {
    await delay(500); // Simuler un délai réseau
    
    // Extraire l'ID utilisateur du refreshToken (pour la simulation)
    const userId = refreshToken.split('_').pop();
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: 'Session expirée'
      };
    }
    
    return {
      success: true,
      accessToken: `new_access_token_${user.id}`
    };
  },

  // Mettre à jour le statut 2FA d'un utilisateur (pour la simulation)
  updateUser2FAStatus: async (userId, enabled) => {
    await delay(500);

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].twoFactorEnabled = enabled;
      return { success: true };
    }

    return { success: false, error: 'Utilisateur non trouvé' };
  },

  // Récupérer les informations d'un utilisateur
  getCurrentUser: async () => {
    await delay(700);
    // Simuler un utilisateur connecté (l'admin)
    const user = mockUsers[0];
    
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled
      }
    };
  }
};

export default mockAuthService;