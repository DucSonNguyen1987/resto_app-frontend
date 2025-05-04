

/**
 * Utilitaire pour déboguer les problèmes d'authentification
 */

// Fonction pour tester la connexion et les tokens
export const testConnection = async (baseUrl = 'http://localhost:3000/users/login') => {
    try {
      // Test simple de connexion sans authentification
      const response = await fetch(`${baseUrl}`);
      
      console.log('=== TEST DE CONNEXION ===');
      console.log(`Status: ${response.status}`);
      console.log(`OK?: ${response.ok}`);
      
      if (!response.ok) {
        console.error('Erreur de connexion au serveur. Vérifiez que le serveur backend est lancé.');
        return {
          success: false,
          message: 'Impossible de se connecter au serveur. Vérifiez que le backend est lancé.'
        };
      }
      
      return {
        success: true,
        message: 'Connexion au serveur réussie'
      };
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error);
      return {
        success: false,
        message: `Erreur lors du test de connexion: ${error.message}`
      };
    }
  };
  
  // Fonction pour vérifier les tokens stockés
  export const checkStoredTokens = () => {
    console.log('=== VÉRIFICATION DES TOKENS STOCKÉS ===');
    
    // Vérifier le localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log(`Access Token présent: ${!!accessToken}`);
    console.log(`Refresh Token présent: ${!!refreshToken}`);
    
    if (accessToken) {
      // Afficher un extrait du token pour débogage
      console.log(`Access Token début: ${accessToken.substring(0, 15)}...`);
      
      // Vérifier si le token est potentiellement expiré (structure JWT)
      try {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp) {
            const expirationDate = new Date(payload.exp * 1000);
            const isExpired = expirationDate < new Date();
            console.log(`Token expiré: ${isExpired}`);
            console.log(`Date d'expiration: ${expirationDate}`);
          }
        }
      } catch  {
        console.error('Format de token non-JWT ou invalide');
      }
    }
    
    return {
      accessTokenPresent: !!accessToken,
      refreshTokenPresent: !!refreshToken
    };
  };
  
  // Fonction pour tester une requête authentifiée
  export const testAuthenticatedRequest = async (baseUrl = 'http://localhost:3000', endpoint = '/me') => {
    try {
      console.log('=== TEST DE REQUÊTE AUTHENTIFIÉE ===');
      
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Pas de token d\'accès pour tester la requête authentifiée');
        return {
          success: false,
          message: 'Pas de token d\'accès disponible'
        };
      }
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.status === 401) {
        console.error('Erreur 401: Non autorisé. Token invalide ou expiré.');
        return {
          success: false,
          message: 'Token non valide ou expiré'
        };
      }
      
      if (response.status === 403) {
        console.error('Erreur 403: Accès interdit. Permissions insuffisantes.');
        return {
          success: false,
          message: 'Permissions insuffisantes'
        };
      }
      
      if (!response.ok) {
        console.error(`Erreur ${response.status} lors de la requête authentifiée`);
        return {
          success: false,
          message: `Erreur ${response.status}`
        };
      }
      
      const data = await response.json();
      console.log('Réponse:', data);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erreur lors du test de requête authentifiée:', error);
      return {
        success: false,
        message: `Erreur: ${error.message}`
      };
    }
  };
  
  // Fonction pour réinitialiser les tokens
  export const clearTokens = () => {
    console.log('=== RÉINITIALISATION DES TOKENS ===');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('Tokens supprimés avec succès');
  };
  
  // Fonction pour déboguer l'état Redux
  export const debugReduxState = (store) => {
    if (!store) {
      console.error('Store Redux non disponible');
      return;
    }
    
    console.log('=== ÉTAT REDUX ACTUEL ===');
    const state = store.getState();
    
    // Éviter d'afficher l'intégralité des tokens dans la console
    const userState = state.user || {};
    const authState = userState.value || {};
    
    console.log('User authentifié:', authState.isAuthenticated);
    console.log('Rôle utilisateur:', authState.role);
    console.log('2FA requis:', authState.requires2FA);
    console.log('Tokens présents:', {
      accessToken: !!authState.accessToken,
      refreshToken: !!authState.refreshToken
    });
    
    return {
      isAuthenticated: authState.isAuthenticated,
      role: authState.role,
      requires2FA: authState.requires2FA,
      hasTokens: !!(authState.accessToken && authState.refreshToken)
    };
  };
  
  // Export d'une fonction de diagnostic complet
  export const runFullDiagnostic = async (store, baseUrl = 'http://localhost:3000') => {
    console.log('======== DIAGNOSTIC COMPLET D\'AUTHENTIFICATION ========');
    
    // 1. Vérifier la connexion au serveur
    const connectionResult = await testConnection(baseUrl);
    if (!connectionResult.success) {
      console.error('❌ Échec du test de connexion');
      return {
        success: false,
        issue: 'connection',
        message: connectionResult.message
      };
    }
    console.log('✅ Test de connexion réussi');
    
    // 2. Vérifier les tokens locaux
    const tokensResult = checkStoredTokens();
    if (!tokensResult.accessTokenPresent) {
      console.warn('⚠️ Pas de token d\'accès stocké');
    } else {
      console.log('✅ Token d\'accès présent');
    }
    
    // 3. Vérifier l'état Redux
    const reduxState = debugReduxState(store);
    if (reduxState && !reduxState.isAuthenticated) {
      console.warn('⚠️ L\'utilisateur n\'est pas authentifié dans Redux');
    } else if (reduxState) {
      console.log('✅ L\'utilisateur est authentifié dans Redux');
    }
    
    // 4. Tester une requête authentifiée si possible
    if (tokensResult.accessTokenPresent) {
      const authRequestResult = await testAuthenticatedRequest(baseUrl);
      if (!authRequestResult.success) {
        console.error('❌ Échec de la requête authentifiée');
        return {
          success: false,
          issue: 'authentication',
          message: authRequestResult.message
        };
      }
      console.log('✅ Requête authentifiée réussie');
    }
    
    console.log('======== FIN DU DIAGNOSTIC ========');
    
    // Déterminer le résultat global
    if (!tokensResult.accessTokenPresent && !(reduxState && reduxState.isAuthenticated)) {
      return {
        success: false,
        issue: 'no_authentication',
        message: 'Aucune authentification détectée. Veuillez vous connecter.'
      };
    }
    
    return {
      success: true,
      message: 'Diagnostic terminé avec succès.'
    };
  };
  
  // Exporter une fonction pour afficher un composant de débogage
  export const createDebugComponent = (store) => {
    return () => {
      // Fonction pour lancer le diagnostic et afficher les résultats
      const runDiagnostic = async () => {
        await runFullDiagnostic(store);
      };
      
      // Retourner un composant React pour afficher dans l'interface
      return {
        component: (
          <div className="auth-debugger">
            <h3>Débogueur d'authentification</h3>
            <button onClick={runDiagnostic}>Lancer le diagnostic</button>
            <button onClick={clearTokens}>Effacer les tokens</button>
            <div className="debug-results">
              <p>Consultez la console pour les résultats détaillés</p>
            </div>
          </div>
        )
      };
    };
  };