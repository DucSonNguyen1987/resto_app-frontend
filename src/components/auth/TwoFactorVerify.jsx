// src/components/auth/TwoFactorVerify.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verify2FA } from '../../reducers/userSlice';
import twoFactorService from '../../services/twoFactorService';
import '../../styles/2fa.css';

const TwoFactorVerify = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get authentication state from Redux store
  const { requires2FA, tempToken, isAuthenticated } = useSelector(state => state.user.value);

  // Redirect if not requiring 2FA or already authenticated
  useEffect(() => {
    if (!requires2FA && !tempToken) {
      navigate('/login');
    } else if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [requires2FA, tempToken, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!code.trim()) {
      setError('Veuillez entrer le code d\'authentification');
      return;
    }

    try {
      setIsLoading(true);
      
      // Verify 2FA code
      const result = await twoFactorService.verify2FA(tempToken, code);
      
      if (result.success) {
        // Dispatch verification success to update store
        dispatch(verify2FA(result.data));
        navigate('/dashboard');
      } else {
        setError(result.error || 'Code invalide');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Une erreur est survenue lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Vérification à deux facteurs</h2>
        <p>
          Veuillez entrer le code généré par votre application d'authentification.
        </p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Code d'authentification</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Entrez le code à 6 chiffres"
              maxLength="6"
              autoFocus
              disabled={isLoading}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Vous n'avez pas accès à votre application d'authentification ? Contactez votre administrateur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerify;