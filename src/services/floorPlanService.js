import api from '../api/axios';
/**
 * Service pour gérer les requêtes API liées aux plans de salle
 */

const API_URL = '/api/floorplans';

const floorPlanService = {
  // Récupérer tous les plans de salle
  getAllFloorPlans: async () => {
    try {
      const response = await api.get(`${API_URL}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la récupération des plans de salle:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération des plans de salle'
      };
    }
  },
  
  // Récupérer les détails d'un plan de salle avec ses tables
  getFloorPlanDetails: async (floorPlanId) => {
    try {
      const response = await api.get(`/floorplans/${floorPlanId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la récupération du plan de salle ${floorPlanId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération du plan de salle'
      };
    }
  },
  
  // Créer un nouveau plan de salle
  createFloorPlan: async (floorPlanData) => {
    try {
      const response = await api.post(`${API_URL}`, floorPlanData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la création du plan de salle:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création du plan de salle'
      };
    }
  },
  
  // Mettre à jour un plan de salle existant
  updateFloorPlan: async (floorPlanId, floorPlanData) => {
    try {
      const response = await api.put(`/floorplans/${floorPlanId}`, floorPlanData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du plan de salle ${floorPlanId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour du plan de salle'
      };
    }
  },
  
  // Supprimer un plan de salle
  deleteFloorPlan: async (floorPlanId) => {
    try {
      const response = await api.delete(`/floorplans/${floorPlanId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Erreur lors de la suppression du plan de salle ${floorPlanId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la suppression du plan de salle'
      };
    }
  },
  
  // Mettre à jour les obstacles d'un plan de salle
  updateObstacles: async (floorPlanId, obstacles) => {
    try {
      const response = await api.post(`/floorplans/${floorPlanId}/obstacles`, { obstacles });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des obstacles pour le plan ${floorPlanId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour des obstacles'
      };
    }
  },
  
  // Changer le statut d'un plan de salle (draft, active, inactive)
  changeStatus: async (floorPlanId, status) => {
    try {
      const response = await api.patch(`'/floorplans'/${floorPlanId}/status`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors du changement de statut du plan ${floorPlanId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors du changement de statut'
      };
    }
  }
};

export default floorPlanService;