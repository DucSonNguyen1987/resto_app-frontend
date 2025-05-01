import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/authService.js';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Restaurant Manager
      </Link>

      <div className="navbar-nav">
        {currentUser ? (
          <div className="user-dropdown">
            <button className="user-dropdown-toggle" onClick={toggleDropdown}>
              <span className="user-name">{currentUser.username || currentUser.firstname || 'Utilisateur'}</span>
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
                style={{ marginLeft: '8px' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-item" style={{ fontWeight: 'bold' }}>
                  {currentUser.firstname} {currentUser.lastname}
                </div>
                <div className="user-dropdown-item" style={{ color: '#666', fontSize: '0.9rem' }}>
                  {currentUser.email}
                </div>
                <div className="user-dropdown-divider"></div>
                <Link to="/profile" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Mon Profil
                </Link>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="nav-item">
            <Link to="/login" className="btn btn-outline-primary">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;