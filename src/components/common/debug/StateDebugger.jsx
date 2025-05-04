// src/components/debug/StateDebugger.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const StateDebugger = () => {
  const auth = useSelector(state => state.auth.value);
  const user = useSelector(state => state.user.value);
  
  // Style pour le conteneur de débogage
  const debuggerStyle = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '10px',
    maxWidth: '400px',
    maxHeight: '300px',
    overflow: 'auto',
    fontSize: '12px',
    zIndex: '9999'
  };
  
  // Fonction pour afficher proprement une partie de l'état
  const renderState = (state, label) => {
    return (
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}:</div>
        <div style={{ 
          backgroundColor: '#f1f3f5', 
          padding: '5px', 
          borderRadius: '3px',
          maxHeight: '100px',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify({
              // Afficher les informations pertinentes seulement
              isAuthenticated: state.isAuthenticated,
              username: state.username,
              email: state.email,
              role: state.role,
              token: state.accessToken ? `${state.accessToken.substring(0, 15)}...` : 'Aucun',
              requires2FA: state.requires2FA,
              twoFactorEnabled: state.twoFactorEnabled
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  };
  
  return (
    <div style={debuggerStyle}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
        État Redux (DEBUG)
      </div>
      {renderState(auth, 'Auth')}
      {renderState(user, 'User')}
    </div>
  );
};

export default StateDebugger;