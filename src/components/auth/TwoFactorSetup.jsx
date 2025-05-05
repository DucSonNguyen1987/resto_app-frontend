import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set2FASetupData, enable2FA } from '../../reducers/userSlice';
// Import du service mock au lieu du service réel pendant le développement
import mockTwoFactorService from '../../services/mockTwoFactorService';
import '../../styles/2fa.css';

// Utiliser le service mock directement en développement
const twoFactorService = mockTwoFactorService;

const TwoFactorSetup = () => {
  // États pour les étapes du processus
  const [currentStep, setCurrentStep] = useState(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
  // État local pour stocker les données de configuration si Redux échoue
  const [localSetupData, setLocalSetupData] = useState({
    qrCode: null,
    secret: null
  });

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
          console.log('Tentative de récupération des données 2FA');
          setIsLoading(true);
          const result = await twoFactorService.setup2FA();
          
          console.log('Résultat de setup2FA:', result);
          
          if (result.success) {
            // Mettre à jour Redux
            dispatch(set2FASetupData(result.data));
            // Backup local au cas où Redux échoue
            setLocalSetupData({
              qrCode: result.data.qrCode,
              secret: result.data.secret
            });
            console.log('Données 2FA définies:', result.data);
          } else {
            setError('Erreur lors de la génération des données de configuration');
            console.error('Échec de la génération des données 2FA:', result.error);
          }
        } catch (error) {
          console.error('2FA setup error détaillé:', error);
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

  // Le reste du code reste inchangé...

  // Modifié pour utiliser les données locales si Redux échoue
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
      ) : (setupQRCode || localSetupData.qrCode) ? (
        <div className="qr-code-container">
          <img src={setupQRCode || localSetupData.qrCode} alt="QR Code pour authentification à deux facteurs" />
        </div>
      ) : null}

      {(setupSecret || localSetupData.secret) && (
        <div className="secret-key">
          <p>Clé secrète (en cas de problème avec le QR code):</p>
          <code>{setupSecret || localSetupData.secret}</code>
        </div>
      )}

      <div className="form-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setCurrentStep(2)}
          disabled={(!setupQRCode && !localSetupData.qrCode) || (!setupSecret && !localSetupData.secret) || isLoading}
        >
          Continuer
        </button>
      </div>
    </div>
  );

  // Le reste du code reste inchangé...
};

export default TwoFactorSetup;