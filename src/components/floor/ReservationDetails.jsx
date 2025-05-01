// src/components/floor/ReservationDetails.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const ReservationDetails = ({ reservation, onEdit }) => {
  const user = useSelector(state => state.user.value);
  
  // Vérifier les permissions pour modifier les réservations
  const canEditReservation = ['ADMIN', 'OWNER', 'MANAGER', 'STAFF'].includes(user.role);
  
  // Formater la date et l'heure pour l'affichage
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formater la durée de la réservation
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs === 0) {
      return `${diffMins} minutes`;
    } else if (diffMins === 0) {
      return `${diffHrs} heure${diffHrs > 1 ? 's' : ''}`;
    } else {
      return `${diffHrs} heure${diffHrs > 1 ? 's' : ''} et ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    }
  };
  
  return (
    <div className="reservation-details">
      <div className="reservation-header">
        <h4>Détails de la réservation</h4>
        <span className={`status-badge ${reservation.status}`}>
          {reservation.status === 'pending' ? 'En attente' :
           reservation.status === 'confirmed' ? 'Confirmée' :
           reservation.status === 'cancelled' ? 'Annulée' :
           reservation.status === 'completed' ? 'Terminée' :
           reservation.status === 'no-show' ? 'Non présenté' :
           reservation.status === 'arrived' ? 'Arrivé' : 'Inconnue'}
        </span>
      </div>
      
      <div className="customer-info">
        <h5>Client</h5>
        {reservation.user ? (
          <div>
            <p>
              <strong>Nom:</strong> {reservation.user.firstname} {reservation.user.lastname}
            </p>
            <p>
              <strong>Email:</strong> {reservation.user.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {reservation.user.phone}
            </p>
          </div>
        ) : (
          <div>
            <p>
              <strong>Nom:</strong> {reservation.customerInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {reservation.customerInfo.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {reservation.customerInfo.phone}
            </p>
          </div>
        )}
      </div>
      
      <div className="reservation-time-info">
        <p>
          <strong>Début:</strong> {formatDateTime(reservation.startTime)}
        </p>
        <p>
          <strong>Fin:</strong> {formatDateTime(reservation.endTime)}
        </p>
        <p>
          <strong>Durée:</strong> {calculateDuration(reservation.startTime, reservation.endTime)}
        </p>
      </div>
      
      <div className="reservation-details-info">
        <p>
          <strong>Nombre de personnes:</strong> {reservation.guests}
        </p>
        <p>
          <strong>Tables:</strong> {
            reservation.tables.length > 1 
              ? `Tables ${reservation.tables.map(table => 
                  typeof table === 'object' ? table.number : 'n/a').join(', ')}` 
              : `Table ${typeof reservation.tables[0] === 'object' ? reservation.tables[0].number : 'n/a'}`
          }
        </p>
        {reservation.specialOccasion && (
          <p>
            <strong>Occasion spéciale:</strong> {reservation.specialOccasionDetails || 'Oui'}
          </p>
        )}
        {reservation.notes && (
          <div className="notes">
            <strong>Notes:</strong>
            <p>{reservation.notes}</p>
          </div>
        )}
      </div>
      
      {/* Actions possibles selon le statut */}
      {canEditReservation && (
        <div className="reservation-actions">
          {reservation.status === 'pending' && (
            <>
              <button 
                className="btn btn-success"
                onClick={() => onEdit(reservation._id, 'confirm')}
              >
                Confirmer
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => onEdit(reservation._id, 'cancel')}
              >
                Annuler
              </button>
            </>
          )}
          
          {reservation.status === 'confirmed' && (
            <>
              <button 
                className="btn btn-success"
                onClick={() => onEdit(reservation._id, 'arrive')}
              >
                Client arrivé
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => onEdit(reservation._id, 'no-show')}
              >
                No-show
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => onEdit(reservation._id, 'cancel')}
              >
                Annuler
              </button>
            </>
          )}
          
          {reservation.status === 'arrived' && (
            <button 
              className="btn btn-success"
              onClick={() => onEdit(reservation._id, 'complete')}
            >
              Terminer
            </button>
          )}
          
          <button 
            className="btn btn-secondary"
            onClick={() => onEdit(reservation._id, 'edit')}
          >
            Modifier
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationDetails;