// src/services/mockReservationService.js
import { jwtDecode } from 'jwt-decode';

// Données mockées pour les réservations
let mockReservations = [
  {
    _id: 'r1',
    startTime: '2025-05-05T12:00:00.000Z',
    endTime: '2025-05-05T14:00:00.000Z',
    guests: 4,
    tables: ['t1'],
    status: 'confirmed',
    specialOccasion: false,
    notes: 'Préfère une table près de la fenêtre',
    customerInfo: {
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33123456789'
    },
    floorPlan: 'fp1',
    createdAt: '2025-05-01T10:00:00.000Z',
    updatedAt: '2025-05-01T10:00:00.000Z'
  },
  {
    _id: 'r2',
    startTime: '2025-05-05T13:00:00.000Z',
    endTime: '2025-05-05T15:30:00.000Z',
    guests: 2,
    tables: ['t2'],
    status: 'confirmed',
    specialOccasion: true,
    specialOccasionDetails: 'Anniversaire',
    notes: 'Gâteau commandé',
    customerInfo: {
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+33123456780'
    },
    floorPlan: 'fp1',
    createdAt: '2025-05-02T14:30:00.000Z',
    updatedAt: '2025-05-02T14:30:00.000Z'
  },
  {
    _id: 'r3',
    startTime: '2025-05-05T19:00:00.000Z',
    endTime: '2025-05-05T21:00:00.000Z',
    guests: 8,
    tables: ['t4'],
    status: 'arrived',
    specialOccasion: false,
    notes: 'Groupe business',
    customerInfo: {
      name: 'Pierre Lefebvre',
      email: 'pierre.lefebvre@email.com',
      phone: '+33123456781'
    },
    floorPlan: 'fp1',
    createdAt: '2025-05-03T09:15:00.000Z',
    updatedAt: '2025-05-05T19:05:00.000Z'
  },
  {
    _id: 'r4',
    startTime: '2025-05-06T12:30:00.000Z',
    endTime: '2025-05-06T14:30:00.000Z',
    guests: 6,
    tables: ['t3'],
    status: 'confirmed',
    specialOccasion: false,
    notes: '',
    customerInfo: {
      name: 'Sophie Dubois',
      email: 'sophie.dubois@email.com',
      phone: '+33123456782'
    },
    floorPlan: 'fp1',
    createdAt: '2025-05-03T11:00:00.000Z',
    updatedAt: '2025-05-03T11:00:00.000Z'
  },
  {
    _id: 'r5',
    startTime: '2025-05-06T19:30:00.000Z',
    endTime: '2025-05-06T21:30:00.000Z',
    guests: 2,
    tables: ['t10'],
    status: 'confirmed',
    specialOccasion: true,
    specialOccasionDetails: 'Anniversaire de mariage',
    notes: 'Table la plus romantique possible',
    customerInfo: {
      name: 'Lucas Bernard',
      email: 'lucas.bernard@email.com',
      phone: '+33123456783'
    },
    floorPlan: 'fp2',
    createdAt: '2025-05-01T16:45:00.000Z',
    updatedAt: '2025-05-01T16:45:00.000Z'
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
  return 'r' + Math.floor(Math.random() * 10000);
};

// Vérifier si les tables sont disponibles pour une période donnée
const areTablesAvailable = (tableIds, startTime, endTime, excludeReservationId = null) => {
  // Convertir les dates en objets Date pour faciliter la comparaison
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // Vérifier chaque table
  for (const tableId of tableIds) {
    // Trouver toutes les réservations pour cette table
    const reservationsForTable = mockReservations.filter(reservation => 
      reservation.tables.includes(tableId) && 
      reservation._id !== excludeReservationId
    );
    
    // Vérifier s'il y a un chevauchement avec une réservation existante
    for (const reservation of reservationsForTable) {
      const reservationStart = new Date(reservation.startTime);
      const reservationEnd = new Date(reservation.endTime);
      
      // Vérifier le chevauchement
      if (
        (start < reservationEnd && end > reservationStart) ||
        (reservationStart < end && reservationEnd > start)
      ) {
        return false; // Chevauchement trouvé
      }
    }
  }
  
  return true; // Aucun chevauchement trouvé
};

const mockReservationService = {
  // Récupérer toutes les réservations avec des filtres optionnels
  getAllReservations: async (filters = {}) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredReservations = [...mockReservations];
    
    // Appliquer les filtres
    if (filters.floorPlan) {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.floorPlan === filters.floorPlan
      );
    }
    
    if (filters.status) {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.status === filters.status
      );
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filteredReservations = filteredReservations.filter(reservation => {
        const reservationDate = new Date(reservation.startTime);
        return (
          reservationDate.getFullYear() === filterDate.getFullYear() &&
          reservationDate.getMonth() === filterDate.getMonth() &&
          reservationDate.getDate() === filterDate.getDate()
        );
      });
    }
    
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      filteredReservations = filteredReservations.filter(reservation => {
        const reservationDate = new Date(reservation.startTime);
        return reservationDate >= startDate && reservationDate <= endDate;
      });
    }
    
    if (filters.customerName) {
      const searchName = filters.customerName.toLowerCase();
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.customerInfo.name.toLowerCase().includes(searchName)
      );
    }
    
    if (filters.customerEmail) {
      const searchEmail = filters.customerEmail.toLowerCase();
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.customerInfo.email.toLowerCase().includes(searchEmail)
      );
    }
    
    if (filters.customerPhone) {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.customerInfo.phone.includes(filters.customerPhone)
      );
    }
    
    if (filters.minGuests) {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.guests >= parseInt(filters.minGuests)
      );
    }
    
    if (filters.maxGuests) {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.guests <= parseInt(filters.maxGuests)
      );
    }
    
    if (filters.specialOccasion !== undefined) {
      filteredReservations = filteredReservations.filter(reservation => 
        reservation.specialOccasion === filters.specialOccasion
      );
    }
    
    // Trier par date/heure de début
    filteredReservations.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    return {
      success: true,
      data: filteredReservations
    };
  },
  
  // Récupérer une réservation spécifique
  getReservation: async (reservationId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const reservation = mockReservations.find(reservation => reservation._id === reservationId);
    
    if (!reservation) {
      return {
        success: false,
        error: 'Réservation non trouvée'
      };
    }
    
    return {
      success: true,
      data: reservation
    };
  },
  
  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifier les données requises
    if (!reservationData.startTime || !reservationData.endTime || !reservationData.guests || !reservationData.tables || !reservationData.floorPlan) {
      return {
        success: false,
        error: 'Données de réservation incomplètes'
      };
    }
    
    // Vérifier que les tables sont disponibles
    if (!areTablesAvailable(reservationData.tables, reservationData.startTime, reservationData.endTime)) {
      return {
        success: false,
        error: 'Les tables sélectionnées ne sont pas disponibles pour cette période'
      };
    }
    
    // Générer un ID pour la nouvelle réservation
    const newId = generateId();
    
    // Créer la nouvelle réservation
    const timestamp = new Date().toISOString();
    const newReservation = {
      _id: newId,
      ...reservationData,
      status: reservationData.status || 'confirmed',
      specialOccasion: reservationData.specialOccasion || false,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Ajouter la réservation à la liste
    mockReservations.push(newReservation);
    
    return {
      success: true,
      data: newReservation
    };
  },
  
  // Mettre à jour une réservation existante
  updateReservation: async (reservationId, reservationData) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const reservationIndex = mockReservations.findIndex(reservation => reservation._id === reservationId);
    
    if (reservationIndex === -1) {
      return {
        success: false,
        error: 'Réservation non trouvée'
      };
    }
    
    // Vérifier si les tables sont disponibles (si elles ont été modifiées)
    if (reservationData.tables && reservationData.startTime && reservationData.endTime) {
      if (!areTablesAvailable(reservationData.tables, reservationData.startTime, reservationData.endTime, reservationId)) {
        return {
          success: false,
          error: 'Les tables sélectionnées ne sont pas disponibles pour cette période'
        };
      }
    }
    
    // Mettre à jour la réservation
    const updatedReservation = {
      ...mockReservations[reservationIndex],
      ...reservationData,
      updatedAt: new Date().toISOString()
    };
    
    mockReservations[reservationIndex] = updatedReservation;
    
    return {
      success: true,
      data: updatedReservation
    };
  },
  
  // Annuler une réservation
  cancelReservation: async (reservationId, reason = '') => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const reservationIndex = mockReservations.findIndex(reservation => reservation._id === reservationId);
    
    if (reservationIndex === -1) {
      return {
        success: false,
        error: 'Réservation non trouvée'
      };
    }
    
    // Mettre à jour le statut de la réservation
    mockReservations[reservationIndex].status = 'cancelled';
    mockReservations[reservationIndex].cancelReason = reason;
    mockReservations[reservationIndex].updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: mockReservations[reservationIndex]
    };
  },
  
  // Supprimer une réservation
  deleteReservation: async (reservationId) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const reservationIndex = mockReservations.findIndex(reservation => reservation._id === reservationId);
    
    if (reservationIndex === -1) {
      return {
        success: false,
        error: 'Réservation non trouvée'
      };
    }
    
    // Supprimer la réservation
    mockReservations.splice(reservationIndex, 1);
    
    return {
      success: true,
      message: 'Réservation supprimée avec succès'
    };
  },
  
  // Mettre à jour le statut d'une réservation
  updateReservationStatus: async (reservationId, status) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reservationIndex = mockReservations.findIndex(reservation => reservation._id === reservationId);
    
    if (reservationIndex === -1) {
      return {
        success: false,
        error: 'Réservation non trouvée'
      };
    }
    
    // Valider le statut
    const validStatuses = ['confirmed', 'arrived', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: 'Statut invalide'
      };
    }
    
    // Mettre à jour le statut
    mockReservations[reservationIndex].status = status;
    mockReservations[reservationIndex].updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: mockReservations[reservationIndex]
    };
  },
  
  // Rechercher les tables disponibles pour une période donnée
  findAvailableTables: async (floorPlanId, startTime, endTime, guests) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Importer les données des tables (normalement, ce serait via une API)
    // Pour simuler, copier la structure de mockTableService
    const mockTables = [
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
      }
    ];
    
    // Filtrer les tables par floorPlan
    let tablesInPlan = mockTables.filter(table => table.floorPlan === floorPlanId);
    
    // Filtrer les tables avec une capacité suffisante
    tablesInPlan = tablesInPlan.filter(table => table.capacity >= guests);
    
    // Trouver les réservations existantes pour cette période
    const conflictingReservations = mockReservations.filter(reservation => {
      const reservationStart = new Date(reservation.startTime);
      const reservationEnd = new Date(reservation.endTime);
      const searchStart = new Date(startTime);
      const searchEnd = new Date(endTime);
      
      return (
        reservation.floorPlan === floorPlanId &&
        ((searchStart < reservationEnd && searchEnd > reservationStart) ||
        (reservationStart < searchEnd && reservationEnd > searchStart))
      );
    });
    
    // Obtenir les IDs des tables déjà réservées
    const reservedTableIds = new Set();
    conflictingReservations.forEach(reservation => {
      reservation.tables.forEach(tableId => {
        reservedTableIds.add(tableId);
      });
    });
    
    // Filtrer les tables disponibles
    const availableTables = tablesInPlan.filter(table => !reservedTableIds.has(table._id));
    
    return {
      success: true,
      data: availableTables
    };
  },
  
  // Obtenir les statistiques des réservations
  getReservationStats: async (startDate, endDate) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Convertir les dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Filtrer les réservations dans la période spécifiée
    const reservationsInPeriod = mockReservations.filter(reservation => {
      const reservationDate = new Date(reservation.startTime);
      return reservationDate >= start && reservationDate <= end;
    });
    
    // Calculer les statistiques
    const totalReservations = reservationsInPeriod.length;
    const confirmedReservations = reservationsInPeriod.filter(r => r.status === 'confirmed').length;
    const arrivedReservations = reservationsInPeriod.filter(r => r.status === 'arrived').length;
    const completedReservations = reservationsInPeriod.filter(r => r.status === 'completed').length;
    const cancelledReservations = reservationsInPeriod.filter(r => r.status === 'cancelled').length;
    const noShowReservations = reservationsInPeriod.filter(r => r.status === 'no-show').length;
    
    const totalGuests = reservationsInPeriod.reduce((sum, r) => sum + r.guests, 0);
    const specialOccasions = reservationsInPeriod.filter(r => r.specialOccasion).length;
    
    // Regrouper par plan de salle
    const floorPlanCounts = {};
    reservationsInPeriod.forEach(r => {
      floorPlanCounts[r.floorPlan] = (floorPlanCounts[r.floorPlan] || 0) + 1;
    });
    
    // Regrouper par jour
    const dailyCounts = {};
    reservationsInPeriod.forEach(r => {
      const date = new Date(r.startTime).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    return {
      success: true,
      data: {
        totalReservations,
        confirmedReservations,
        arrivedReservations,
        completedReservations,
        cancelledReservations,
        noShowReservations,
        totalGuests,
        specialOccasions,
        floorPlanCounts,
        dailyCounts
      }
    };
  },
  
  // Importer des réservations depuis un fichier CSV
  importReservations: async (csvData) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simuler l'importation (normalement, il y aurait un traitement du CSV)
    const importedCount = Math.floor(Math.random() * 10) + 5; // Entre 5 et 14 réservations
    
    return {
      success: true,
      data: {
        importedCount,
        message: `${importedCount} réservations importées avec succès`
      }
    };
  },
  
  // Exporter des réservations au format CSV
  exportReservations: async (filters = {}) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Obtenir les réservations filtrées (réutiliser la fonction getAllReservations)
    const result = await mockReservationService.getAllReservations(filters);
    
    if (!result.success) {
      return result;
    }
    
    // Simuler la génération d'un CSV
    const reservationCount = result.data.length;
    
    return {
      success: true,
      data: {
        csv: `mock_csv_data_for_${reservationCount}_reservations`,
        exportedCount: reservationCount
      }
    };
  }
};

export default mockReservationService;