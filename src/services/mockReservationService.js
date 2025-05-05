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
    user: {
      _id: 'u1',
      username: 'client1',
      firstname: 'Pierre',
      lastname: 'Lefebvre',
      email: 'pierre.lefebvre@email.com',
      phone: '+33123456781'
    }
}
]