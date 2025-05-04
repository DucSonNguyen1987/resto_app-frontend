// components/Setup2FA.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Setup2FA.css'; // Créez ce fichier CSS pour le style

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Récupérer le token d'authentification
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('Vous devez être connecté pour configurer la 2FA');
        navigate('/login');
        return;
      }

      // Faire la requête à l'endpoint correct
      const response = await axios.get('http://localhost:3000/2fa/setup', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.result) {
        setQrCode(response.data.data.qrCode);
        setSecret(response.data.data.secret);
      } else {
        setError(response.data.error || 'Erreur lors de la configuration 2FA');
      }
    } catch (err) {
      console.error('Erreur 2FA setup:', err);
      
      // Gérer les différents types d'erreurs
      if (err.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        if (err.response.status === 403) {
          setError('Vous n\'avez pas les permissions requises (ADMIN ou OWNER uniquement)');
        } else {
          setError(err.response.data.error || 'Erreur lors de la configuration 2FA');
        }
      } else if (err.request) {
        // La requête a été faite mais pas de réponse
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        setError('Une erreur est survenue: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Veuillez entrer le code de vérification');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const accessToken = localStorage.getItem('accessToken');
      
      // Vérifier le token 2FA
      const response = await axios.post('http://localhost:3000/2fa/verify', {
        token,
        secret
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.result) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard'); // Rediriger vers le tableau de bord
        }, 2000);
      } else {
        setError(response.data.error || 'Code invalide');
      }
    } catch (err) {
      console.error('Erreur vérification 2FA:', err);
      setError(err.response?.data?.error || 'Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="setup-2fa-container">Chargement...</div>;
  }

  if (success) {
    return (
      <div className="setup-2fa-container">
        <h2>Configuration 2FA réussie !</h2>
        <p>Vous allez être redirigé vers le tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="setup-2fa-container">
      <h2>Configuration de l'authentification à deux facteurs</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="qr-code-container">
        {qrCode && <img src={qrCode} alt="QR Code pour 2FA" />}
      </div>
      
      <div className="instructions">
        <p>1. Scannez le QR code ci-dessus avec votre application d'authentification (Google Authenticator, Authy, etc.)</p>
        <p>2. Si vous ne pouvez pas scanner le code, entrez ce code dans votre application :</p>
        <div className="secret-key">{secret}</div>
        <p>3. Entrez le code généré par votre application pour vérifier la configuration :</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Code à 6 chiffres"
            maxLength="6"
          />
        </div>
        
        <div className="button-group">
          <button type="submit" className="verify-button" disabled={isLoading}>
            Vérifier et activer
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/dashboard')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setup2FA;