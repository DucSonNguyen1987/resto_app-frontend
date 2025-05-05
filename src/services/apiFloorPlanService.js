import axios from '../api/axios';
import { store } from '../store/store';
import {
  setFloorPlans,
  addFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
  setCurrentFloorPlan,
  addTable,
  updateTable,
  deleteTable,
  setLoading,
  setError,
} from '../reducers/floorPlanSlice';

// Service réel qui interagit avec l'API backend
const apiFloorPlanService = {
  // Récupérer tous les plans de salle
  getAllFloorPlans: async () => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.get('/floorplans');
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        // Mettre à jour le store avec les plans récupérés
        store.dispatch(setFloorPlans(response.data.data));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: { floorPlans: response.data.data },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération des plans de salle');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération des plans de salle';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Récupérer un plan de salle par son ID
  getFloorPlanDetails: async (floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.get(`/floorplans/${floorPlanId}`);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const { floorPlan, tables } = response.data.data;
        
        // Mettre à jour le plan actuel dans le store
        store.dispatch(setCurrentFloorPlan(floorPlan));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: {
            floorPlan,
            tables,
          },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération du plan de salle');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération du plan de salle';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Créer un nouveau plan de salle
  createFloorPlan: async (floorPlanData) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.post('/floorplans', floorPlanData);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const newFloorPlan = response.data.data;
        
        // Ajouter le nouveau plan au store
        store.dispatch(addFloorPlan(newFloorPlan));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: newFloorPlan,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la création du plan de salle');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création du plan de salle';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Mettre à jour un plan de salle existant
  updateFloorPlan: async (floorPlanId, floorPlanData) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.put(`/floorplans/${floorPlanId}`, floorPlanData);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const updatedPlan = response.data.data;
        
        // Mettre à jour le plan dans le store
        store.dispatch(updateFloorPlan(updatedPlan));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: updatedPlan,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour du plan de salle');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du plan de salle';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Supprimer un plan de salle
  deleteFloorPlan: async (floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.delete(`/floorplans/${floorPlanId}`);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        // Supprimer le plan du store
        store.dispatch(deleteFloorPlan(floorPlanId));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          message: response.data.message || 'Plan de salle supprimé avec succès',
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la suppression du plan de salle');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression du plan de salle';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Modifier le statut d'un plan de salle
  updateFloorPlanStatus: async (floorPlanId, status) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.patch(`/floorplans/${floorPlanId}/status`, { status });
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const updatedPlan = response.data.data;
        
        // Mettre à jour le plan dans le store
        store.dispatch(updateFloorPlan(updatedPlan));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: updatedPlan,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour du statut du plan');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du statut du plan';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Mettre à jour les obstacles d'un plan de salle
  updateFloorPlanObstacles: async (floorPlanId, obstacles) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.post(`/floorplans/${floorPlanId}/obstacles`, { obstacles });
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const updatedPlan = response.data.data;
        
        // Mettre à jour le plan dans le store
        store.dispatch(updateFloorPlan(updatedPlan));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: updatedPlan,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour des obstacles');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour des obstacles';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Services pour les tables
  
  // Récupérer toutes les tables (avec filtres optionnels)
  getAllTables: async (filter = {}) => {
    try {
      store.dispatch(setLoading(true));
      
      // Construire l'URL avec les paramètres de requête
      let url = '/tables';
      const params = new URLSearchParams();
      
      if (filter.floorPlan) params.append('floorPlan', filter.floorPlan);
      if (filter.status) params.append('status', filter.status);
      if (filter.minCapacity) params.append('minCapacity', filter.minCapacity);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const tables = response.data.data;
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: tables,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération des tables');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération des tables';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Récupérer une table spécifique
  getTableById: async (tableId) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.get(`/tables/${tableId}`);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const table = response.data.data;
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: table,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération de la table');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération de la table';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Créer une nouvelle table
  createTable: async (tableData) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.post('/tables', tableData);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const newTable = response.data.data;
        
        // Ajouter la table au store
        store.dispatch(addTable(newTable));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: {
            table: newTable,
          },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la création de la table');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création de la table';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Mettre à jour une table existante
  updateTable: async (tableId, tableData) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.put(`/tables/${tableId}`, tableData);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const updatedTable = response.data.data;
        
        // Mettre à jour la table dans le store
        store.dispatch(updateTable(updatedTable));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: {
            table: updatedTable,
          },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour de la table');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour de la table';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Supprimer une table
  deleteTable: async (tableId) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.delete(`/tables/${tableId}`);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        // Supprimer la table du store
        store.dispatch(deleteTable(tableId));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          message: response.data.message || 'Table supprimée avec succès',
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la suppression de la table');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression de la table';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Mettre à jour la position d'une table
  updateTablePosition: async (tableId, position, rotation) => {
    try {
      store.dispatch(setLoading(true));
      
      const data = { position };
      if (rotation !== undefined) {
        data.rotation = rotation;
      }
      
      const response = await axios.patch(`/tables/${tableId}/position`, data);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const updatedTable = response.data.data;
        
        // Mettre à jour la table dans le store
        store.dispatch(updateTable(updatedTable));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: {
            table: updatedTable,
          },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour de la position de la table');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour de la position de la table';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Mettre à jour le statut d'une table
  updateTableStatus: async (tableId, status) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.patch(`/tables/${tableId}/status`, { status });
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const updatedTable = response.data.data;
        
        // Mettre à jour la table dans le store
        store.dispatch(updateTable(updatedTable));
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: {
            table: updatedTable,
          },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour du statut de la table');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du statut de la table';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Créer plusieurs tables en une seule fois
  createTablesBatch: async (tables, floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.post('/tables/batch', { tables, floorPlanId });
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const createdTables = response.data.data;
        
        // Ajouter chaque table au store
        createdTables.forEach(table => {
          store.dispatch(addTable(table));
        });
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: createdTables,
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la création des tables');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création des tables';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  
  // Récupérer toutes les tables d'un plan de salle
  getTablesByFloorPlan: async (floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      const response = await axios.get(`/tables?floorPlan=${floorPlanId}`);
      
      // Vérifier si la réponse est réussie
      if (response.data.result) {
        const tables = response.data.data;
        
        store.dispatch(setLoading(false));
        return {
          success: true,
          data: {
            tables,
          },
        };
      } else {
        throw new Error(response.data.error || 'Erreur lors de la récupération des tables');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la récupération des tables';
      store.dispatch(setError(errorMessage));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};

export default apiFloorPlanService;