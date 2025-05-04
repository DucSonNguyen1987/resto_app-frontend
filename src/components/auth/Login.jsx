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
            console.log('Attempting login with:', email);
            
            const result = await authService.login(email, password);
            console.log('Login result:', result);
            
            if (result.success) {
                if (result.requires2FA) {
                    console.log('2FA required, dispatching with token:', result.tempToken);
                    dispatch(login({ 
                        requires2FA: true, 
                        tempToken: result.tempToken 
                    }));
                    navigate('/verify-2fa');
                } else {
                    console.log('Login successful, dispatching user data');
                    dispatch(login(result.data));
                    
                }
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
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