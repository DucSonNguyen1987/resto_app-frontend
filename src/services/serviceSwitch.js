// src/services/serviceSwitch.js
import mockFloorPlanService from './mockFloorPlanService';
import apiFloorPlanService from './apiFloorPlanService';
import mockReservationService from './mockReservationService'; // Ajout de l'import

// Configuration qui détermine si on utilise les services mockés ou réels
// Cette valeur peut être définie dans un fichier de configuration ou des variables d'environnement
// Par défaut, on utilise les services mockés pour le développement

// Vérifier si nous sommes en environnement de production
const isProduction = import.meta.env.NODE_ENV === 'production';

// Utiliser les services API en production, et les services mockés en développement
// Cette configuration peut être écrasée par une variable d'environnement
const USE_MOCK_SERVICES = import.meta.env.REACT_APP_USE_MOCK_SERVICES === 'true' || 
                         (!isProduction && import.meta.env.REACT_APP_USE_MOCK_SERVICES !== 'false');

// Services mockés pour le développement
const mockServices = {
  floorPlan: mockFloorPlanService,
  // Ajouter le service de réservation au service mocké
  reservation: mockReservationService,
  // Pas besoin de définir explicitement table car mockFloorPlanService contient déjà les méthodes pour les tables
};

// Services API réels pour la production
const apiServices = {
  floorPlan: apiFloorPlanService,
  // TODO: Ajouter le service réel de réservation quand il sera disponible
  reservation: null, // À remplacer par le service réel quand il sera disponible
  // Pas besoin de définir explicitement table car apiFloorPlanService contient déjà les méthodes pour les tables
};

// Sélectionner les services appropriés en fonction de la configuration
const services = USE_MOCK_SERVICES ? mockServices : apiServices;

// Pour faciliter le débogage, ajoutons une indication du mode actuel
console.log(`Services running in ${USE_MOCK_SERVICES ? 'MOCK' : 'API'} mode`);

export default services;