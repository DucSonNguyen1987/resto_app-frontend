import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUserProfile } from '../../reducers/userSlice';

const AccountSettings = () => {
  const dispatch = useDispatch();
  const { username, email, firstname, lastname, phone, role } = useSelector(state => state.auth.value);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    firstname: firstname || '',
    lastname: lastname || '',
    email: email || '',
    phone: phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Soumettre les modifications du profil
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.firstname || !formData.lastname || !formData.email) {
      setMessage({ type: 'error', content: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    
    // Ici, vous appelleriez votre API pour mettre à jour le profil
    // Pour cet exemple, nous allons simplement mettre à jour le state Redux
    dispatch(updateUserProfile({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone
    }));
    
    setMessage({ type: 'success', content: 'Profil mis à jour avec succès !' });
    setIsEditing(false);
  };
  
  // Soumettre le changement de mot de passe
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', content: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', content: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', content: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    
    // Ici, vous appelleriez votre API pour mettre à jour le mot de passe
    // Pour cet exemple, nous allons simplement afficher un message de succès
    setMessage({ type: 'success', content: 'Mot de passe mis à jour avec succès !' });
    setIsChangingPassword(false);
    
    // Réinitialiser les champs de mot de passe
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };
  
  return (
    <div className="account-settings">
      <h2>Paramètres du compte</h2>
      
      {/* Affichage des messages */}
      {message.content && (
        <div className={`alert ${message.type}`}>
          {message.content}
        </div>
      )}
      
      <div className="account-sections">
        {/* Section du profil */}
        <div className="account-section">
          <div className="section-header">
            <h3>Informations personnelles</h3>
            {!isEditing ? (
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </button>
            ) : null}
          </div>
          
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Nom d'utilisateur</span>
                <span className="info-value">{username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Prénom</span>
                <span className="info-value">{firstname || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Nom</span>
                <span className="info-value">{lastname || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Téléphone</span>
                <span className="info-value">{phone || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Rôle</span>
                <span className="info-value">{role}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="firstname">Prénom*</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastname">Nom*</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      ...formData,
                      firstname: firstname || '',
                      lastname: lastname || '',
                      email: email || '',
                      phone: phone || ''
                    });
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Section du mot de passe */}
        <div className="account-section">
          <div className="section-header">
            <h3>Sécurité</h3>
          </div>
          
          <div className="security-options">
            <div className="security-option">
              <div className="security-option-info">
                <h4>Mot de passe</h4>
                <p>Mettez à jour votre mot de passe pour sécuriser votre compte.</p>
              </div>
              {!isChangingPassword ? (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Modifier
                </button>
              ) : null}
            </div>
            
            {isChangingPassword && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel*</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe*</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setFormData({
                        ...formData,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            )}
            
            <div className="security-option">
              <div className="security-option-info">
                <h4>Authentification à deux facteurs</h4>
                <p>Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
              </div>
              <Link to="/2fa-management" className="btn btn-secondary">
                Gérer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;