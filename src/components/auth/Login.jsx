import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../reducers/authSlice.js';
import { loginUser } from '../../actions/authActions.js';
import authService from '../../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const requires2FA = useSelector(state => state.user.value.requires2FA);

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
            const resultAction = await dispatch(loginUser({ email, password }));
            const result = resultAction.payload;
            
            if (result.requires2FA) {
              navigate('/verify-2fa');
            } else if (result.success) {
              navigate('/dashboard');
            }
          } catch (error) {
            setError(error.message);
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