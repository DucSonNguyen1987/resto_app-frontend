// src/services/mockTableService.js
import { jwtDecode } from 'jwt-decode';

// Importer les données des tables depuis le service de plan de salle
// En réalité, on importerait uniquement les fonctions utilitaires, mais pour
// avoir un état cohérent, on va simuler les données ici
let mockTables = [
  // Tables pour la salle principale (fp1)
  {
    _id: 't1',
    number: 1,
    floorPlan: 'fp1',
    capacity: 4,
    shape: 'circle',
    position: { x: 120, y: 120 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  {
    _id: 't2',
    number: 2,
    floorPlan: 'fp1',
    capacity: 2,
    shape: 'circle',
    position: { x: 220, y: 120 },
    dimensions: { width: 50, height: 50 },
    status: 'reserved'
  },
  {
    _id: 't3',
    number: 3,
    floorPlan: 'fp1',
    capacity: 6,
    shape: 'rectangle',
    position: { x: 350, y: 120 },
    dimensions: { width: 120, height: 60 },
    status: 'free'
  },
  {
    _id: 't4',
    number: 4,
    floorPlan: 'fp1',
    capacity: 8,
    shape: 'rectangle',
    position: { x: 150, y: 250 },
    dimensions: { width: 150, height: 70 },
    status: 'occupied'
  },
  {
    _id: 't5',
    number: 5,
    floorPlan: 'fp1',
    capacity: 4,
    shape: 'circle',
    position: { x: 350, y: 250 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  {
    _id: 't6',
    number: 6,
    floorPlan: 'fp1',
    capacity: 2,
    shape: 'square',
    position: { x: 150, y: 400 },
    dimensions: { width: 50, height: 50 },
    status: 'free'
  },
  {
    _id: 't7',
    number: 7,
    floorPlan: 'fp1',
    capacity: 4,
    shape: 'circle',
    position: { x: 250, y: 400 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  {
    _id: 't8',
    number: 8,
    floorPlan: 'fp1',
    capacity: 4,
    shape: 'circle',
    position: { x: 350, y: 400 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  // Tables pour la terrasse (fp2)
  {
    _id: 't9',
    number: 1,
    floorPlan: 'fp2',
    capacity: 2,
    shape: 'circle',
    position: { x: 120, y: 100 },
    dimensions: { width: 50, height: 50 },
    status: 'free'
  },
  {
    _id: 't10',
    number: 2,
    floorPlan: 'fp2',
    capacity: 4,
    shape: 'circle',
    position: { x: 220, y: 100 },
    dimensions: { width: 60, height: 60 },
    status: 'reserved'
  },
  {
    _id: 't11',
    number: 3,
    floorPlan: 'fp2',
    capacity: 4,
    shape: 'circle',
    position: { x: 320, y: 100 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  {
    _id: 't12',
    number: 4,
    floorPlan: 'fp2',
    capacity: 6,
    shape: 'rectangle',
    position: { x: 420, y: 100 },
    dimensions: { width: 90, height: 60 },
    status: 'free'
  },
  {
    _id: 't13',
    number: 5,
    floorPlan: 'fp2',
    capacity: 2,
    shape: 'circle',
    position: { x: 120, y: 200 },
    dimensions: { width: 50, height: 50 },
    status: 'free'
  },
  {
    _id: 't14',
    number: 6,
    floorPlan: 'fp2',
    capacity: 4,
    shape: 'circle',
    position: { x: 220, y: 200 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  {
    _id: 't15',
    number: 7,
    floorPlan: 'fp2',
    capacity: 4,
    shape: 'circle',
    position: { x: 320, y: 200 },
    dimensions: { width: 60, height: 60 },
    status: 'occupied'
  },
  {
    _id: 't16',
    number: 8,
    floorPlan: 'fp2',
    capacity: 4,
    shape: 'circle',
    position: { x: 420, y: 200 },
    dimensions: { width: 60, height: 60 },
    status: 'free'
  },
  {
    _id: 't17',
    number: 9,
    floorPlan: 'fp2',
    capacity: 2,
    shape: 'circle',
    position: { x: 170, y: 300 },
    dimensions: { width: 50, height: 50 },
    status: 'free'
  },
  {
    _id: 't18',
    number: 10,
    floorPlan: 'fp2',
    capacity: 2,
    shape: 'circle',
    position: { x: 370, y: 300 },
    dimensions: { width: 50, height: 50 },
    status: 'free'
  },
  // Tables pour le salon privé (fp3)
  {
    _id: 't19',
    number: 1,
    floorPlan: 'fp3',
    capacity: 8,
    shape: 'rectangle',
    position: { x: 250, y: 150 },
    dimensions: { width: 200, height: 80 },
    status: 'free'
  }
];

// Fonction utilitaire pour générer un ID unique
const generateId = () => {
  return 't' + Math.floor(Math.random() * 10000);
};

// Fonction pour trouver le prochain numéro de table disponible
const getNextTableNumber = (floorPlanId) => {
  const tablesInPlan = mockTables.filter(table => table.floorPlan === floorPlanId);
  if (tablesInPlan.length === 0) return 1;
  
  const maxNumber = Math.max(...tablesInPlan.map(table => table.number));
  return maxNumber + 1;
};

const mockTableService = {
  // Récupérer toutes les tables avec des filtres optionnels
  getAllTables: async (filters = {}) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredTables = [...mockTables];
    
    // Appliquer les filtres
    if (filters.floorPlan) {
      filteredTables = filteredTables.filter(table => table.floorPlan === filters.floorPlan);
    }
    
    if (filters.status) {
      filteredTables = filteredTables.filter(table => table.status === filters.status);
    }
    
    if (filters.minCapacity) {
      filteredTables = filteredTables.filter(table => table.capacity >= parseInt(filters.minCapacity));
    }
    
    return {
      success: true,
      data: filteredTables
    };
  },
  
  // Récupérer une table spécifique
  getTable: async (tableId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const table = mockTables.find(table => table._id === tableId);
    
    if (!table) {
      return {
        success: false,
        error: 'Table non trouvée'
      };
    }
    
    return {
      success: true,
      data: table
    };
  },
  
  // Créer une nouvelle table
  createTable: async (tableData) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifier que le plan de salle existe
    if (!tableData.floorPlan) {
      return {
        success: false,
        error: 'Plan de salle requis'
      };
    }
    
    // Générer un ID pour la nouvelle table
    const newId = generateId();
    
    // Attribuer un numéro de table s'il n'est pas fourni
    if (!tableData.number) {
      tableData.number = getNextTableNumber(tableData.floorPlan);
    }
    
    // Créer la nouvelle table
    const newTable = {
      _id: newId,
      ...tableData,
      status: tableData.status || 'free'
    };
    
    // Ajouter la table à la liste
    mockTables.push(newTable);
    
    return {
      success: true,
      data: newTable
    };
  },
  
  // Mettre à jour une table existante
  updateTable: async (tableId, tableData) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tableIndex = mockTables.findIndex(table => table._id === tableId);
    
    if (tableIndex === -1) {
      return {
        success: false,
        error: 'Table non trouvée'
      };
    }
    
    // Mettre à jour la table
    const updatedTable = {
      ...mockTables[tableIndex],
      ...tableData
    };
    
    mockTables[tableIndex] = updatedTable;
    
    return {
      success: true,
      data: updatedTable
    };
  },
  
  // Supprimer une table
  deleteTable: async (tableId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const tableIndex = mockTables.findIndex(table => table._id === tableId);
    
    if (tableIndex === -1) {
      return {
        success: false,
        error: 'Table non trouvée'
      };
    }
    
    // Supprimer la table
    mockTables.splice(tableIndex, 1);
    
    return {
      success: true,
      message: 'Table supprimée avec succès'
    };
  },
  
  // Mettre à jour la position d'une table
  updateTablePosition: async (tableId, position) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tableIndex = mockTables.findIndex(table => table._id === tableId);
    
    if (tableIndex === -1) {
      return {
        success: false,
        error: 'Table non trouvée'
      };
    }
    
    // Mettre à jour la position
    mockTables[tableIndex].position = position;
    
    return {
      success: true,
      data: mockTables[tableIndex]
    };
  },
  
  // Mettre à jour le statut d'une table
  updateTableStatus: async (tableId, status) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tableIndex = mockTables.findIndex(table => table._id === tableId);
    
    if (tableIndex === -1) {
      return {
        success: false,
        error: 'Table non trouvée'
      };
    }
    
    // Valider le statut
    if (!['free', 'reserved', 'occupied'].includes(status)) {
      return {
        success: false,
        error: 'Statut invalide'
      };
    }
    
    // Mettre à jour le statut
    mockTables[tableIndex].status = status;
    
    return {
      success: true,
      data: mockTables[tableIndex]
    };
  },
  
  // Créer plusieurs tables à la fois
  createBatchTables: async (tables, floorPlanId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!floorPlanId) {
      return {
        success: false,
        error: 'Plan de salle requis'
      };
    }
    
    // Vérifier que tables est un tableau
    if (!Array.isArray(tables)) {
      return {
        success: false,
        error: 'Les tables doivent être fournies sous forme de tableau'
      };
    }
    
    // Obtenir le prochain numéro de table disponible
    let nextNumber = getNextTableNumber(floorPlanId);
    
    // Créer les nouvelles tables
    const newTables = tables.map((tableData, index) => {
      const newId = generateId();
      return {
        _id: newId,
        ...tableData,
        floorPlan: floorPlanId,
        number: tableData.number || nextNumber + index,
        status: tableData.status || 'free'
      };
    });
    
    // Ajouter les tables à la liste
    mockTables = [...mockTables, ...newTables];
    
    return {
      success: true,
      data: newTables
    };
  }
};

export default mockTableService;