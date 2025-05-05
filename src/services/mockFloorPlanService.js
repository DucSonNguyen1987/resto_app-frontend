import { getStore } from '../store/store';
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

// URL de base pour les appels API (à modifier selon votre configuration)
const API_BASE_URL = '/api';

const mockFloorPlanService = {
  // Récupérer tous les plans de salle
  getAllFloorPlans: async () => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getStore().getState().floorPlan.value;
      
      getStore().dispatch(setLoading(false));
      return {
        success: true,
        data: { floorPlans: state.floorPlans },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la récupération des plans de salle'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération des plans de salle',
      };
    }
  },
  
  // Récupérer un plan de salle par son ID
  getFloorPlanDetails: async (floorPlanId) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getStore().getState().floorPlan.value;
      const floorPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!floorPlan) {
        getStore().dispatch(setError('Plan de salle non trouvé'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      // Récupérer les tables associées à ce plan
      const tables = state.tables.filter(table => table.floorPlan === floorPlanId);
      
      getStore().dispatch(setCurrentFloorPlan(floorPlan));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          floorPlan,
          tables,
        },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la récupération du plan de salle'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération du plan de salle',
      };
    }
  },
  
  // Créer un nouveau plan de salle
  createFloorPlan: async (floorPlanData) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer un ID unique
      const newId = 'fp' + Date.now();
      
      const newFloorPlan = {
        _id: newId,
        ...floorPlanData,
        createdBy: getStore().getState().user.value.id,
        lastModifiedBy: getStore().getState().user.value.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(addFloorPlan(newFloorPlan));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: newFloorPlan,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la création du plan de salle'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la création du plan de salle',
      };
    }
  },
  
  // Mettre à jour un plan de salle existant
  updateFloorPlan: async (floorPlanId, floorPlanData) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const state = getStore().getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        getStore().dispatch(setError('Plan de salle non trouvé'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      const updatedPlan = {
        ...existingPlan,
        ...floorPlanData,
        _id: floorPlanId, // Assurer que l'ID reste le même
        lastModifiedBy: getStore().getState().user.value.id,
        updatedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(updateFloorPlan(updatedPlan));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: updatedPlan,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la mise à jour du plan de salle'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du plan de salle',
      };
    }
  },
  
  // Supprimer un plan de salle
  deleteFloorPlan: async (floorPlanId) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const state = getStore().getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        getStore().dispatch(setError('Plan de salle non trouvé'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      getStore().dispatch(deleteFloorPlan(floorPlanId));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        message: 'Plan de salle supprimé avec succès',
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la suppression du plan de salle'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la suppression du plan de salle',
      };
    }
  },
  
  // Modifier le statut d'un plan de salle
  updateFloorPlanStatus: async (floorPlanId, status) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getStore().getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        getStore().dispatch(setError('Plan de salle non trouvé'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      // Vérifier que le statut est valide
      if (!['active', 'inactive', 'draft'].includes(status)) {
        getStore().dispatch(setError('Statut invalide'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Statut invalide. Les valeurs acceptées sont: active, inactive et draft',
        };
      }
      
      const updatedPlan = {
        ...existingPlan,
        status,
        lastModifiedBy: getStore().getState().user.value.id,
        updatedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(updateFloorPlan(updatedPlan));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: updatedPlan,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la mise à jour du statut du plan'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du statut du plan',
      };
    }
  },
  
  // Mettre à jour les obstacles d'un plan de salle
  updateFloorPlanObstacles: async (floorPlanId, obstacles) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getStore().getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        getStore().dispatch(setError('Plan de salle non trouvé'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      const updatedPlan = {
        ...existingPlan,
        obstacles,
        lastModifiedBy: getStore().getState().user.value.id,
        updatedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(updateFloorPlan(updatedPlan));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: updatedPlan,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la mise à jour des obstacles'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour des obstacles',
      };
    }
  },
  
  // Services pour les tables
  
  // Récupérer toutes les tables (avec filtres optionnels)
  getAllTables: async (filter = {}) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getStore().getState().floorPlan.value;
      let tables = [...state.tables];
      
      // Appliquer les filtres
      if (filter.floorPlan) {
        tables = tables.filter(table => table.floorPlan === filter.floorPlan);
      }
      
      if (filter.status) {
        tables = tables.filter(table => table.status === filter.status);
      }
      
      if (filter.minCapacity) {
        tables = tables.filter(table => table.capacity >= filter.minCapacity);
      }
      
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: tables,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la récupération des tables'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération des tables',
      };
    }
  },
  
  // Récupérer une table spécifique
  getTableById: async (tableId) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = getStore().getState().floorPlan.value;
      const table = state.tables.find(table => table._id === tableId);
      
      if (!table) {
        getStore().dispatch(setError('Table non trouvée'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: table,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la récupération de la table'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération de la table',
      };
    }
  },
  
  // Créer une nouvelle table
  createTable: async (tableData) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Vérifier si le numéro de table est unique pour ce plan de salle
      const state = getStore().getState().floorPlan.value;
      const existingTable = state.tables.find(
        table => table.number === tableData.number && table.floorPlan === tableData.floorPlan
      );
      
      if (existingTable) {
        getStore().dispatch(setError(`La table n°${tableData.number} existe déjà sur ce plan`));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: `La table n°${tableData.number} existe déjà sur ce plan`,
        };
      }
      
      // Générer un ID unique
      const newId = 't' + Date.now();
      
      const newTable = {
        _id: newId,
        ...tableData,
        lastModifiedBy: getStore().getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(addTable(newTable));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: newTable,
        },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la création de la table'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la création de la table',
      };
    }
  },
  
  // Mettre à jour une table existante
  updateTable: async (tableId, tableData) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getStore().getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        getStore().dispatch(setError('Table non trouvée'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      // Vérifier si le nouveau numéro de table est unique (si changé)
      if (tableData.number && tableData.number !== existingTable.number) {
        const floorPlanId = tableData.floorPlan || existingTable.floorPlan;
        const duplicateTable = state.tables.find(
          table => table.number === tableData.number && 
                  table.floorPlan === floorPlanId && 
                  table._id !== tableId
        );
        
        if (duplicateTable) {
          getStore().dispatch(setError(`La table n°${tableData.number} existe déjà sur ce plan`));
          getStore().dispatch(setLoading(false));
          return {
            success: false,
            error: `La table n°${tableData.number} existe déjà sur ce plan`,
          };
        }
      }
      
      const updatedTable = {
        ...existingTable,
        ...tableData,
        _id: tableId, // Assurer que l'ID reste le même
        lastModifiedBy: getStore().getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(updateTable(updatedTable));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: updatedTable,
        },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la mise à jour de la table'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la table',
      };
    }
  },
  
  // Supprimer une table
  deleteTable: async (tableId) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getStore().getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        getStore().dispatch(setError('Table non trouvée'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      getStore().dispatch(deleteTable(tableId));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        message: 'Table supprimée avec succès',
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la suppression de la table'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la suppression de la table',
      };
    }
  },
  
  // Mettre à jour la position d'une table
  updateTablePosition: async (tableId, position, rotation) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = getStore().getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        getStore().dispatch(setError('Table non trouvée'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      const updatedTable = {
        ...existingTable,
        position,
        rotation: rotation !== undefined ? rotation : existingTable.rotation,
        lastModifiedBy: getStore().getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(updateTable(updatedTable));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: updatedTable,
        },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la mise à jour de la position de la table'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la position de la table',
      };
    }
  },
  
  // Mettre à jour le statut d'une table
  updateTableStatus: async (tableId, status) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = getStore().getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        getStore().dispatch(setError('Table non trouvée'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      // Vérifier que le statut est valide
      if (!['free', 'reserved', 'occupied'].includes(status)) {
        getStore().dispatch(setError('Statut invalide'));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: 'Statut invalide. Les valeurs acceptées sont: free, reserved ou occupied',
        };
      }
      
      const updatedTable = {
        ...existingTable,
        status,
        lastModifiedBy: getStore().getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      getStore().dispatch(updateTable(updatedTable));
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: updatedTable,
        },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la mise à jour du statut de la table'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du statut de la table',
      };
    }
  },
  
  // Créer plusieurs tables en une seule fois
  createTablesBatch: async (tables, floorPlanId) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getStore().getState().floorPlan.value;
      
      // Vérifier si les numéros de table sont uniques
      const existingNumbers = state.tables
        .filter(table => table.floorPlan === floorPlanId)
        .map(table => table.number);
      
      const newNumbers = tables.map(table => table.number);
      const duplicateNumbers = newNumbers.filter(
        (num, idx) => newNumbers.indexOf(num) !== idx || existingNumbers.includes(num)
      );
      
      if (duplicateNumbers.length > 0) {
        getStore().dispatch(setError(`Numéros de table en conflit: ${duplicateNumbers.join(', ')}`));
        getStore().dispatch(setLoading(false));
        return {
          success: false,
          error: `Numéros de table en conflit: ${duplicateNumbers.join(', ')}`,
        };
      }
      
      // Créer les tables avec des IDs uniques
      const createdTables = tables.map(table => ({
        ...table,
        _id: 't' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        floorPlan: floorPlanId,
        lastModifiedBy: getStore().getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      }));
      
      // Ajouter chaque table au store
      createdTables.forEach(table => {
        getStore().dispatch(addTable(table));
      });
      
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: createdTables,
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la création des tables'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la création des tables',
      };
    }
  },
  
  // Récupérer toutes les tables d'un plan de salle
  getTablesByFloorPlan: async (floorPlanId) => {
    try {
      getStore().dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getStore().getState().floorPlan.value;
      const tables = state.tables.filter(table => table.floorPlan === floorPlanId);
      
      getStore().dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          tables,
        },
      };
    } catch (error) {
      getStore().dispatch(setError('Erreur lors de la récupération des tables'));
      getStore().dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération des tables',
      };
    }
  },
};

export default mockFloorPlanService;