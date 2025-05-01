// src/services/mockFloorPlanService.js

/**
 * Service de simulation pour les plans de salle sans backend
 * Utilisé pour les tests de l'interface utilisateur
 */

// Données simulées des plans de salle
const mockFloorPlans = [
  {
    _id: '1',
    name: 'Salle Principale',
    description: 'Plan de la salle principale du restaurant',
    dimensions: {
      width: 800,
      height: 600,
      unit: 'pixels'
    },
    status: 'active',
    createdBy: {
      _id: '1',
      username: 'admin'
    },
    obstacles: [
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 700, height: 20 },
        rotation: 0
      },
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 20, height: 500 },
        rotation: 0
      },
      {
        type: 'wall',
        position: { x: 50, y: 530 },
        dimensions: { width: 700, height: 20 },
        rotation: 0
      },
      {
        type: 'wall',
        position: { x: 750, y: 50 },
        dimensions: { width: 20, height: 500 },
        rotation: 0
      },
      {
        type: 'bar',
        position: { x: 600, y: 100 },
        dimensions: { width: 120, height: 80 },
        rotation: 0,
        label: 'Bar'
      }
    ]
  },
  {
    _id: '2',
    name: 'Terrasse',
    description: 'Plan de la terrasse extérieure',
    dimensions: {
      width: 600,
      height: 400,
      unit: 'pixels'
    },
    status: 'active',
    createdBy: {
      _id: '1',
      username: 'admin'
    },
    obstacles: [
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 500, height: 20 },
        rotation: 0
      },
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 20, height: 300 },
        rotation: 0
      },
      {
        type: 'wall',
        position: { x: 50, y: 330 },
        dimensions: { width: 500, height: 20 },
        rotation: 0
      },
      {
        type: 'wall',
        position: { x: 550, y: 50 },
        dimensions: { width: 20, height: 300 },
        rotation: 0
      }
    ]
  }
];

// Tables simulées
const mockTables = [
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
 * Service pour simuler les APIs liées aux plans de salle
 */
const mockFloorPlanService = {
  // Récupérer tous les plans de salle
  getAllFloorPlans: async () => {
    await delay(800); // Simuler un délai réseau
    
    return { success: true, data: mockFloorPlans };
  },
  
  // Récupérer les détails d'un plan de salle avec ses tables
  getFloorPlanDetails: async (floorPlanId) => {
    await delay(1000); // Simuler un délai réseau
    
    const floorPlan = mockFloorPlans.find(plan => plan._id === floorPlanId);
    
    if (!floorPlan) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    const tables = mockTables.filter(table => table.floorPlan === floorPlanId);
    
    return {
      success: true,
      data: {
        floorPlan,
        tables
      }
    };
  },
  
  // Créer un nouveau plan de salle
  createFloorPlan: async (floorPlanData) => {
    await delay(1200); // Simuler un délai réseau
    
    // Créer un nouveau plan simulé
    const newFloorPlan = {
      _id: `${mockFloorPlans.length + 1}`,
      ...floorPlanData,
      createdBy: {
        _id: '1',
        username: 'admin'
      },
      obstacles: floorPlanData.obstacles || []
    };
    
    // Dans une implémentation réelle, on sauvegarderait le plan dans la base de données
    mockFloorPlans.push(newFloorPlan);
    
    return { success: true, data: newFloorPlan };
  },
  
  // Mettre à jour un plan de salle existant
  updateFloorPlan: async (floorPlanId, floorPlanData) => {
    await delay(1000); // Simuler un délai réseau
    
    const index = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Mettre à jour le plan
    mockFloorPlans[index] = {
      ...mockFloorPlans[index],
      ...floorPlanData
    };
    
    return { success: true, data: mockFloorPlans[index] };
  },
  
  // Supprimer un plan de salle
  deleteFloorPlan: async (floorPlanId) => {
    await delay(800); // Simuler un délai réseau
    
    const index = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Supprimer le plan
    mockFloorPlans.splice(index, 1);
    
    // Supprimer également les tables associées
    for (let i = mockTables.length - 1; i >= 0; i--) {
      if (mockTables[i].floorPlan === floorPlanId) {
        mockTables.splice(i, 1);
      }
    }
    
    return { success: true, message: 'Plan de salle supprimé avec succès' };
  },
  
  // Mettre à jour les obstacles d'un plan de salle
  updateObstacles: async (floorPlanId, obstacles) => {
    await delay(800); // Simuler un délai réseau
    
    const index = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Mettre à jour les obstacles
    mockFloorPlans[index].obstacles = obstacles;
    
    return { success: true, data: mockFloorPlans[index] };
  },
  
  // Changer le statut d'un plan de salle (draft, active, inactive)
  changeStatus: async (floorPlanId, status) => {
    await delay(600); // Simuler un délai réseau
    
    const index = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Mettre à jour le statut
    mockFloorPlans[index].status = status;
    
    return { success: true, data: mockFloorPlans[index] };
  }
};

export default mockFloorPlanService;