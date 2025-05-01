// src/services/mockReservationService.js

/**
 * Service de simulation pour les réservations sans backend
 * Utilisé pour les tests de l'interface utilisateur
 */

// Données de réservations simulées
const mockReservations = [
    {
      _id: '1',
      startTime: new Date('2025-05-01T19:00:00').toISOString(),
      endTime: new Date('2025-05-01T21:00:00').toISOString(),
      guests: 4,
      status: 'confirmed',
      tables: ['1', '2'],
      user: {
        _id: '1',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '0612345678'
      },
      specialOccasion: true,
      specialOccasionDetails: 'Anniversaire',
      notes: 'Réservation pour l\'anniversaire de madame',
      createdAt: new Date('2025-04-25T14:30:00').toISOString(),
      floorPlan: '1'
    },
    {
      _id: '2',
      startTime: new Date('2025-05-01T20:00:00').toISOString(),
      endTime: new Date('2025-05-01T22:00:00').toISOString(),
      guests: 2,
      status: 'pending',
      tables: ['3'],
      customerInfo: {
        name: 'Sophie Martin',
        email: 'sophie.martin@example.com',
        phone: '0687654321'
      },
      specialOccasion: false,
      notes: 'Préfère une table près de la fenêtre',
      createdAt: new Date('2025-04-29T10:15:00').toISOString(),
      floorPlan: '1'
    },
    {
      _id: '3',
      startTime: new Date('2025-05-01T12:30:00').toISOString(),
      endTime: new Date('2025-05-01T14:00:00').toISOString(),
      guests: 6,
      status: 'arrived',
      tables: ['4', '5'],
      user: {
        _id: '2',
        firstname: 'Pierre',
        lastname: 'Leroy',
        email: 'pierre.leroy@example.com',
        phone: '0612345679'
      },
      specialOccasion: false,
      notes: 'Groupe d\'affaires, besoin d\'une table calme',
      createdAt: new Date('2025-04-28T16:45:00').toISOString(),
      floorPlan: '1'
    },
    {
      _id: '4',
      startTime: new Date('2025-05-02T19:30:00').toISOString(),
      endTime: new Date('2025-05-02T21:30:00').toISOString(),
      guests: 3,
      status: 'confirmed',
      tables: ['6'],
      customerInfo: {
        name: 'Marie Dubois',
        email: 'marie.dubois@example.com',
        phone: '0678901234'
      },
      specialOccasion: false,
      notes: '',
      createdAt: new Date('2025-04-27T09:30:00').toISOString(),
      floorPlan: '1'
    }
  ];
  
  // Simuler un délai réseau
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const mockReservationService = {
    // Récupérer les réservations avec filtres optionnels
    getReservations: async (filters = {}) => {
      await delay(800); // Simuler un délai réseau
      
      let filteredReservations = [...mockReservations];
      
      // Appliquer les filtres
      if (filters.date) {
        const filterDate = new Date(filters.date);
        filterDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(filterDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        filteredReservations = filteredReservations.filter(reservation => {
          const reservationDate = new Date(reservation.startTime);
          return reservationDate >= filterDate && reservationDate < nextDay;
        });
      }
      
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
      
      if (filters.tableId) {
        filteredReservations = filteredReservations.filter(reservation => 
          reservation.tables.includes(filters.tableId)
        );
      }
      
      if (filters.userId) {
        filteredReservations = filteredReservations.filter(reservation => 
          reservation.user && reservation.user._id === filters.userId
        );
      }
      
      return { success: true, data: filteredReservations };
    },
    
    // Récupérer une réservation spécifique
    getReservation: async (reservationId) => {
      await delay(500); // Simuler un délai réseau
      
      const reservation = mockReservations.find(r => r._id === reservationId);
      
      if (!reservation) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }
      
      return { success: true, data: reservation };
    },
    
    // Créer une nouvelle réservation
    createReservation: async (reservationData) => {
      await delay(1000); // Simuler un délai réseau
      
      // Créer une nouvelle réservation simulée
      const newReservation = {
        _id: `${mockReservations.length + 1}`,
        ...reservationData,
        createdAt: new Date().toISOString()
      };
      
      // Dans une implémentation réelle, on sauvegarderait la réservation dans la base de données
      mockReservations.push(newReservation);
      
      return { success: true, data: newReservation };
    },
    
    // Mettre à jour une réservation existante
    updateReservation: async (reservationId, reservationData) => {
      await delay(800); // Simuler un délai réseau
      
      const index = mockReservations.findIndex(r => r._id === reservationId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }
      
      // Mettre à jour la réservation
      mockReservations[index] = {
        ...mockReservations[index],
        ...reservationData
      };
      
      return { success: true, data: mockReservations[index] };
    },
    
    // Supprimer une réservation
    deleteReservation: async (reservationId) => {
      await delay(700); // Simuler un délai réseau
      
      const index = mockReservations.findIndex(r => r._id === reservationId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }
      
      // Supprimer la réservation
      mockReservations.splice(index, 1);
      
      return { success: true, message: 'Réservation supprimée avec succès' };
    },
    
    // Mettre à jour le statut d'une réservation
    updateReservationStatus: async (reservationId, status) => {
      await delay(500); // Simuler un délai réseau
      
      const index = mockReservations.findIndex(r => r._id === reservationId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }
      
      // Mettre à jour le statut
      mockReservations[index].status = status;
      
      return { success: true, data: mockReservations[index] };
    },
    
    // Confirmer l'arrivée d'un client
    markCustomerArrived: async (reservationId) => {
      await delay(500); // Simuler un délai réseau
      
      const index = mockReservations.findIndex(r => r._id === reservationId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }
      
      // Marquer comme arrivé
      mockReservations[index].status = 'arrived';
      
      return { success: true, data: mockReservations[index] };
    },
    
    // Marquer une réservation comme "no-show"
    markNoShow: async (reservationId) => {
      await delay(500); // Simuler un délai réseau
      
      const index = mockReservations.findIndex(r => r._id === reservationId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Réservation non trouvée'
        };
      }
      
      // Marquer comme no-show
      mockReservations[index].status = 'no-show';
      
      return { success: true, data: mockReservations[index] };
    },
    
    // Vérifier la disponibilité des tables
    checkAvailability: async (data) => {
      await delay(1000); // Simuler un délai réseau
      
      // Simuler la vérification de disponibilité
      const { date, startTime, endTime, guests, floorPlanId } = data;
      
      // Trouver les réservations existantes pour cette période
      const reservationsForPeriod = mockReservations.filter(reservation => {
        const reservationStart = new Date(reservation.startTime);
        const reservationEnd = new Date(reservation.endTime);
        const requestStart = new Date(`${date}T${startTime}`);
        const requestEnd = new Date(`${date}T${endTime}`);
        
        // Vérifier si les périodes se chevauchent
        return (reservationStart < requestEnd && reservationEnd > requestStart);
      });
      
      // Tables déjà réservées pendant cette période
      const reservedTableIds = new Set();
      reservationsForPeriod.forEach(reservation => {
        reservation.tables.forEach(tableId => {
          reservedTableIds.add(tableId);
        });
      });
      
      // Simuler les tables disponibles (toutes les tables sauf celles réservées)
      const allTableIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
      const availableTables = allTableIds.filter(id => !reservedTableIds.has(id));
      
      return { 
        success: true, 
        data: {
          available: availableTables.length >= Math.ceil(guests / 4), // Supposons qu'une table peut accueillir 4 personnes
          availableTables: availableTables
        }
      };
    }
  };
  
  export default mockReservationService;