import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../reducers/userSlice';
import authService from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/2fa.css';

const Register = () => {
    // États pour les champs du formulaire
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // États pour la gestion du chargement et des erreurs
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Validation des champs de formulaire
    const validateForm = () => {
        // Validation du nom d'utilisateur (au moins 3 caractères)
        if (username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return false;
        }

        // Validation de l'email avec une expression régulière simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Veuillez entrer une adresse email valide');
            return false;
        }

        // Validation du mot de passe (au moins 6 caractères)
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        // Vérification de la correspondance des mots de passe
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Réinitialisation de l'erreur
        setError('');
        
        // Validation du formulaire
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Création de l'objet avec les données utilisateur
            const userData = {
                username,
                firstname,
                lastname,
                email,
                phone,
                password
            };

            // Appel au service d'authentification pour l'inscription
            const result = await authService.register(userData);

            if (result.success) {
                // Stockage des données utilisateur dans Redux
                dispatch(login(result.data));
                
                // Redirection vers le tableau de bord
                navigate('/dashboard');
            } else {
                // Affichage du message d'erreur retourné par le serveur
                setError(result.error || 'Une erreur est survenue lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Créer un compte</h2>

                <form onSubmit={handleSubmit}>
                    {/* Champ Nom d'utilisateur */}
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entrez votre nom d'utilisateur"
                            required
                        />
                    </div>

                    {/* Champs Prénom et Nom */}
                    <div className="d-flex">
                        <div className="form-group" style={{ marginRight: '10px', flex: 1 }}>
                            <label htmlFor="firstname">Prénom</label>
                            <input
                                type="text"
                                id="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="Entrez votre prénom"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="lastname">Nom</label>
                            <input
                                type="text"
                                id="lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                placeholder="Entrez votre nom"
                                required
                            />
                        </div>
                    </div>

                    {/* Champ Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>

                    {/* Champ Téléphone */}
                    <div className="form-group">
                        <label htmlFor="phone">Téléphone</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Entrez votre numéro de téléphone"
                            required
                        />
                    </div>

                    {/* Champs Mot de passe et Confirmation */}
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmez votre mot de passe"
                            required
                        />
                    </div>

                    {/* Affichage des erreurs */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </button>
                </form>

                {/* Lien vers la page de connexion */}
                <div className="auth-footer">
                    <p>
                        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;