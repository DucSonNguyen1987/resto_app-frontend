import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    // User data
    id: null,
    username: null,
    email: null,
    firstname: null,
    lastname: null,
    phone: null,
    role: null,
    
    // Authentication state
    isAuthenticated: false,
    requires2FA: false,
    tempToken: null,
    accessToken: null,
    refreshToken: null,
    
    // 2FA related
    twoFactorEnabled: false,
    setupQRCode: null,
    setupSecret: null,
    backupCodes: [],
    
    // UI state
    isLoading: false,
    error: null,
    lastLogin: null
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action for login (handles both regular and 2FA needed cases)
    login: (state, action) => {
      // If 2FA is required, just set minimal auth state
      if (action.payload.requires2FA) {
        state.value.requires2FA = true;
        state.value.tempToken = action.payload.tempToken;
      } else {
        // Normal login sets all user data
        state.value.isAuthenticated = true;
        state.value.id = action.payload.id;
        state.value.username = action.payload.username;
        state.value.email = action.payload.email;
        state.value.firstname = action.payload.firstname;
        state.value.lastname = action.payload.lastname;
        state.value.phone = action.payload.phone;
        state.value.role = action.payload.role;
        state.value.accessToken = action.payload.accessToken;
        state.value.refreshToken = action.payload.refreshToken;
        state.value.twoFactorEnabled = action.payload.twoFactorEnabled || false;
        state.value.lastLogin = new Date().toISOString();
        state.value.requires2FA = false;
        state.value.tempToken = null;
        state.value.error = null;
      }
    },

    // Action for 2FA verification success
    verify2FA: (state, action) => {
      state.value.isAuthenticated = true;
      state.value.requires2FA = false;
      state.value.tempToken = null;
      state.value.id = action.payload.id;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
      state.value.phone = action.payload.phone;
      state.value.accessToken = action.payload.accessToken;
      state.value.refreshToken = action.payload.refreshToken;
      state.value.role = action.payload.role;
      state.value.twoFactorEnabled = true;
      state.value.lastLogin = new Date().toISOString();
    },

    // Action for logging out
    logout: (state) => {
      state.value = initialState.value;
    },

    // Action for updating only the access token (for token refresh)
    setAccessToken: (state, action) => {
      state.value.accessToken = action.payload;
    },

    // Action for updating user profile data
    updateUserProfile: (state, action) => {
      state.value = {
        ...state.value,
        ...action.payload
      };
    },

    // Actions for 2FA setup and management
    set2FASetupData: (state, action) => {
      state.value.setupQRCode = action.payload.qrCode;
      state.value.setupSecret = action.payload.secret;
    },

    enable2FA: (state, action) => {
      state.value.twoFactorEnabled = true;
      state.value.backupCodes = action.payload.backupCodes;
    },

    disable2FA: (state) => {
      state.value.twoFactorEnabled = false;
      state.value.backupCodes = [];
    },

    setBackupCodes: (state, action) => {
      state.value.backupCodes = action.payload;
    },

    // Loading and error state management
    setLoading: (state, action) => {
      state.value.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.value.error = action.payload;
    }
  }
});

// Export actions
export const {
  login,
  verify2FA,
  logout,
  setAccessToken,
  updateUserProfile,
  set2FASetupData,
  enable2FA,
  disable2FA,
  setBackupCodes,
  setLoading,
  setError
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;