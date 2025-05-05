// src/services/serviceSwitch.js
import mockAuthService from './mockAuthService';
import mockTwoFactorService from './mockTwoFactorService';
import mockFloorPlanService from './mockFloorPlanService';
import mockTableService from './mockTableService';
import mockReservationService from './mockReservationService';

// Forcer l'utilisation des services mock pour le développement
const useMock = true; // Remplacer par import.meta.env.VITE_USE_MOCK_SERVICES === 'true'; en production

// Exporter les services appropriés
const services = {
  auth: useMock ? mockAuthService : null,
  twoFactor: useMock ? mockTwoFactorService : null,
  floorPlan: useMock ? mockFloorPlanService : null,
  table: useMock ? mockTableService : null,
  reservation: useMock ? mockReservationService : null,
};

export default services;