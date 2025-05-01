import React from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './App.css';

// Composants d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TwoFactorVerify from './components/auth/TwoFactorVerify';
import TwoFactorSetup from './components/auth/TwoFactorSetup';
//import Navbar from "./components/common/NavBar";

// Composant pour la gestion du 2FA
import TwoFactorManagement from './components/account/TwoFactorManagement';

// Composants provisoires pour les routes manquantes
const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' }); // Action pour déconnecter l'utilisateur
  };

  return (
    <div className="card">
      <button
        type="button"
        onClick={handleLogout}
        className="btn btn-outline-primary"
      >
        Se déconnecter
      </button>
      <h2>Dashboard</h2>
      <p>Tableau de bord de l'application</p>
    </div>
  );
};
const AccountSettings = () => <div className="card"><h2>Paramètres du compte</h2><p>Gérez vos paramètres de compte</p></div>;
const NotFound = () => <div className="card"><h2>404 - Page non trouvée</h2><p>La page que vous recherchez n'existe pas.</p></div>;

// Protège les routes nécessitant une authentification
const PrivateRoute = ({children}) => {
  const { isAuthenticated } = useSelector(state => state.auth.value);

  if(!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return children;
};

// Protège les routes auth 2FA
const Requires2FARoute = ({children}) => {
  const {requires2FA} = useSelector(state => state.auth.value);

  if(requires2FA) {
    return children;
  }
  return <Navigate to='/login' />
};

// Check si 2FA est requis pour les ADMINS et les OWNER
const RequiresTwoFactorCheck = ({children}) => {
  const {role, twoFactorEnabled, isAuthenticated} = useSelector(state => state.auth.value);

  // Si l'utilisateur est authentifié et est ADMIN/OWNER mais n'a pas activé 2FA
  if(isAuthenticated && (role === 'ADMIN' || role === 'OWNER') && !twoFactorEnabled){
    return <Navigate to='/setup-2fa' />;
  }
  return children;
};

function App() {
  return (
   <Router>
   <div className="app-container">
   {/* <Navbar />*/}
    <div className="main-content">
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        
        {/* Route pour la gestion 2FA */}
        <Route path="/2fa-management" element={
          <PrivateRoute>
            <TwoFactorManagement />
          </PrivateRoute>
        } />

        {/* Route pour la vérification 2FA */}
        <Route path="/verify-2fa" element={
          <Requires2FARoute>
            <TwoFactorVerify />
          </Requires2FARoute>
        } />

        {/* Routes privées */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <RequiresTwoFactorCheck>
              <Dashboard />
            </RequiresTwoFactorCheck>
          </PrivateRoute>
        } />
        
        <Route path="/account-settings" element={
          <PrivateRoute>
            <RequiresTwoFactorCheck>
              <AccountSettings />
            </RequiresTwoFactorCheck>
          </PrivateRoute>
        } />

        <Route path="/setup-2fa" element={
          <PrivateRoute>
            <TwoFactorSetup />
          </PrivateRoute>
        } />

        {/* Redirection de la racine vers le dashboard si connecté */}
        <Route path="/" element={
          <PrivateRoute>
            <RequiresTwoFactorCheck>
              {<Dashboard />}
            </RequiresTwoFactorCheck>
          </PrivateRoute>
        } />

        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </div>
   </Router>
  );
}

export default App;