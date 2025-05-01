import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verify2FA } from '../../reducers/authSlice';
import twoFactorService from '../../services/twoFactorService';
import { useNavigate } from 'react-router-dom';

const TwoFactorVerify = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUsingBackupCode, setIsUsingBackupCode] = useState(false);

    const tempToken = useSelector(state => state.auth.value.tempToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await twoFactorService.verifyLogin2FA(tempToken, token);

            if(result.success) {
                dispatch(verify2FA(result.data));
                navigate('/dashboard'); // Rediriger vers le tableau de bord après connexion réussie
            } else {
                setError(result.error || 'Code invalide. Veuillez réessayer')
            } 
        } catch(error) {
            console.error('Erreur lors de la vérification 2FA:', error);
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBackupCode = () => {
        setIsUsingBackupCode(!isUsingBackupCode);
        setToken('');
        setError('');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Vérification à deux facteurs</h2>
                <p>
                    {isUsingBackupCode
                    ? 'Veuillez entrer un de vos codes de secours.'
                    : 'Veuillez entrer le code généré par votre application d\'authentification.'
                    }
                </p>

                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='token'>
                            {isUsingBackupCode ? 'Code de secours' :'Code d\'authentification'}
                        </label>
                        <input
                        type='text'
                        id='token'
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder={isUsingBackupCode ? 'Entrez le code de secours' : "Entrez le code à 6 chiffres"}
                        required
                        autoComplete='off'
                        />
                    </div>

                    {error && <div className='error-message'>{error}</div>}

                    <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Vérification...' : 'Vérifier'}
                    </button>
                </form>

                <div className='auth-footer'>
                    <button
                        className='btn btn-link'
                        onClick={toggleBackupCode}>
                            {isUsingBackupCode
                            ? 'Utiliser le code d\'authentification'
                            : 'Utiliser un code de secours'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorVerify;