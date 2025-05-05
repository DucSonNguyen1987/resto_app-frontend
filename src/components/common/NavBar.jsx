// src/components/common/NavBar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../reducers/userSlice';

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Récupérer les informations d'authentification
  const { isAuthenticated, username, firstname, lastname, email, role } = useSelector(state => state.user.value);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    // Déconnecter l'utilisateur
    dispatch(logout());
    // Rediriger vers la page de connexion
    navigate('/login');
    // Fermer le dropdown
    setDropdownOpen(false);
  };

  // Ne pas afficher la navbar sur les pages d'authentification
  if (['/login', '/register', '/verify-2fa'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="navbar-brand">
          Restaurant App
        </Link>

        <div className="nav-links">
          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              
              {['ADMIN', 'OWNER', 'MANAGER'].includes(role) && (
                <>
                  <Link 
                    to="/floor-plans" 
                    className={`nav-link ${location.pathname.includes('/floor-plans') ? 'active' : ''}`}
                  >
                    Plans de salle
                  </Link>
                  <Link 
                    to="/reservations" 
                    className={`nav-link ${location.pathname.includes('/reservations') ? 'active' : ''}`}
                  >
                    Réservations
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-menu-button" onClick={toggleDropdown}>
                <span>{firstname || username || 'Utilisateur'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="user-name">{firstname} {lastname}</div>
                    <div className="user-email">{email}</div>
                    <div className="user-role">{role}</div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link 
                    to="/account-settings" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Paramètres du compte
                  </Link>
                  
                  <Link 
                    to="/2fa-management" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Gestion 2FA
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary btn-sm">
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-sm">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;