import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import only the userReducer since we're centralizing state
import userReducer from '../reducers/userSlice';
import floorPlanReducer from '../reducers/floorPlanSlice';


// Configuration de la persistance pour les données USER
const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['value'] // Persister l'état complet de l'utilisateur
};

// Configuration de la persistance pour les plans de salle
const floorPlanPersistConfig = {
    key: 'floorPlan',
    storage,
    whitelist: ['value'] // Persister l'état complet des plans de salle
};

// Create persisted reducer
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedFloorPlanReducer = persistReducer(floorPlanPersistConfig, floorPlanReducer);

// Configure the Redux store
export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        floorPlan: persistedFloorPlanReducer

    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore les actions de redux persist dans la vérification de serialisation
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register', 'rehydrate']
            },
        })
});
// Inject the store into the axios instance for interceptors
import { injectStore } from '../api/axios';
injectStore(store);


// Create the persistor for redux persist
export const persistor = persistStore(store);

export const getStore = () => store;


