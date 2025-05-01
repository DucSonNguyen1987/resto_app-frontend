import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './App.css';

// Composants d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TwoFactorVerify from './components/auth/TwoFactorVerify';
import TwoFactorSetup from './components/auth/TwoFactorSetup';

// Composants pour le tableau de bord
//import Dashboard from './components/dashboard/Dashboard';
//import AccountSettings from './components/account/AccountSettings';
import TwoFactorManagement from './components/account/TwoFactorManagement.jsx';

// autres composants
//import Header from './components/layout/Header';
//import Footer from './components/layout/Footer';
//import NotFound from './components/common/NotFound';

// Prtège les routes nécessitant une authentification

const PrivateRoute= ({children}) => {
  const { isAuthenticated } = useSelector(state => state.auth.value);

  if(!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return children;
};

// Protège les routes auth 2FA

const Requires2FARoute = ({children}) => {
  const {requires2FA} =  useSelector(state => state.auth.value);

  if(requires2FA) {
    return children;
  }
  return <Navigate to= '/login' />
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
    <div className="main-content">
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Route pour la vérification 2FA */}
        <Route path="/verify-2fa" element = {
          <Requires2FARoute>
            <TwoFactorVerify />
          </Requires2FARoute>
        } />

        {/*Routes privées */}
        <Route path="/dashboard" element = {
          <PrivateRoute>
            <RequiresTwoFactorCheck>
              <AccountSettings />
            </RequiresTwoFactorCheck>
          </PrivateRoute>
        }
        />

        <Route path="/setup-2fa" element ={
          <PrivateRoute>
            <TwoFactorSetup />
          </PrivateRoute>
        }
        />

        {/*Redirection de la racine vers le dashboard si connecté */}

        <Route path="/" element = {
          <PrivateRoute>
            <RequiresTwoFactorCheck >
            <Dashboard />
            </RequiresTwoFactorCheck>
          </PrivateRoute>
        }
        />

        {/*Page 404*/}
        <Route path="*" element = {<NotFound />} />
        </Routes>
    </div>
   </Router>
  );
}

export default App;
