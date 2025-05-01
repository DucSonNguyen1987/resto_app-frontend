// src/services/mockTableService.js

/**
 * Service de simulation pour les tables sans backend
 * Utilisé pour les tests de l'interface utilisateur
 */

// Référence aux tables simulées (partagée avec mockFloorPlanService)
// Note: dans une application réelle, ces données seraient dans une base de données
let mockTables = [
    {
      _id: '1',
      number: 1,
      capacity: 4,
      shape: 'circle',
      position: { x: 150, y: 150 },
      dimensions: { width: 60, height: 60 },
      status: 'free',
      floorPlan: '1'
    },
    {
      _id: '2',
      number: 2,
      capacity: 4,
      shape: 'circle',
      position: { x: 250, y: 150 },
      dimensions: { width: 60, height: 60 },
      status: 'free',
      floorPlan: '1'
    },
    {
      _id: '3',
      number: 3,
      capacity: 2,
      shape: 'circle',
      position: { x: 350, y: 150 },
      dimensions: { width: 50, height: 50 },
      status: 'free',
      floorPlan: '1'
    },
    {
      _id: '4',
      number: 4,
      capacity: 6,
      shape: 'rectangle',
      position: { x: 150, y: 300 },
      dimensions: { width: 100, height: 60 },
      status: 'free',
      floorPlan: '1'
    },
    {
      _id: '5',
      number: 5,
      capacity: 6,
      shape: 'rectangle',
      position: { x: 300, y: 300 },
      dimensions: { width: 100, height: 60 },
      status: 'free',
      floorPlan: '1'
    },
    {
      _id: '6',
      number: 6,
      capacity: 4,
      shape: 'square',
      position: { x: 450, y: 300 },
      dimensions: { width: 70, height: 70 },
      status: 'free',
      floorPlan: '1'
    },
    {
      _id: '7',
      number: 1,
      capacity: 4,
      shape: 'circle',
      position: { x: 150, y: 150 },
      dimensions: { width: 60, height: 60 },
      status: 'free',
      floorPlan: '2'
    },
    {
      _id: '8',
      number: 2,
      capacity: 4,
      shape: 'circle',
      position: { x: 250, y: 150 },
      dimensions: { width: 60, height: 60 },
      status: 'free',
      floorPlan: '2'
    },
    {
      _id: '9',
      number: 3,
      capacity: 2,
      shape: 'circle',
      position: { x: 350, y: 150 },
      dimensions: { width: 50, height: 50 },
      status: 'free',
      floorPlan: '2'
    }
  ];
  
  // Simuler un délai réseau
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  /**
   * Service pour simuler les APIs liées aux tables
   */
  const mockTableService = {
    // Récupérer toutes les tables (avec filtres optionnels)
    getAllTables: async (filters = {}) => {
      await delay(800); // Simuler un délai réseau
      
      let filteredTables = [...mockTables];
      
      // Appliquer les filtres
      if (filters.floorPlan) {
        filteredTables = filteredTables.filter(table => 
          table.floorPlan === filters.floorPlan
        );
      }
      
      if (filters.status) {
        filteredTables = filteredTables.filter(table => 
          table.status === filters.status
        );
      }
      
      if (filters.minCapacity) {
        filteredTables = filteredTables.filter(table => 
          table.capacity >= parseInt(filters.minCapacity, 10)
        );
      }
      
      return { success: true, data: filteredTables };
    },
    
    // Récupérer une table spécifique
    getTable: async (tableId) => {
      await delay(500); // Simuler un délai réseau
      
      const table = mockTables.find(t => t._id === tableId);
      
      if (!table) {
        return {
          success: false,
          error: 'Table non trouvée'
        };
      }
      
      return { success: true, data: table };
    },
    
    // Créer une nouvelle table
    createTable: async (tableData) => {
      await delay(1000); // Simuler un délai réseau
      
      // Créer une nouvelle table simulée
      const newTable = {
        _id: `${mockTables.length + 1}`,
        ...tableData
      };
      
      // Dans une implémentation réelle, on sauvegarderait la table dans la base de données
      mockTables.push(newTable);
      
      return { success: true, data: newTable };
    },
    
    // Mettre à jour une table existante
    updateTable: async (tableId, tableData) => {
      await delay(800); // Simuler un délai réseau
      
      const index = mockTables.findIndex(t => t._id === tableId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Table non trouvée'
        };
      }
      
      // Mettre à jour la table
      mockTables[index] = {
        ...mockTables[index],
        ...tableData
      };
      
      return { success: true, data: mockTables[index] };
    },
    
    // Supprimer une table
    deleteTable: async (tableId) => {
      await delay(700); // Simuler un délai réseau
      
      const index = mockTables.findIndex(t => t._id === tableId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Table non trouvée'
        };
      }
      
      // Supprimer la table
      mockTables.splice(index, 1);
      
      return { success: true, message: 'Table supprimée avec succès' };
    },
    
    // Mettre à jour la position d'une table
    updateTablePosition: async (tableId, position) => {
      await delay(500); // Simuler un délai réseau
      
      const index = mockTables.findIndex(t => t._id === tableId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Table non trouvée'
        };
      }
      
      // Mettre à jour la position
      mockTables[index].position = position;
      
      return { success: true, data: mockTables[index] };
    },
    
    // Mettre à jour le statut d'une table (free, reserved, occupied)
    updateTableStatus: async (tableId, status) => {
      await delay(500); // Simuler un délai réseau
      
      const index = mockTables.findIndex(t => t._id === tableId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Table non trouvée'
        };
      }
      
      // Mettre à jour le statut
      mockTables[index].status = status;
      
      return { success: true, data: mockTables[index] };
    },
    
    // Créer plusieurs tables à la fois
    createBatchTables: async (tables, floorPlanId) => {
      await delay(1200); // Simuler un délai réseau
      
      const newTables = [];
      
      // Créer chaque table
      for (let i = 0; i < tables.length; i++) {
        const newTable = {
          _id: `${mockTables.length + 1 + i}`,
          ...tables[i],
          floorPlan: floorPlanId
        };
        
        newTables.push(newTable);
        mockTables.push(newTable);
      }
      
      return { success: true, data: newTables };
    }
  };
  
  export default mockTableService;