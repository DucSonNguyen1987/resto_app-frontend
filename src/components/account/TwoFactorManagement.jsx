import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { disable2FA, setBackupCodes } from '../../reducers/authSlice';
import twoFactorService from '../../services/twoFactorService';
import { Link } from 'react-router-dom';
import '../../styles/2fa.css';

const TwoFactorManagement = () => {
    const [password, setPassword] = useState('');
    const [showDisableForm, setShowDisableForm] = useState(false);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const dispatch = useDispatch();
    const { twoFactorEnabled, backupCodes, role } = useSelector(state => state.auth.value);

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
                setShowDisableForm(false);
                setPassword('');
                setSuccessMessage('L\'authentification à deux facteurs a été désactivée avec succès.');
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
                dispatch(setBackupCodes(result.data.backupCodes));
                setShowBackupCodes(true);
                setSuccessMessage('De nouveaux codes de secours ont été générés avec succès.');
            } else {
                setError(result.error || 'Erreur lors de la génération des codes.');
            }
        } catch (error) {
            console.error('Erreur lors de la génération des codes de secours:', error);
            setError('Une erreur est survenue. veuillez réessayer');
        } finally {
            setIsLoading(false);
        }
    };

    // Rendu pour les USERS avec 2FA activée
    const renderEnabled = () => (
        <div className='two-factor-enabled'>
            <div className='status-badge success'>
                <span className='icon'>✔</span>
                <span>Authentification à deux facteurs activée</span>
            </div>

            <div className='action-buttons'>
                <button
                    className='btn btn-secondary'
                    onClick={() => {
                        setShowBackupCodes(true);
                        setShowDisableForm(false);
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
                            setShowDisableForm(true);
                            setShowBackupCodes(false);
                        }}
                    >
                        Désactiver la 2FA
                    </button>
                )}

                {showBackupCodes && backupCodes && backupCodes.length > 0 && (
                    <div className='backup-codes-container'>
                        <h3>Vos Codes de secours</h3>
                        <p>Conservez ces codes dans un endroit sûr.</p>

                        <div className='backup-codes-grid'>
                            {backupCodes.map((code, i) => (
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
                            onClick={() => setShowBackupCodes(false)}
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
                                    onClick={() => setShowDisableForm(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type='submit'
                                    className='btn btn-danger'
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Désactivation...' : 'Confirmer la désactivation'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );

    // Rendu pour les USERS sans 2FA
    const renderDisabled = () => (
        <div className='two-factor-disabled'>
            <div className={`status-badge ${requiresTwoFactor ? 'warning' : 'neutral'}`}>
                <span className='icon'>{requiresTwoFactor ? '!' : 'i'}</span>
                <span>
                    {requiresTwoFactor
                        ? 'L\'authentification à deux facteurs est requise pour votre rôle'
                        : 'L\'authentification à deux facteurs n\'est pas activée'}
                </span>
            </div>

            <p>
                L'authentification à deux facteurs augmente le niveau de sécurité de votre compte en ajoutant une couche de protection supplémentaire.
            </p>
            {requiresTwoFactor && (
                <div className='required-notice'>
                    <p>
                        <strong>Important:</strong> En tant que {role}, vous devez configurer l'authentification à deux facteurs pour continuer à utiliser l'application.
                    </p>
                </div>
            )}

            <Link to='/setup-2fa' className='btn btn-primary'>
                Configurer l'authentification à deux facteurs
            </Link>
        </div>
    );

    return (
        <div className='two-factor-management'>
            <h2>Authentification à deux facteurs</h2>

            {successMessage && (
                <div className='success-message'>
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

export default TwoFactorManagement;