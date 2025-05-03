// src/services/index.js
import services from './serviceSwitch';
import mockAuthService from './mockAuthService';
import mockTwoFactorService from './mockTwoFactorService';
import mockFloorPlanService from './mockFloorPlanService';
import mockTableService from './mockTableService';
import mockReservationService from './mockReservationService';

// Exporte à la fois les services regroupés et les services individuels
export { services };
export { default as authService } from './mockAuthService';
export { default as twoFactorService } from './mockTwoFactorService';
export { default as floorPlanService } from './mockFloorPlanService';
export { default as tableService } from './mockTableService';
export { default as reservationService } from './mockReservationService';