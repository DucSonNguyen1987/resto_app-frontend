import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="card">
        <h1>Bienvenue sur notre application</h1>
        <p className="subtitle">Sécurisez votre compte avec l'authentification à deux facteurs</p>
        
        <div className="features">
          <div className="feature-item">
            <h3>🔐 Sécurité renforcée</h3>
            <p>Protection avancée de votre compte avec l'authentification à deux facteurs</p>
          </div>
          
          <div className="feature-item">
            <h3>📱 Simple à utiliser</h3>
            <p>Configuration facile avec votre application d'authentification préférée</p>
          </div>
          
          <div className="feature-item">
            <h3>🔑 Codes de secours</h3>
            <p>Accédez à votre compte même si vous n'avez pas votre appareil mobile</p>
          </div>
        </div>
        
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-primary">Se connecter</Link>
          <Link to="/register" className="btn btn-secondary">S'inscrire</Link>
        </div>
      </div>
      
      <div className="card mt-4">
        <h2>Comment fonctionne l'authentification à deux facteurs?</h2>
        <ol>
          <li>Vous vous connectez avec votre nom d'utilisateur et mot de passe</li>
          <li>Vous recevez ou générez un code temporaire unique</li>
          <li>Vous entrez ce code pour confirmer votre identité</li>
        </ol>
        <p>Cette méthode ajoute une couche de sécurité supplémentaire, protégeant votre compte même si votre mot de passe est compromis.</p>
      </div>
    </div>
  );
};

export default Home;