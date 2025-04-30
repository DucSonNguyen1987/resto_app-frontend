import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {set2FASetupData, enable2FA, } from '../../reducers/authSlice.js';
import twoFactorService from '../../services/twoFactorService.js';

const TwoFactorSetup= () => {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const {setupQRCode, setupSecret, backupCodes} = useSelector( state => state.auth.value);

    useEffect(()=>{
        // Charger les données de configuration au montage
        if (step === 1 && !setupQRCode){
            loadSetupData();
        }
    }, []);

    const loadSetupData = async() => {
        setIsLoading(true);
        setError('');

        try {
            const result = await twoFactorService.setup2FA();

            if(result.success) {
                dispatch(set2FASetupData(result.data));
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

        try{
            const result= await twoFactorService.verify2FA(token);

            if(result.success) {
                dispatch(enable2FA(result.data));
                setStep(3); // Passer à l'affichage des codes de secours
            } else {
                setError(result.error || 'Code invalide. Veuillez réessayer');
            }
        } catch(error) {
            console.error('Erreur lors de la vérification 2FA:', error)
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    // Etape 1: Configuration avec QR code

    const renderSetupStep = () => (
        <div className='setup-step'>
            <h3>Etape 1: Configurer l'application d'authentification</h3>
            <p> Scannez le QR code ci-dessous avec votre application d'authentification
             ( comme Google Authenticator, Authy ou Microsoft Authenticator). 
             </p>

             {setupQRCode && (
                <div className='qr-code-container'>
                    <img src={setupQRCode} alt= 'QR Code 2FA' />
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
                disabled= {isLoading || !setupQRCode}
                >
                Continuer
                </button>
        </div>
    );

    // Etape 2 Vérification du code
    const renderVerifyStep = () => (
        <div className='verify-step'>
            <h3>Etape 2 : Vérification</h3>
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
                onChange={(e)=> setToken(e.target.value)}
                placeholder='Entrez le code à 6 chiffres'
                required
                autoComplete='off'
                />
            </div>

            {error && <div className='error-message'>{error}</div>}

            <div className="form-actions">
                <button
                type='button'
                className='btn btn-secondary'
                onClick={()=> setStep(1)}
                disabled={isLoading}
                >
                Retour
                </button>
                <button
                type='submit'
                className='btn btn-primary'
                disabled= {isLoading}
                >
                {isLoading ? 'Vérification...' : 'Vérifier et activer'}
                </button>
            </div>
            </form>
        </div>
    );

    // Etape 3 Affichage des codes de secours

    const renderBackupCodesStep = () => (
        <div className='backup-codes-step'>
            <h3>Etape 3 : Code de secours</h3>
            <p>
                Votre authentification à deux facteurs est maintenant activée.
                Pensez à noter ces codes.
                A utiliser si vous n'avez pas accès à votre application d'authentification
            </p>

            <div className='backup-codes-container'>
                {backupCodes.map((code, index) =>(
                    <div key={index} className='backup-code'>
                        {code}
                    </div>
                ))}
            </div>

            <p className='warning'>
                <strong>Important:</strong> Ces codes ne seront plus affichés. Pensez à les noter.
            </p>

            <div className='form-actions'>
                <button
                type='button'
                className='btn btn-primary'
                onClick={()=> window.print()}>
                    Imprimer les codes
                </button>
                <button
                type='button'
                className='btn btn-success'
                onClick={()=> window.location.href = '/account'}
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
            <div className={`progress-step ${step >=1 ? 'active' : ''}`}>1. Configuration</div>
            <div className={`progress-step ${step >=2 ? 'active' : ''}`}>1. Vérification</div>
            <div className={`progress-step ${step >=3 ? 'active' : ''}`}>1. Codes de secours</div>
        </div>

        {isLoading && step === 1 && <div className='loading'>Chargement...</div>}

        {step === 1 && renderSetupStep()}
        {step === 2 && renderVerifyStep()}
        {step === 3 && renderBackupCodesStep()}
        </div>
    )
};

export default TwoFactorSetup;