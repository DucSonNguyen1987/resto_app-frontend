// src/actions/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../reducers/authSlice';

import { setUser, setTokens } from '../reducers/userSlice';
import authService from '../services/authService';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { dispatch }) => {
    const result = await authService.login(email, password);
    
    if (result.success) {
      if (result.requires2FA) {
        dispatch(login({ requires2FA: true, tempToken: result.tempToken }));
        return { requires2FA: true };
      } else {
        // Mettre à jour les deux slices en une seule action
        dispatch(login(result.data));
        dispatch(setUser(result.data));
        dispatch(setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken
        }));
        return { success: true };
      }
    } else {
      throw new Error(result.error || 'Identifiants invalides');
    }
  }
);
