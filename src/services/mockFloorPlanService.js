// src/services/mockFloorPlanService.js
import { jwtDecode } from 'jwt-decode';

// Données mockées pour les plans de salle
let mockFloorPlans = [
  {
    _id: 'fp1',
    name: 'Salle Principale',
    description: 'Salle principale du restaurant avec vue sur la terrasse',
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
    createdAt: '2024-04-30T10:00:00.000Z',
    updatedAt: '2024-05-01T14:00:00.000Z',
    obstacles: [
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 700, height: 20 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 50, y: 550 },
        dimensions: { width: 700, height: 20 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 20, height: 520 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 750, y: 50 },
        dimensions: { width: 20, height: 520 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'bar',
        position: { x: 650, y: 300 },
        dimensions: { width: 80, height: 200 },
        rotation: 0,
        color: '#5d4037',
        label: 'Bar'
      }
    ]
  },
  {
    _id: 'fp2',
    name: 'Terrasse',
    description: 'Espace extérieur avec 10 tables',
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
    createdAt: '2024-04-28T09:00:00.000Z',
    updatedAt: '2024-04-29T11:00:00.000Z',
    obstacles: [
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 500, height: 20 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 50, y: 350 },
        dimensions: { width: 500, height: 20 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 20, height: 320 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 550, y: 50 },
        dimensions: { width: 20, height: 320 },
        rotation: 0,
        color: '#8d6e63'
      }
    ]
  },
  {
    _id: 'fp3',
    name: 'Salon Privé',
    description: 'Salle pour événements privés et groupes',
    dimensions: {
      width: 500,
      height: 300,
      unit: 'pixels'
    },
    status: 'inactive',
    createdBy: {
      _id: '2',
      username: 'manager'
    },
    createdAt: '2024-05-01T15:00:00.000Z',
    updatedAt: '2024-05-02T10:00:00.000Z',
    obstacles: [
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 400, height: 20 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 50, y: 250 },
        dimensions: { width: 400, height: 20 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 50, y: 50 },
        dimensions: { width: 20, height: 220 },
        rotation: 0,
        color: '#8d6e63'
      },
      {
        type: 'wall',
        position: { x: 450, y: 50 },
        dimensions: { width: 20, height: 220 },
        rotation: 0,
        color: '#8d6e63'
      }
    ]
  }
];

// Données mockées pour les tables
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

// Fonction pour obtenir l'ID de l'utilisateur à partir du token JWT
const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch (error) {
    console.error('Token invalide:', error);
    return null;
  }
};

// Générer un ID unique
const generateId = () => {
  return 'id_' + Math.random().toString(36).substring(2, 9);
};

const mockFloorPlanService = {
  // Récupérer tous les plans de salle
  getAllFloorPlans: async () => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: mockFloorPlans
    };
  },
  
  // Récupérer les détails d'un plan de salle avec ses tables
  getFloorPlanDetails: async (floorPlanId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const userId = getUserIdFromToken();
    if (!userId) {
      return {
        success: false,
        error: 'Non authentifié'
      };
    }
    
    // Créer un nouvel ID pour le plan
    const newId = generateId();
    
    // Créer le nouveau plan
    const newFloorPlan = {
      _id: newId,
      ...floorPlanData,
      createdBy: {
        _id: userId,
        username: 'user_' + userId // Simuler un nom d'utilisateur
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      obstacles: floorPlanData.obstacles || []
    };
    
    // Ajouter le plan à la liste
    mockFloorPlans.push(newFloorPlan);
    
    return {
      success: true,
      data: newFloorPlan
    };
  },
  
  // Mettre à jour un plan de salle existant
  updateFloorPlan: async (floorPlanId, floorPlanData) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const floorPlanIndex = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (floorPlanIndex === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Mettre à jour le plan
    const updatedFloorPlan = {
      ...mockFloorPlans[floorPlanIndex],
      ...floorPlanData,
      updatedAt: new Date().toISOString()
    };
    
    mockFloorPlans[floorPlanIndex] = updatedFloorPlan;
    
    return {
      success: true,
      data: updatedFloorPlan
    };
  },
  
  // Supprimer un plan de salle
  deleteFloorPlan: async (floorPlanId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const floorPlanIndex = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (floorPlanIndex === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Supprimer le plan
    mockFloorPlans.splice(floorPlanIndex, 1);
    
    // Supprimer les tables associées
    mockTables = mockTables.filter(table => table.floorPlan !== floorPlanId);
    
    return {
      success: true,
      message: 'Plan de salle supprimé avec succès'
    };
  },
  
  // Mettre à jour les obstacles d'un plan de salle
  updateObstacles: async (floorPlanId, obstacles) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const floorPlanIndex = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (floorPlanIndex === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Mettre à jour les obstacles
    mockFloorPlans[floorPlanIndex].obstacles = obstacles;
    mockFloorPlans[floorPlanIndex].updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: mockFloorPlans[floorPlanIndex]
    };
  },
  
  // Changer le statut d'un plan de salle
  changeStatus: async (floorPlanId, status) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const floorPlanIndex = mockFloorPlans.findIndex(plan => plan._id === floorPlanId);
    
    if (floorPlanIndex === -1) {
      return {
        success: false,
        error: 'Plan de salle non trouvé'
      };
    }
    
    // Valider le statut
    if (!['active', 'inactive', 'draft'].includes(status)) {
      return {
        success: false,
        error: 'Statut invalide'
      };
    }
    
    // Mettre à jour le statut
    mockFloorPlans[floorPlanIndex].status = status;
    mockFloorPlans[floorPlanIndex].updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: mockFloorPlans[floorPlanIndex]
    };
  }
};

export default mockFloorPlanService;