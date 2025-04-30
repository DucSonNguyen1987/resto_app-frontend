import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        username: null,
        email: null,
        firstname: null,
        lastname: null,
        accessToken: null,
        refreshToken: null,
        role: null,
        isAuthenticated: false,
        requires2FA: false,
        tempToken: null,
        setupQRCode: null,
        setupSecret:null,
        backupCodes: [],
        twoFactorEnabled: false
    }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        login: (state, action) => {
            // Si 2FA requis, ne pas définir isAuthenticated à true
            if (action.payload.requires2FA) {
                state.value.requires2FA = true;
                state.value.tempToken = action.payload.tempToken;
            } else {
                // login normal sans 2FA
                state.value.isAuthenticated = true;
                state.value.username = action.payload.username;
                state.value.email = action.payload.email;
                state.value.firstname = action.payload.firstname;
                state.value.lastname = action.payload.lastname;
                state.value.accessToken = action.payload.accessToken;
                state.value.refreshToken = action.payload.refreshToken;
                state.value.role = action.payload.role;
                state.value.twoFactorEnabled = action.payload.twoFactorEnabled || false;
            }
        },

        verify2FA: (state, action) => {
            // Une fois vérifé, compléter l'authentification
            state.value.isAuthenticated = true;
            state.value.requires2FA = false;
            state.value.tempToken = null;
            state.value.username = action.payload.username;
            state.value.email = action.payload.email;
            state.value.firstname = action.payload.firstname;
            state.value.lastname = action.payload.lastname;
            state.value.accessToken = action.payload.accessToken;
            state.value.refreshToken = action.payload.refreshToken;
            state.value.role = action.payload.role;
            state.value.twoFactorEnabled = true;
        },

        logout : (state) => {
            state.value = initialState.value;
        },

        setAccessToken :(state, action) => {
            state.value.setupQRCode = action.payload.setupQRCode;
            state.value.setupSecret = action.payload.secret;
        },

        set2FASetupData : (state, action) => {
            state.value.setupQRCode = action.payload.qrCode;
            state.value.setupSecret = action.payload.secret;
        },

        enable2FA : (state, action) => {
            state.value.twoFactorEnabled =true;
            state.value.backupCodes = action.payload.backupCodes;
        },

        disable2FA : (state) => {
            state.value.twoFactorEnabled = false;
            state.value.backupCodes = [];
        },

        setBackupCodes :(state, action) => {
            state.value.backupCodes = action.payload;
        }
    },
});

export const { login, verify2FA, logout, setAccessToken, set2FASetupData, enable2FA, disable2FA, setBackupCodes } = authSlice.actions;

export default authSlice.reducer;