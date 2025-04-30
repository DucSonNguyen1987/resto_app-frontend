import React, { UseState } from 'react';
import { UseDispatch, UseSelector } from 'react-redux';
import { disable2FA, setBackupCodes } from '../../reducers/authSlice';
import twoFactorService from '../../services/twoFactorService';
import { Link } from 'react-router-dom';

const twoFactorManagement = () => {
    const [password, setPassword] = UseState('');
    const [showDisableForm, setshowDisabledForm] = UseState(false);
    const [showBackupCodes, setshowBackupCodes] = UseState(false);
    const [isLoading, setIsLoading] = UseState(false);
    const [error, setError] = UseState('');
    const [successMessage, setSuccessMessage] = UseState('');

    const dispatch = UseDispatch();
    const { twoFactorEnabled, backUpCodes, role } = UseSelector(state => state.auth.value);


    // Check si l'utilisateur est ADMIN ou OWNER 
    const requiresTwoFactor = role === 'ADMIN' || role === 'OWNER';

    const handleDisable2FA = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const result = await twoFactorService.disable2FA(password);

            if (result.success) {
                dispatch(disable2FA());
                setshowDisabledForm(false);
                setPassword('');
                setSuccessMessage('L\'authentification à deux facteurs a été désactivée avec succès.')
            } else {
                setError(result.error || 'Erreur lors de la désactivation');
            }
        } catch (error) {
            console.error('Erreur lors de la désactivation 2FA:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateNewBackupCodes = async () => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const result = await twoFactorService.generateBackupCodes();

            if (result.success) {
                dispatch(setBackupCodes(result.data.backUpCodes));
                setshowBackupCodes(true);
                setSuccessMessage('De nouveaux codes de secours ont été générés avec succès.');
            } else {
                setError(result.error || 'Erreur lors de la génération des codes.');
            }
        } catch (error) {
            console.error('Erreur lors de la génération des codes de secours.');
            setError('Une erreur est survenue. veuillez réessayer');
        } finally {
            setIsLoading(false);
        }
    };

    // rendu pour les USERS

    const renderEnabled = () => {
        <div className='two-factor-enabled'>
            <div className='status-badge success'>
                <span className='icon'>✔</span>
                <span>Authentification à deux facteurs activée</span>
            </div>

            <div className='action-buttons'>
                <button
                    className='btn btn-secondary'
                    onClick={() => {
                        setshowBackupCodes(true);
                        setshowDisabledForm(false);
                    }}
                >
                    Voir les codes de secours
                </button>
                <button
                    className='btn btn-secondary'
                    onClick={handleGenerateNewBackupCodes}
                    disabled={isLoading}
                >
                    Générer de nouveaux codes
                </button>

                {!requiresTwoFactor && (
                    <button
                        className='btn btn-danger'
                        onClick={() => {
                            setshowBackupCodes(true);
                            setshowBackupCodes(false);
                        }}
                    >
                        Désactiver la 2FA
                    </button>
                )}

                {showBackupCodes && backUpCodes.length > 0 && (
                    <div className='backup-codes-container'>
                        <h3>Vos Codes de secours</h3>
                        <p>Conservez ces codes dans un endroit sûr.</p>

                        <div className='backup-codes-grid'>
                            {backUpCodes.map((code, i) => (
                                <div key={i} className='backup-code'>
                                    {code}
                                </div>
                            ))}
                        </div>

                        <button
                            className='btn btn-secondary'
                            onClick={() => window.print()}
                        >
                            Imprimer les codes
                        </button>
                        <button
                            className='btn btn-link'
                            onClick={() => setshowBackupCodes(false)}
                        >
                            Fermer
                        </button>
                    </div>
                )}

                {showDisableForm && !requiresTwoFactor && (
                    <div className='disable-form'>
                        <h3>Désactiver l'authentification à deux facteurs</h3>
                        <p>Pour désactiver la 2FA, veuillez confirmer votre mot de passe.</p>

                        <form onSubmit={handleDisable2FA}>
                            <div className='form-group'>
                                <label htmlFor='password'>Mot de passe</label>
                                <input
                                    type='password'
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Entrez votre mot de passe'
                                    required
                                />
                            </div>

                            <div className='form-actions'>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={() => setshowDisabledForm(false)}
                                >
                                    {isLoading ? 'Désactivation ...' : 'Confirmer la désactivation'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    };

    // rendu pour les USERS sans 2FA

    const renderDisabled = () => (
        <div className='two-factor-disabled'>
            <div className={`sataus-badge ${requiresTwoFactor ? 'warning' : 'neutral'}`}>
                <span className='icon'>{requiresTwoFactor ? '!' : 'i'}</span>
                <span>
                    {requiresTwoFactor
                    ? 'L\'authentification à deux facteurs est requise pour votre rôle'
                    : 'L\'authentification à deux facteurs n\'est pas activée'}
                </span>
            </div>

            <p>
                L'authentification à deux facteurs augmeente le niveau de sécurité...
            </p>
            {requiresTwoFactor && (
                <div className='required-notice'>
                    <p>
                        <strong>Important:</strong> En tant que {role}, vous devez configurer l'authentification à deux facteurs pour continuer à utiliser l'application.
                    </p>
                </div>
            )}

            <Link to='/setup-2fa' className= 'btn btn-primary'>
                Configurer l'authentification à deux facteurs
            </Link>
        </div>
    );

    return (
        <div className='two-factor-management'>
            <h2>Authentification à deux facteurs</h2>

            {successMessage && (
                <div className='success-mesage'>
                    {successMessage}
                </div>
            )}

            {error && (
                <div className='error-message'>
                    {error}
                </div>
            )}

            {twoFactorEnabled ? renderEnabled() : renderDisabled()}
        </div>
    );
};

export default twoFactorManagement;