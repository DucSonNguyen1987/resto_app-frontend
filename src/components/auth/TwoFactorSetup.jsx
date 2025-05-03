import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set2FASetupData, enable2FA } from '../../reducers/authSlice.js';
import twoFactorService from '../../services/mockTwoFactorService.jsx';
import { useNavigate } from 'react-router-dom';
import '../../styles/2fa.css';

const TwoFactorSetup = () => {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setupQRCode, setupSecret, backupCodes } = useSelector(state => state.auth.value);

    useEffect(() => {
        // Charger les données de configuration au montage si nécessaire
        if (step === 1 && !setupQRCode) {
            loadSetupData();
        }
    }, [step, setupQRCode]);

    const loadSetupData = async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await twoFactorService.setup2FA();

            if (result.success) {
                // Mise à jour du store Redux avec les données reçues
                dispatch(set2FASetupData({
                    qrCode: result.data.qrCode,
                    secret: result.data.secret
                }));
            } else {
                setError(result.error || 'Erreur lors du chargement des données de configuration');
            }
        } catch (error) {
            console.error('Erreur lors de la configuration 2FA:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation simple du token
        if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
            setError('Veuillez entrer un code à 6 chiffres valide');
            setIsLoading(false);
            return;
        }

        try {
            const result = await twoFactorService.verify2FA(token);

            if (result.success) {
                // Activer la 2FA dans Redux
                dispatch(enable2FA({
                    backupCodes: result.data.backupCodes
                }));
                
                // Passer à l'étape d'affichage des codes de secours
                setStep(3);
            } else {
                setError(result.error || 'Code invalide. Veuillez réessayer');
            }
        } catch (error) {
            console.error('Erreur lors de la vérification 2FA:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    // Etape 1: Configuration avec QR code
    const renderSetupStep = () => (
        <div className='setup-step'>
            <h3>Étape 1: Configurer l'application d'authentification</h3>
            <p>
                Scannez le QR code ci-dessous avec votre application d'authentification
                (comme Google Authenticator, Authy ou Microsoft Authenticator).
            </p>

            {setupQRCode && (
                <div className='qr-code-container'>
                    <img src={setupQRCode} alt='QR Code 2FA' />
                </div>
            )}

            {setupSecret && (
                <div className='secret-key'>
                    <p>Ou entrez manuellement cette clé secrète dans votre application:</p>
                    <code>{setupSecret}</code>
                </div>
            )}

            <button
                className='btn btn-primary'
                onClick={() => setStep(2)}
                disabled={isLoading || !setupQRCode}
            >
                {isLoading ? 'Chargement...' : 'Continuer'}
            </button>
        </div>
    );

    // Etape 2: Vérification du code
    const renderVerifyStep = () => (
        <div className='verify-step'>
            <h3>Étape 2: Vérification</h3>
            <p>
                Entrez le code à 6 chiffres généré par votre application d'authentification pour vérifier la configuration.
            </p>

            <form onSubmit={handleVerifySubmit}>
                <div className='form-group'>
                    <label htmlFor='token'>Code d'authentification</label>
                    <input
                        type='text'
                        id='token'
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder='Entrez le code à 6 chiffres'
                        required
                        autoComplete='off'
                        maxLength="6"
                        pattern="\d{6}"
                    />
                </div>

                {error && <div className='error-message'>{error}</div>}

                <div className="form-actions">
                    <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={() => setStep(1)}
                        disabled={isLoading}
                    >
                        Retour
                    </button>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Vérification...' : 'Vérifier et activer'}
                    </button>
                </div>
            </form>
        </div>
    );

    // Etape 3: Affichage des codes de secours
    const renderBackupCodesStep = () => (
        <div className='backup-codes-step'>
            <h3>Étape 3: Codes de secours</h3>
            <p>
                Votre authentification à deux facteurs est maintenant activée.
                Conservez ces codes de secours dans un endroit sûr.
                À utiliser si vous n'avez pas accès à votre application d'authentification.
            </p>

            <div className='backup-codes-container'>
                {backupCodes && backupCodes.map((code, index) => (
                    <div key={index} className='backup-code'>
                        {code}
                    </div>
                ))}
            </div>

            <p className='warning'>
                <strong>Important:</strong> Ces codes ne seront plus affichés. Assurez-vous de les sauvegarder.
            </p>

            <div className='form-actions'>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => window.print()}>
                    Imprimer les codes
                </button>
                <button
                    type='button'
                    className='btn btn-success'
                    onClick={() => navigate('/dashboard')}
                >
                    Terminer
                </button>
            </div>
        </div>
    );

    return (
        <div className='two-factor-setup'>
            <h2>Configuration de l'authentification à deux facteurs</h2>
            <div className='two-factor-progress'>
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Configuration</div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Vérification</div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Codes de secours</div>
            </div>

            {isLoading && step === 1 && <div className='loading'>Chargement des données de configuration...</div>}

            {step === 1 && renderSetupStep()}
            {step === 2 && renderVerifyStep()}
            {step === 3 && renderBackupCodesStep()}
        </div>
    );
};

export default TwoFactorSetup;