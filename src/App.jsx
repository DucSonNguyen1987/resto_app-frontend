// App.jsx avec debuggers et DataInitializer pour Vite

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './App.css';

// Composants d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from "./components/common/NavBar";

// Importer les debuggers
import TokenDebugger from "./components/common/debug/TokenDebugger";
import StateDebugger from "./components/common/debug/StateDebugger";
import AuthDebugger from "./components/common/debug/AuthDebugger";
import DebugPanel from "./components/common/debug/DebugPanel";
import FloorPlanDebugger from "./components/common/debug/FloorPlanDebugger"; // Si vous l'avez créé

// Importer DataInitializer
import DataInitializer from "./components/common/DataInitializer";

// Composants pour la gestion du compte
import TwoFactorSetup from './components/auth/TwoFactorSetup';
import TwoFactorVerify from "./components/auth/TwoFactorVerify";
import TwoFactorManagement from './components/account/TwoFactorManagement';
import AccountSettings from './components/account/AccountSettings';

// Composants pour les plans de salle
import FloorPlanList from './components/floor/FloorPlanList';
import FloorPlanViewer from './components/floor/FloorPlanViewer';
import FloorPlanEditor from './features/floor_editor/FloorPlanEditor';
// Importer le nouveau composant de création de plan
import CreateFloorPlan from './features/floor_editor/floor_plans/CreateFloorPlan';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Composant pour la page 404
const NotFound = () => <div className="card"><h2>404 - Page non trouvée</h2><p>La page que vous recherchez n'existe pas.</p></div>;

// Protège les routes nécessitant une authentification
const PrivateRoute = ({children}) => {
  const { isAuthenticated } = useSelector(state => state.user.value);

  if(!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return children;
};

// Protège les routes auth 2FA
const Requires2FARoute = ({children}) => {
  const {requires2FA} = useSelector(state => state.user.value);

  if(requires2FA) {
    return children;
  }
  return <Navigate to='/login' />
};

// Check si 2FA est requis pour les ADMINS et les OWNER
const RequiresTwoFactorCheck = ({children}) => {
  const {role, twoFactorEnabled, isAuthenticated} = useSelector(state => state.user.value);

  // Si l'utilisateur est authentifié et est ADMIN/OWNER mais n'a pas activé 2FA
  if(isAuthenticated && (role === 'ADMIN' || role === 'OWNER') && !twoFactorEnabled){
    return <Navigate to='/setup-2fa' />;
  }
  return children;
};

function App() {
  return (
   <Router>
    <DataInitializer>
      <div className="app-container">
        <Navbar />
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

            {/* Routes des plans de salle */}
            <Route path="/floor-plans" element={
              <PrivateRoute>
                <RequiresTwoFactorCheck>
                  <FloorPlanList />
                </RequiresTwoFactorCheck>
              </PrivateRoute>
            } />
            
            {/* Nouvelle route pour créer un plan de salle */}
            <Route path="/create-floor-plan" element={
              <PrivateRoute>
                <RequiresTwoFactorCheck>
                  <CreateFloorPlan />
                </RequiresTwoFactorCheck>
              </PrivateRoute>
            } />
            
            <Route path="/floor-plans/view/:floorPlanId" element={
              <PrivateRoute>
                <RequiresTwoFactorCheck>
                  <FloorPlanViewer />
                </RequiresTwoFactorCheck>
              </PrivateRoute>
            } />
            
            <Route path="/floor-plans/edit/:floorPlanId" element={
              <PrivateRoute>
                <RequiresTwoFactorCheck>
                  <FloorPlanEditor />
                </RequiresTwoFactorCheck>
              </PrivateRoute>
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
                  <Dashboard />
                </RequiresTwoFactorCheck>
              </PrivateRoute>
            } />

            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Ajouter les debuggers uniquement en mode développement */}
          {import.meta.env.MODE !== 'production' && (
            <>
              <StateDebugger />
              <TokenDebugger />
              <AuthDebugger />
              <DebugPanel />
              <FloorPlanDebugger />
            </>
          )}
        </div>
      </div>
    </DataInitializer>
   </Router>
  );
}

export default App;