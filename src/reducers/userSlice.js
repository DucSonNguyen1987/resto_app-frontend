// src/reducers/user.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    username: null,
    email: null,
    firstname: null,
    lastname: null,
    phone: null,
    role: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastLogin: null
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action pour définir les données utilisateur lors de la connexion
    setUser: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload,
        isAuthenticated: true,
        error: null,
        lastLogin: new Date().toISOString()
      };
    },

    // Action pour définir les tokens
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = action.payload
<<<<<<< HEAD
  },
    
=======
    },

>>>>>>> bbafae202c94b5ad6c6ede5dbfa355e266ced77d
    // Action pour mettre à jour uniquement le token d'accès
    setAccessToken: (state, action) => {
      state.value.accessToken = action.payload;
    },

    // Action pour mettre à jour le profil utilisateur
    updateUserProfile: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload
      };
    },

    // Action pour définir l'état de chargement
    setLoading: (state, action) => {
      state.value.isLoading = action.payload;
    },

    // Action pour définir une erreur
    setError: (state, action) => {
      state.value.error = action.payload;
    },

    // Action pour la déconnexion
    logout: (state) => {
      // Conserver certaines données non sensibles comme l'erreur
      const { error } = state.value;
      state.value = {
        ...initialState.value,
        error
      };
    }
  }
});

// Export des actions
<<<<<<< HEAD
export const { 
  setUser,
  setTokens,
  setAccessToken, 
  updateUserProfile, 
  setLoading, 
  setError, 
  logout 
=======
export const {
  setUser,
  setTokens,
  setAccessToken,
  updateUserProfile,
  setLoading,
  setError,
  logout
>>>>>>> bbafae202c94b5ad6c6ede5dbfa355e266ced77d
} = userSlice.actions;

// Sélecteurs
export const selectUser = (state) => state.user.value;
export const selectIsAuthenticated = (state) => state.user.value.isAuthenticated;
export const selectUserRole = (state) => state.user.value.role;
export const selectAccessToken = (state) => state.user.value.accessToken;
export const selectRefreshToken = (state) => state.user.value.refreshToken;

// Export du réducteur
export default userSlice.reducer;