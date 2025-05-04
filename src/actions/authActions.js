// src/actions/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../reducers/userSlice';

import authService from '../services/authService';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { dispatch }) => {
    const result = await authService.login(email, password);
    
    if (result.success) {
      if (result.requires2FA) {
        dispatch(login({ requires2FA: true, tempToken: result.tempToken }));
        return { requires2FA: true };
      } else {
        // Update only the user slice
        dispatch(login(result.data));
        return { success: true };
      }
    } else {
      throw new Error(result.error || 'Identifiants invalides');
    }
  }
);