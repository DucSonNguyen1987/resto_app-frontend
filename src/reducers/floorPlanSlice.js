import { createSlice } from '@reduxjs/toolkit';

// Données initiales pour les plans de salle mockés
const initialMockData = {
  floorPlans: [
    {
      _id: 'fp1',
      name: 'Salle Principale',
      restaurantId: 'rest1',
      dimensions: { width: 800, height: 600 },
      capacity: 50,
      obstacles: [
        {
          type: 'wall',
          position: { x: 100, y: 100 },
          dimensions: { width: 200, height: 20 },
          rotation: 0,
          color: '#8d6e63',
        },
        {
          type: 'pillar',
          position: { x: 400, y: 300 },
          dimensions: { width: 30, height: 30 },
          rotation: 0,
          color: '#78909c',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'fp2',
      name: 'Terrasse',
      restaurantId: 'rest1',
      dimensions: { width: 500, height: 400 },
      capacity: 30,
      obstacles: [
        {
          type: 'bar',
          position: { x: 250, y: 50 },
          dimensions: { width: 200, height: 60 },
          rotation: 0,
          color: '#5d4037',
          label: 'Bar Extérieur',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tables: [
    {
      _id: 't1',
      number: 1,
      capacity: 4,
      shape: 'circle',
      position: { x: 200, y: 200 },
      dimensions: { width: 60, height: 60 },
      status: 'free',
      floorPlan: 'fp1',
    },
    {
      _id: 't2',
      number: 2,
      capacity: 2,
      shape: 'rectangle',
      position: { x: 300, y: 200 },
      dimensions: { width: 80, height: 50 },
      status: 'reserved',
      floorPlan: 'fp1',
    },
    {
      _id: 't3',
      number: 3,
      capacity: 6,
      shape: 'rectangle',
      position: { x: 150, y: 150 },
      dimensions: { width: 120, height: 80 },
      status: 'occupied',
      floorPlan: 'fp2',
    },
  ],
  loading: false,
  error: null,
  currentFloorPlan: null,
};

export const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState: { value: initialMockData },
  reducers: {
    // Récupérer tous les plans de salle
    setFloorPlans: (state, action) => {
      state.value.floorPlans = action.payload;
    },
    
    // Ajouter un nouveau plan de salle
    addFloorPlan: (state, action) => {
      state.value.floorPlans.push(action.payload);
    },
    
    // Mettre à jour un plan de salle existant
    updateFloorPlan: (state, action) => {
      const index = state.value.floorPlans.findIndex(
        (plan) => plan._id === action.payload._id
      );
      if (index !== -1) {
        state.value.floorPlans[index] = {
          ...state.value.floorPlans[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Supprimer un plan de salle
    deleteFloorPlan: (state, action) => {
      state.value.floorPlans = state.value.floorPlans.filter(
        (plan) => plan._id !== action.payload
      );
      // Supprimer également les tables associées
      state.value.tables = state.value.tables.filter(
        (table) => table.floorPlan !== action.payload
      );
    },
    
    // Définir le plan de salle actuel
    setCurrentFloorPlan: (state, action) => {
      state.value.currentFloorPlan = action.payload;
    },
    
    // Ajouter une nouvelle table
    addTable: (state, action) => {
      state.value.tables.push(action.payload);
    },
    
    // Mettre à jour une table existante
    updateTable: (state, action) => {
      const index = state.value.tables.findIndex(
        (table) => table._id === action.payload._id
      );
      if (index !== -1) {
        state.value.tables[index] = {
          ...state.value.tables[index],
          ...action.payload,
        };
      }
    },
    
    // Supprimer une table
    deleteTable: (state, action) => {
      state.value.tables = state.value.tables.filter(
        (table) => table._id !== action.payload
      );
    },
    
    // Mettre à jour les états de chargement et d'erreur
    setLoading: (state, action) => {
      state.value.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.value.error = action.payload;
    },
  },
});

export const {
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
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;