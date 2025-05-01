// src/services/tableService.js
import api from '../api/axios';

/**
 * Service pour gérer les requêtes API liées aux tables
 */
const tableService = {
  // Récupérer toutes les tables (avec filtres optionnels)
  getAllTables: async (filters = {}) => {
    try {
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      
      if (filters.floorPlan) {
        queryParams.append('floorPlan', filters.floorPlan);
      }
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      if (filters.minCapacity) {
        queryParams.append('minCapacity', filters.minCapacity);
      }
      
      const response = await api.get(`/tables?${queryParams.toString()}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la récupération des tables:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération des tables'
      };
    }
  },
  
  // Récupérer une table spécifique
  getTable: async (tableId) => {
    try {
      const response = await api.get(`/tables/${tableId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la récupération de la table ${tableId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération de la table'
      };
    }
  },
  
  // Créer une nouvelle table
  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables', tableData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la création de la table:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création de la table'
      };
    }
  },
  
  // Mettre à jour une table existante
  updateTable: async (tableId, tableData) => {
    try {
      const response = await api.put(`/tables/${tableId}`, tableData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la table ${tableId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour de la table'
      };
    }
  },
  
  // Supprimer une table
  deleteTable: async (tableId) => {
    try {
      const response = await api.delete(`/tables/${tableId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error(`Erreur lors de la suppression de la table ${tableId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la suppression de la table'
      };
    }
  },
  
  // Mettre à jour la position d'une table
  updateTablePosition: async (tableId, position) => {
    try {
      const response = await api.patch(`/tables/${tableId}/position`, { position });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la position de la table ${tableId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour de la position'
      };
    }
  },
  
  // Mettre à jour le statut d'une table (free, reserved, occupied)
  updateTableStatus: async (tableId, status) => {
    try {
      const response = await api.patch(`/tables/${tableId}/status`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la table ${tableId}:`, error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la mise à jour du statut'
      };
    }
  },
  
  // Créer plusieurs tables à la fois
  createBatchTables: async (tables, floorPlanId) => {
    try {
      const response = await api.post('/tables/batch', { tables, floorPlanId });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erreur lors de la création en masse des tables:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création en masse des tables'
      };
    }
  }
};

export default tableService;