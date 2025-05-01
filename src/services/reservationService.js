// src/services/reservationService.js
import api from '../api/axios';

/**
 * Service pour gérer les requêtes API liées aux réservations
 */
const reservationService = {
  // Récupérer les réservations avec filtres optionnels
  getReservations: async (filters = {}) => {
    try {
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      
      if (filters.date) {
        queryParams.append('date', filters.date);
      }
      
      if (filters.floorPlan) {
        queryParams.append('floorPlan', filters.floorPlan);
      }
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      if (filters.tableId) {
        queryParams.append('tableId', filters.tableId);
      }
      
      if (filters.userId) {
        queryParams.append('userId', filters.userId);
      }
      
      const response = await api.get(`/reservations?${queryParams.toString()}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération des réservations'
      };
    }
  },
  
  // Récupérer une réservation spécifique
  getReservation: async (reservationId) => {
    try {
      const response = await api.get(`/reservations/${reservationId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la récupération de la réservation ${reservationId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération de la réservation'
      };
    }
  },
  
  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/reservations', reservationData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création de la réservation'
      };
    }
  },
  
  // Mettre à jour une réservation existante
  updateReservation: async (reservationId, reservationData) => {
    try {
      const response = await api.put(`/reservations/${reservationId}`, reservationData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la réservation ${reservationId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour de la réservation'
      };
    }
  },
  
  // Supprimer une réservation
  deleteReservation: async (reservationId) => {
    try {
      const response = await api.delete(`/reservations/${reservationId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Erreur lors de la suppression de la réservation ${reservationId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la suppression de la réservation'
      };
    }
  },
  
  // Mettre à jour le statut d'une réservation
  updateReservationStatus: async (reservationId, status) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/status`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la réservation ${reservationId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour du statut'
      };
    }
  },
  
  // Confirmer l'arrivée d'un client
  markCustomerArrived: async (reservationId) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/arrived`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la confirmation de l'arrivée pour la réservation ${reservationId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la confirmation de l\'arrivée'
      };
    }
  },
  
  // Marquer une réservation comme "no-show"
  markNoShow: async (reservationId) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/no-show`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la marquage no-show pour la réservation ${reservationId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors du marquage no-show'
      };
    }
  },
  
  // Vérifier la disponibilité des tables
  checkAvailability: async (data) => {
    try {
      const response = await api.post('/reservations/check-availability', data);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la vérification de disponibilité'
      };
    }
  }
};

export default reservationService;