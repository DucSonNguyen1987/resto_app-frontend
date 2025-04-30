import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    profile: null,  // Données de profil USER
    accessToken: null, 
    refreshToken: null,
    isLoading: false, // Etat de chargement
    error: null // Erreur éventuelle
};

const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers : {
        
        // Action pour démarrer les requêtes
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },

        // Action pour gérer les erreurs
        hasError: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Action pour définir les tokens
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.error = action.payload
        },

        // Action pour définir uniquement l'AccessToken ( après refresh)
        setAccessToken : (state, action) => {
            state.accessToken = action.payload;
            state.isLoading = false;
        },

        // Action pour définir le profile utilisateur
        setUseProfile : (state, action) => {
            state.profile = action.payload;
            state.isLoading = false;
        },

        // Action pour déconnecter le USER
        logout: (state) => {
            state.profile = null;
            state.accessToken = null;
            state.refreshToken = null,
            state.isLoading = false;
            state.error = null;
        }
    }
});

export const {
    startLoading,
    hasError,
    setTokens,
    setUseProfile,
    logout
} = userSlice.actions;

export default userSlice.reducer;

