// storeInjector.js - Nouveau fichier pour éviter les imports circulaires
import { getStore } from './store';
import { injectStore } from '../api/axios';

// Initialiser les dépendances de l'application
export const initializeAppDependencies = () => {
  // Obtenir le store et l'injecter dans axios
  const store = getStore();
  injectStore(store);
  
  // Tout autre initialisation d'application qui nécessite le store peut être ajoutée ici
  console.log('Application dependencies initialized');
};