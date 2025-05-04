// src/store/middleware/authMiddleware.js
import { login, verify2FA, logout } from '../../reducers/authSlice';
import { setUser, setTokens, logout as userLogout } from '../../reducers/userSlice';

const authMiddleware = store => next => action => {
  // Exécute l'action originale
  const result = next(action);
  
  // Intercepte les actions auth pour synchroniser userSlice
  if (action.type === login.type && !action.payload.requires2FA) {
    // Mise à jour du profil utilisateur
    store.dispatch(setUser(action.payload));
    // Mise à jour des tokens
    store.dispatch(setTokens({
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken
    }));
  }
  
  // Synchronise la vérification 2FA
  if (action.type === verify2FA.type) {
    store.dispatch(setUser(action.payload));
    store.dispatch(setTokens({
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken
    }));
  }
  
  // Synchronise la déconnexion
  if (action.type === logout.type) {
    store.dispatch(userLogout());
  }
  
  return result;
};

export default authMiddleware;