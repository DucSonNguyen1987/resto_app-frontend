import store from '../store/store';
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
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = store.getState().floorPlan.value;
      
      store.dispatch(setLoading(false));
      return {
        success: true,
        data: { floorPlans: state.floorPlans },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la récupération des plans de salle'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération des plans de salle',
      };
    }
  },
  
  // Récupérer un plan de salle par son ID
  getFloorPlanDetails: async (floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = store.getState().floorPlan.value;
      const floorPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!floorPlan) {
        store.dispatch(setError('Plan de salle non trouvé'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      // Récupérer les tables associées à ce plan
      const tables = state.tables.filter(table => table.floorPlan === floorPlanId);
      
      store.dispatch(setCurrentFloorPlan(floorPlan));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          floorPlan,
          tables,
        },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la récupération du plan de salle'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération du plan de salle',
      };
    }
  },
  
  // Créer un nouveau plan de salle
  createFloorPlan: async (floorPlanData) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer un ID unique
      const newId = 'fp' + Date.now();
      
      const newFloorPlan = {
        _id: newId,
        ...floorPlanData,
        createdBy: store.getState().user.value.id,
        lastModifiedBy: store.getState().user.value.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      store.dispatch(addFloorPlan(newFloorPlan));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: newFloorPlan,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la création du plan de salle'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la création du plan de salle',
      };
    }
  },
  
  // Mettre à jour un plan de salle existant
  updateFloorPlan: async (floorPlanId, floorPlanData) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const state = store.getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        store.dispatch(setError('Plan de salle non trouvé'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      const updatedPlan = {
        ...existingPlan,
        ...floorPlanData,
        _id: floorPlanId, // Assurer que l'ID reste le même
        lastModifiedBy: store.getState().user.value.id,
        updatedAt: new Date().toISOString(),
      };
      
      store.dispatch(updateFloorPlan(updatedPlan));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: updatedPlan,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la mise à jour du plan de salle'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du plan de salle',
      };
    }
  },
  
  // Supprimer un plan de salle
  deleteFloorPlan: async (floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const state = store.getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        store.dispatch(setError('Plan de salle non trouvé'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      store.dispatch(deleteFloorPlan(floorPlanId));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        message: 'Plan de salle supprimé avec succès',
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la suppression du plan de salle'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la suppression du plan de salle',
      };
    }
  },
  
  // Modifier le statut d'un plan de salle
  updateFloorPlanStatus: async (floorPlanId, status) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = store.getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        store.dispatch(setError('Plan de salle non trouvé'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      // Vérifier que le statut est valide
      if (!['active', 'inactive', 'draft'].includes(status)) {
        store.dispatch(setError('Statut invalide'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Statut invalide. Les valeurs acceptées sont: active, inactive et draft',
        };
      }
      
      const updatedPlan = {
        ...existingPlan,
        status,
        lastModifiedBy: store.getState().user.value.id,
        updatedAt: new Date().toISOString(),
      };
      
      store.dispatch(updateFloorPlan(updatedPlan));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: updatedPlan,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la mise à jour du statut du plan'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du statut du plan',
      };
    }
  },
  
  // Mettre à jour les obstacles d'un plan de salle
  updateFloorPlanObstacles: async (floorPlanId, obstacles) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = store.getState().floorPlan.value;
      const existingPlan = state.floorPlans.find(plan => plan._id === floorPlanId);
      
      if (!existingPlan) {
        store.dispatch(setError('Plan de salle non trouvé'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Plan de salle non trouvé',
        };
      }
      
      const updatedPlan = {
        ...existingPlan,
        obstacles,
        lastModifiedBy: store.getState().user.value.id,
        updatedAt: new Date().toISOString(),
      };
      
      store.dispatch(updateFloorPlan(updatedPlan));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: updatedPlan,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la mise à jour des obstacles'));
      store.dispatch(setLoading(false));
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
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = store.getState().floorPlan.value;
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
      
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: tables,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la récupération des tables'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération des tables',
      };
    }
  },
  
  // Récupérer une table spécifique
  getTableById: async (tableId) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = store.getState().floorPlan.value;
      const table = state.tables.find(table => table._id === tableId);
      
      if (!table) {
        store.dispatch(setError('Table non trouvée'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: table,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la récupération de la table'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération de la table',
      };
    }
  },
  
  // Créer une nouvelle table
  createTable: async (tableData) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Vérifier si le numéro de table est unique pour ce plan de salle
      const state = store.getState().floorPlan.value;
      const existingTable = state.tables.find(
        table => table.number === tableData.number && table.floorPlan === tableData.floorPlan
      );
      
      if (existingTable) {
        store.dispatch(setError(`La table n°${tableData.number} existe déjà sur ce plan`));
        store.dispatch(setLoading(false));
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
        lastModifiedBy: store.getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      store.dispatch(addTable(newTable));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: newTable,
        },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la création de la table'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la création de la table',
      };
    }
  },
  
  // Mettre à jour une table existante
  updateTable: async (tableId, tableData) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = store.getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        store.dispatch(setError('Table non trouvée'));
        store.dispatch(setLoading(false));
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
          store.dispatch(setError(`La table n°${tableData.number} existe déjà sur ce plan`));
          store.dispatch(setLoading(false));
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
        lastModifiedBy: store.getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      store.dispatch(updateTable(updatedTable));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: updatedTable,
        },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la mise à jour de la table'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la table',
      };
    }
  },
  
  // Supprimer une table
  deleteTable: async (tableId) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = store.getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        store.dispatch(setError('Table non trouvée'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      store.dispatch(deleteTable(tableId));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        message: 'Table supprimée avec succès',
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la suppression de la table'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la suppression de la table',
      };
    }
  },
  
  // Mettre à jour la position d'une table
  updateTablePosition: async (tableId, position, rotation) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = store.getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        store.dispatch(setError('Table non trouvée'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      const updatedTable = {
        ...existingTable,
        position,
        rotation: rotation !== undefined ? rotation : existingTable.rotation,
        lastModifiedBy: store.getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      store.dispatch(updateTable(updatedTable));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: updatedTable,
        },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la mise à jour de la position de la table'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de la position de la table',
      };
    }
  },
  
  // Mettre à jour le statut d'une table
  updateTableStatus: async (tableId, status) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const state = store.getState().floorPlan.value;
      const existingTable = state.tables.find(table => table._id === tableId);
      
      if (!existingTable) {
        store.dispatch(setError('Table non trouvée'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Table non trouvée',
        };
      }
      
      // Vérifier que le statut est valide
      if (!['free', 'reserved', 'occupied'].includes(status)) {
        store.dispatch(setError('Statut invalide'));
        store.dispatch(setLoading(false));
        return {
          success: false,
          error: 'Statut invalide. Les valeurs acceptées sont: free, reserved ou occupied',
        };
      }
      
      const updatedTable = {
        ...existingTable,
        status,
        lastModifiedBy: store.getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      };
      
      store.dispatch(updateTable(updatedTable));
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          table: updatedTable,
        },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la mise à jour du statut de la table'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du statut de la table',
      };
    }
  },
  
  // Créer plusieurs tables en une seule fois
  createTablesBatch: async (tables, floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = store.getState().floorPlan.value;
      
      // Vérifier si les numéros de table sont uniques
      const existingNumbers = state.tables
        .filter(table => table.floorPlan === floorPlanId)
        .map(table => table.number);
      
      const newNumbers = tables.map(table => table.number);
      const duplicateNumbers = newNumbers.filter(
        (num, idx) => newNumbers.indexOf(num) !== idx || existingNumbers.includes(num)
      );
      
      if (duplicateNumbers.length > 0) {
        store.dispatch(setError(`Numéros de table en conflit: ${duplicateNumbers.join(', ')}`));
        store.dispatch(setLoading(false));
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
        lastModifiedBy: store.getState().user.value.id,
        lastModifiedAt: new Date().toISOString(),
      }));
      
      // Ajouter chaque table au store
      createdTables.forEach(table => {
        store.dispatch(addTable(table));
      });
      
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: createdTables,
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la création des tables'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la création des tables',
      };
    }
  },
  
  // Récupérer toutes les tables d'un plan de salle
  getTablesByFloorPlan: async (floorPlanId) => {
    try {
      store.dispatch(setLoading(true));
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = store.getState().floorPlan.value;
      const tables = state.tables.filter(table => table.floorPlan === floorPlanId);
      
      store.dispatch(setLoading(false));
      
      return {
        success: true,
        data: {
          tables,
        },
      };
    } catch (error) {
      store.dispatch(setError('Erreur lors de la récupération des tables'));
      store.dispatch(setLoading(false));
      return {
        success: false,
        error: 'Erreur lors de la récupération des tables',
      };
    }
  },
};

export default mockFloorPlanService;