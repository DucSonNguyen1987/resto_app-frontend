import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';


// Configuration de la persistance pour les données USER et authentification

const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['token', 'refreshToken', 'profile'] // Ne persister que ces champs
};

const authPersistConfig = {
    key : 'auth',
    storage,
    whitelist: ['isAuthenticated', 'twoFactorRequired']  // Ne persister que ces champs
};

// Création des reducers persistants 
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Combinaison des reducers
const rootReducer = combineReducers({
    user: persistedUserReducer,
    auth: persistedAuthReducer
});

// Configuration du store Redux
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck :{
                // Ignore les actions de redux persist dans la vérification de serialisation
                ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(thunk),
});

// Création du persistor pour redux persist
export const persistor = persistStore(store);

// injection du store dans l'instance axios pour les intercepteurs
import {injectStore} from '../api/axios';
injectStore(store);
