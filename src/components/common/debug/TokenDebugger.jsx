import React from 'react';
import { useSelector } from 'react-redux';

const TokenDebugger = () => {
  
  const user = useSelector(state => state.user.value);
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px',
      backgroundColor: '#f8f8f8', 
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '8px',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '200px',
      overflow: 'auto',
      zIndex: 9999,
      opacity: 0.9
    }}>
      <h4 style={{ margin: '0 0 8px 0' }}>User Debug</h4>
      <div>
      <strong>Username:</strong> {user.username}
      </div>
      <div>
        <strong>Authenticated user:</strong> {user.isAuthenticated ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Token:</strong> {user.accessToken ? 
          `${user.accessToken.substring(0, 15)}...` : 
          'None'}
      </div>
      <div>
        <strong>Role:</strong> {user.role || 'None'}
      </div>
      <div>
        <strong>2FA Required:</strong> {user.requires2FA ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>2FA Enabled:</strong> {user.twoFactorEnabled ? 'Yes' : 'No'}
      </div>

      <h4 style={{ margin: '0 0 8px 0' }}>User Debug</h4>

      <div>
        <strong>Username:</strong> {user.username || 'Username'}
      </div>
      <div>
        <strong>Authenticated:</strong> {user.isAuthenticated ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Token:</strong> {user.accessToken ? 
          `${user.accessToken.substring(0, 15)}...` : 
          'None'}
      </div>
      <div>
        <strong>Role:</strong> {user.role || 'None'}
      </div>
      <div>
        <strong>2FA Required:</strong> {user.requires2FA ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>2FA Enabled:</strong> {user.twoFactorEnabled ? 'Yes' : 'No'}
      </div>

      
    </div>



    
  );
};

export default TokenDebugger;