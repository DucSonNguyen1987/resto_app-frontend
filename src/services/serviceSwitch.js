// src/services/serviceSwitch.js
/**
 * Ce fichier permet de basculer entre les services réels et les services de simulation
 * en fonction de la configuration de l'environnement.
 */

// Import des services réels
import authService from './authService';
import twoFactorService from './twoFactorService';
import floorPlanService from './floorPlanService';
import tableService from './tableService';
import reservationService from './reservationService';

// Import des services de simulation
import mockAuthService from './mockAuthService';
import mockTwoFactorService from './mockTwoFactorService';
import mockFloorPlanService from './mockFloorPlanService';
import mockTableService from './mockTableService';
import mockReservationService from './mockReservationService';

// Détermine si l'application doit utiliser les services de simulation
const USE_MOCK_SERVICES = import.meta.env.VITE_USE_MOCK_SERVICES === 'true';


// Exporte les services appropriés en fonction de la configuration
export const getAuthService = () => USE_MOCK_SERVICES ? mockAuthService : authService;
export const getTwoFactorService = () => USE_MOCK_SERVICES ? mockTwoFactorService : twoFactorService;
export const getFloorPlanService = () => USE_MOCK_SERVICES ? mockFloorPlanService : floorPlanService;
export const getTableService = () => USE_MOCK_SERVICES ? mockTableService : tableService;
export const getReservationService = () => USE_MOCK_SERVICES ? mockReservationService : reservationService;

// Service singleton pour centraliser l'accès aux services
export default {
  auth: getAuthService(),
  twoFactor: getTwoFactorService(),
  floorPlan: getFloorPlanService(),
  table: getTableService(),
  reservation: getReservationService(),
};