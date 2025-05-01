import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../reducers/authSlice.js';
import authService from '../../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const requires2FA = useSelector(state => state.auth.value.requires2FA);

    // Si le user doit compléter la 2FA, le rediriger vers cette page
    React.useEffect(() => {
        if (requires2FA) {
            navigate('/verify-2fa');
        }
    }, [requires2FA, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await authService.login(email, password);

            if (result.success) {
                if (result.requires2FA) {
                    // Si 2FA est requis, stocker le TempToken et rediriger
                    dispatch(login({ requires2FA: true, tempToken: result.tempToken }));
                    navigate('/verify-2fa');
                } else {
                    // Sinon, procéder à la connexion normale
                    dispatch(login(result.data));
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Identifiants invalides');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
            setError('Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-card'>
                <h2>Connexion</h2>

                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type="email"
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Entrez votre email'
                            required
                        />
                    </div>
                
                    <div className='form-group'>
                        <label htmlFor='password'>Mot de passe</label>
                        <input
                            type="password"
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Entrez votre mot de passe'
                            required
                        />
                    </div>

                    {error && <div className='error-message'>{error}</div>}

                    <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className='auth-footer'>
                    <p>
                        Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;