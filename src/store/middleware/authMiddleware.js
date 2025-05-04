// src/store/middleware/authMiddleware.js
import { login, verify2FA, logout } from '../../reducers/authSlice';
import { setUser, setTokens, logout as userLogout } from '../../reducers/userSlice';

const authMiddleware = store => next => action => {
  // Execute the original action
  const result = next(action);
  
  // Intercept auth actions to sync userSlice
  if (action.type === login.type) {
    // Only update user data if not requiring 2FA
    if (!action.payload.requires2FA) {
      // Update user profile
      store.dispatch(setUser(action.payload));
      // Update tokens
      store.dispatch(setTokens({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      }));
    }
  }
  
  // Sync 2FA verification
  if (action.type === verify2FA.type) {
    store.dispatch(setUser(action.payload));
    store.dispatch(setTokens({
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken
    }));
  }
  
  // Sync logout
  if (action.type === logout.type) {
    store.dispatch(userLogout());
  }
  
  return result;
};

export default authMiddleware;