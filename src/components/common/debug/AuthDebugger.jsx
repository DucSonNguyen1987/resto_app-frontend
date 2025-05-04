// src/components/debug/AuthDebugger.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../store/store';

const AuthDebugger = () => {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Récupérer l'état d'authentification
  const auth = useSelector(state => state.user.value);
  
  // Fonction pour tester la connexion
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/health-check');
      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Connexion réussie' : `Erreur HTTP ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de connexion: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour tester l'authentification
  const testAuth = async () => {
    setIsLoading(true);
    try {
      // Utiliser le token présent dans le state Redux
      const token = auth.accessToken;
      if (!token) {
        return {
          success: false,
          message: 'Aucun token disponible'
        };
      }
      
      const response = await fetch('http://localhost:3000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        return {
          success: false,
          message: 'Token invalide ou expiré (Erreur 401)'
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          message: 'Accès interdit (Erreur 403)'
        };
      }
      
      if (!response.ok) {
        return {
          success: false,
          message: `Erreur de l'API: ${response.status}`
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        message: 'Authentification réussie',
        data
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de requête: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour lancer le diagnostic complet
  const runDiagnostic = async () => {
    setIsLoading(true);
    
    try {
      // Vérifier la connexion
      const connectionTest = await testConnection();
      
      // Si la connexion échoue, inutile de continuer
      if (!connectionTest.success) {
        setResults({
          success: false,
          issue: 'connection',
          ...connectionTest
        });
        return;
      }
      
      // Vérifier l'authentification
      const authTest = await testAuth();
      
      // Récupérer les informations sur les tokens stockés
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Collecter toutes les informations pour le diagnostic
      setResults({
        connection: connectionTest,
        auth: authTest,
        tokens: {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken
        },
        redux: {
          isAuthenticated: auth.isAuthenticated,
          role: auth.role,
          requires2FA: auth.requires2FA,
          hasAccessToken: !!auth.accessToken,
          hasRefreshToken: !!auth.refreshToken
        },
        success: connectionTest.success && authTest.success,
        message: authTest.success ? 'Diagnostic réussi' : authTest.message
      });
    } catch (error) {
      setResults({
        success: false,
        message: `Erreur lors du diagnostic: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour réinitialiser l'authentification
  const resetAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    alert('Tokens supprimés avec succès. Veuillez rafraîchir la page.');
  };
  
  return (
    <div className="auth-debugger" style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#f8f9fa',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      width: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Débogueur d'authentification</h3>
      
      <div style={{ display: 'flex', marginBottom: '10px', gap: '10px' }}>
        <button 
          onClick={runDiagnostic}
          disabled={isLoading}
          style={{
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: '1'
          }}
        >
          {isLoading ? 'Chargement...' : 'Diagnostiquer'}
        </button>
        
        <button 
          onClick={resetAuth}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: '1'
          }}
        >
          Réinitialiser
        </button>
      </div>
      
      {Object.keys(results).length > 0 && (
        <div className="diagnostic-results" style={{
          backgroundColor: results.success ? '#e8f5e9' : '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
            {results.success ? '✅ Tout fonctionne correctement' : `❌ ${results.message}`}
          </p>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#4a90e2',
              cursor: 'pointer',
              padding: '0',
              textDecoration: 'underline'
            }}
          >
            {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
          </button>
          
          {showDetails && (
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <p><strong>Connexion:</strong> {results.connection?.success ? '✅' : '❌'} {results.connection?.message}</p>
              <p><strong>Authentification:</strong> {results.auth?.success ? '✅' : '❌'} {results.auth?.message}</p>
              <p><strong>Tokens localStorage:</strong> Access: {results.tokens?.accessToken ? '✅' : '❌'}, Refresh: {results.tokens?.refreshToken ? '✅' : '❌'}</p>
              <p><strong>Redux:</strong> Auth: {results.redux?.isAuthenticated ? '✅' : '❌'}, Role: {results.redux?.role || 'aucun'}</p>
            </div>
          )}
        </div>
      )}
      
      <div style={{ fontSize: '12px', color: '#666' }}>
        <p style={{ margin: '0' }}>État actuel:</p>
        <p style={{ margin: '5px 0' }}>Authentifié: {auth.isAuthenticated ? '✅' : '❌'}</p>
        <p style={{ margin: '0' }}>Token: {auth.accessToken ? '✅' : '❌'}</p>
      </div>
    </div>
  );
};

export default AuthDebugger;