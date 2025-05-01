import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Importation des reducers
import authReducer from '../reducers/authSlice';
import userReducer from '../reducers/userSlice';

// Configuration de la persistance pour les données USER et authentification
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['value'] // Persister l'état complet de l'authentification
};

const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['value'] // Persister l'état complet de l'utilisateur
};

// Création des reducers persistants 
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Combinaison des reducers
const rootReducer = combineReducers({
    auth: persistedAuthReducer,
    user: persistedUserReducer
});

// Configuration du store Redux
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore les actions de redux persist dans la vérification de serialisation
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register', 'rehydrate']
            },
        })
});

// Création du persistor pour redux persist
export const persistor = persistStore(store);

// Injection du store dans l'instance axios pour les intercepteurs
import { injectStore } from '../api/axios';
injectStore(store);