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
        setupSecret: null,
        backupCodes: [],
        twoFactorEnabled: false
    }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Authentification standard ou avec 2FA requis
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

        // Vérification 2FA réussie lors de la connexion
        verify2FA: (state, action) => {
            // Une fois vérifié, compléter l'authentification
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

        // Déconnexion
        logout: (state) => {
            state.value = initialState.value;
        },

        // Mise à jour du token d'accès
        setAccessToken: (state, action) => {
            state.value.accessToken = action.payload;
        },

        // Stocker les données de configuration 2FA
        set2FASetupData: (state, action) => {
            state.value.setupQRCode = action.payload.qrCode;
            state.value.setupSecret = action.payload.secret;
        },

        // Activer la 2FA après vérification réussie
        enable2FA: (state, action) => {
            state.value.twoFactorEnabled = true;
            state.value.backupCodes = action.payload.backupCodes;
        },

        // Désactiver la 2FA
        disable2FA: (state) => {
            state.value.twoFactorEnabled = false;
            state.value.backupCodes = [];
        },

        // Mettre à jour les codes de secours
        setBackupCodes: (state, action) => {
            state.value.backupCodes = action.payload;
        }
    },
});

export const { 
    login, 
    verify2FA, 
    logout, 
    setAccessToken, 
    set2FASetupData, 
    enable2FA, 
    disable2FA, 
    setBackupCodes 
} = authSlice.actions;

export default authSlice.reducer;