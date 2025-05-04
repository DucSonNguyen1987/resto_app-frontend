// src/components/auth/TwoFactorSetup.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set2FASetupData, enable2FA } from '../../reducers/userSlice';
import twoFactorService from '../../services/twoFactorService';
import '../../styles/2fa.css';

const TwoFactorSetup = () => {
  // États pour les étapes du processus
  const [currentStep, setCurrentStep] = useState(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Récupérer l'état d'authentification du store Redux
  const { 
    isAuthenticated, 
    twoFactorEnabled, 
    setupQRCode, 
    setupSecret, 
    role 
  } = useSelector(state => state.user.value);

  // Rediriger si l'utilisateur n'est pas authentifié ou a déjà activé 2FA
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (twoFactorEnabled && !setupCompleted) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, twoFactorEnabled, setupCompleted, navigate]);

  // Récupérer les données de configuration 2FA lors du chargement du composant
  useEffect(() => {
    const fetchSetupData = async () => {
      if (!setupQRCode || !setupSecret) {
        try {
          setIsLoading(true);
          const result = await twoFactorService.setup2FA();
          
          if (result.success) {
            dispatch(set2FASetupData(result.data));
          } else {
            setError('Erreur lors de la génération des données de configuration');
          }
        } catch (error) {
          console.error('2FA setup error:', error);
          setError('Une erreur est survenue lors de la configuration');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (currentStep === 1) {
      fetchSetupData();
    }
  }, [dispatch, setupQRCode, setupSecret, currentStep]);

  // Gestion de la soumission du code de vérification
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!code.trim()) {
      setError('Veuillez entrer le code d\'authentification');
      return;
    }

    try {
      setIsLoading(true);
      
      // Vérifier le code OTP
      const result = await twoFactorService.verify2FASetup(setupSecret, code);
      
      if (result.success) {
        // Activer 2FA et stocker les codes de secours
        dispatch(enable2FA(result.data));
        setSetupCompleted(true);
        setCurrentStep(3);
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

  // Gestion du retour au dashboard après la configuration
  const handleComplete = () => {
    navigate('/dashboard');
  };

  // Rendu de l'étape 1: Configuration de l'application d'authentification
  const renderStep1 = () => (
    <div className="setup-step">
      <h3>Étape 1: Configuration de l'application d'authentification</h3>
      <p>
        Pour configurer l'authentification à deux facteurs, vous devez d'abord installer une application d'authentification sur votre appareil mobile.
      </p>
      <p>
        Applications recommandées:
      </p>
      <ul>
        <li>Google Authenticator</li>
        <li>Microsoft Authenticator</li>
        <li>Authy</li>
      </ul>

      <p>
        Une fois l'application installée, suivez ces étapes:
      </p>
      <ol>
        <li>Ouvrez votre application d'authentification</li>
        <li>Ajoutez un nouveau compte (généralement en appuyant sur le "+" ou "Ajouter")</li>
        <li>Scannez le code QR ci-dessous ou entrez manuellement la clé secrète</li>
      </ol>

      {isLoading ? (
        <div className="loading-indicator">Chargement...</div>
      ) : setupQRCode ? (
        <div className="qr-code-container">
          <img src={setupQRCode} alt="QR Code pour authentification à deux facteurs" />
        </div>
      ) : null}

      {setupSecret && (
        <div className="secret-key">
          <p>Clé secrète (en cas de problème avec le QR code):</p>
          <code>{setupSecret}</code>
        </div>
      )}

      <div className="form-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setCurrentStep(2)}
          disabled={!setupQRCode || !setupSecret || isLoading}
        >
          Continuer
        </button>
      </div>
    </div>
  );

  // Rendu de l'étape 2: Vérification du code
  const renderStep2 = () => (
    <div className="setup-step">
      <h3>Étape 2: Vérification du code</h3>
      <p>
        Veuillez entrer le code à 6 chiffres affiché dans votre application d'authentification pour vérifier que la configuration a bien été effectuée.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleVerifyCode}>
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
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCurrentStep(1)}
            disabled={isLoading}
          >
            Retour
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
          </button>
        </div>
      </form>
    </div>
  );

  // Rendu de l'étape 3: Configuration terminée
  const renderStep3 = () => {
    const { backupCodes } = useSelector(state => state.user.value);
    
    return (
      <div className="setup-step">
        <h3>Configuration terminée</h3>
        <div className="success-message">
          <p>L'authentification à deux facteurs a été activée avec succès sur votre compte.</p>
        </div>

        {backupCodes && backupCodes.length > 0 && (
          <div className="backup-codes-container">
            <h4>Codes de secours</h4>
            <p>
              Conservez ces codes de secours dans un endroit sûr. Ils vous permettront d'accéder à votre compte si vous n'avez pas accès à votre application d'authentification.
            </p>
            <div className="backup-codes-grid">
              {backupCodes.map((code, index) => (
                <div key={index} className="backup-code">
                  {code}
                </div>
              ))}
            </div>
            <p className="warning">
              <strong>Attention:</strong> Ces codes ne seront plus jamais affichés. Assurez-vous de les sauvegarder maintenant!
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              Imprimer les codes
            </button>
          </div>
        )}

        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleComplete}
          >
            Terminer
          </button>
        </div>
      </div>
    );
  };

  // Affichage des étapes de configuration
  const renderSetupProgress = () => (
    <div className="setup-progress">
      <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
        Configuration
      </div>
      <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
        Vérification
      </div>
      <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
        Terminé
      </div>
    </div>
  );

  // Pour les utilisateurs ADMIN et OWNER, afficher un message indiquant que 2FA est obligatoire
  const renderRequiredMessage = () => {
    if (['ADMIN', 'OWNER'].includes(role)) {
      return (
        <div className="required-notice">
          <p>
            <strong>Important:</strong> En tant que {role}, l'authentification à deux facteurs est obligatoire pour votre compte pour des raisons de sécurité.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Configuration de l'authentification à deux facteurs</h2>
        
        {renderRequiredMessage()}
        {renderSetupProgress()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default TwoFactorSetup;