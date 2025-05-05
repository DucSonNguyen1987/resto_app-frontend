import mockAuthService from './mockAuthService';
import mockTwoFactorService from './mockTwoFactorService';
import mockFloorPlanService from './mockFloorPlanService';
import mockTableService from './mockTableService';
import mockReservationService from './mockReservationService';

import authService from './authService';
import twoFactorService from './twoFactorService';
import floorPlanService from './floorPlanService';
import tableService from './tableService';
import reservationService from './reservationService';

// Vérifier si on utilise les services mock ou réels
const useMock = import.meta.env.VITE_USE_MOCK_SERVICES === 'true';

// Exporter les services appropriés
const services = {
  auth: useMock ? mockAuthService : authService,
  twoFactor: useMock ? mockTwoFactorService : twoFactorService,
  floorPlan: useMock ? mockFloorPlanService : floorPlanService,
  table: useMock ? mockTableService : tableService,
  reservation: useMock ? mockReservationService : reservationService,
};

export default services;