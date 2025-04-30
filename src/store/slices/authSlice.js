import { createSlice} from '@reduxjs/toolkit';


const initialState =  {
    isAuthenticated: false,     // User authentifié
    twoFactorRequired: false,   //2FA requis
    twoFactorVerfied: false,    //2FA vérifié
    temporaryToken: null,       // Token temporaire pour le 2FA
    isLoading: false,
    error: null
};

const authSlice = createSlice ({
    name: 'auth',
    initialState,
    reducers : {

        // Action pour démarrer les requêtes d'authentification
        authStartLoading : (state) => {
            state.isLoading = true;
            state.error = null;
        },

        // Action pour gérer les erreurs d'authentification
        authHasError : (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Action pour indiquer que l'authentification a réussi
        loginSuccess : (state) => {
            state.isAuthenticated = true;
            state.twoFactorRequired = false;
            state.twoFactorVerfied =false;
            state.isLoading = false;
            state.error = null;
        },

        //Action pour indiquer que l'authentification à 2 facteurs est requise
        twoFactorRequired :(state, action) => {
            state.twoFactorRequired = true;
            state.temporaryToken = action.payload.temporaryToken;
            state.isLoading = false;
        },

        //Action pour indiquer que l'authentification à 2 facteurs a réussi
        twoFactorVerfied : (state, action) => {
            state.twoFactorVerfied = true;
            state.twoFactorRequired = false;
            state.temporaryToken = null;
            state.isLoading = false;
        },

        // Action pour déconnecter le USER du point de vue de l'authentification
        authLogout :(state) => {
            state.isAuthenticated = false;
            state.twoFactorRequired = false;
            state.twoFactorVerfied = false;
            state.temporaryToken =null;
            state.isLoading = false;
            state.error = null;
        }
    }
});

export const {
    authStartLoading,
    authHasError,
    loginSuccess,
    twoFactorRequired,
    twoFactorVerfied,
    authLogout,
} = authSlice.actions;

export default authSlice.reducer;
