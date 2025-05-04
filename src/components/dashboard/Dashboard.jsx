import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../reducers/authSlice';
import DateSelector from '../common/DateSelector';
import NewFloorPlanModal from '../floor/NewFloorPlanModal';
import floorPlanService from '../../services/floorPlanService';
import '../../styles/Dashboard.css';
import DebugPanel from '../common/DebugPanel';


// Services mock (à remplacer par de vraies API)
import reservationService from '../../services/reservationService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Récupérer les informations d'authentification du store Redux
  const { username, firstname, lastname, role, twoFactorEnabled } = useSelector(state => state.user.value);
  
  // États pour les données du dashboard
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [floorPlans, setFloorPlans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    arrivedCustomers: 0,
    completedReservations: 0,
    cancelledReservations: 0,
    noShows: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour le modal de création de plan
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);

  // Charger les données au montage du composant et quand la date change
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Charger les plans de salle
        const floorPlansResponse = await floorPlanService.getAllFloorPlans();
        if (floorPlansResponse.success) {
          setFloorPlans(floorPlansResponse.data);
        }
        
        // Formatage de la date pour l'API
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        // Charger les réservations pour la date sélectionnée
        const reservationsResponse = await reservationService.getReservations({
          date: formattedDate
        });
        
        if (reservationsResponse.success) {
          const reservationData = reservationsResponse.data;
          setReservations(reservationData);
          
          // Calculer les statistiques
          const stats = {
            totalReservations: reservationData.length,
            pendingReservations: reservationData.filter(r => r.status === 'pending').length,
            confirmedReservations: reservationData.filter(r => r.status === 'confirmed').length,
            arrivedCustomers: reservationData.filter(r => r.status === 'arrived').length,
            completedReservations: reservationData.filter(r => r.status === 'completed').length,
            cancelledReservations: reservationData.filter(r => r.status === 'cancelled').length,
            noShows: reservationData.filter(r => r.status === 'no-show').length
          };
          
          setStats(stats);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
        setError('Une erreur est survenue lors du chargement des données. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [selectedDate]);

  // Gérer la création d'un nouveau plan
  const handleCreatePlan = async (newPlanData) => {
    try {
      const response = await floorPlanService.createFloorPlan(newPlanData);
      
      if (response.success) {
        // Ajouter le nouveau plan à la liste
        setFloorPlans([...floorPlans, response.data]);
        setShowNewPlanModal(false);
        // Montrer un message de succès ici si nécessaire
      } else {
        setError(response.error || 'Erreur lors de la création du plan de salle');
      }
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      setError('Impossible de créer le plan de salle');
    }
  };

  // Fonction pour se déconnecter
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Formater un statut pour l'affichage
  const formatStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'arrived':
        return 'Client arrivé';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      case 'no-show':
        return 'Non présenté';
      default:
        return status;
    }
  };

  // Formater l'heure pour l'affichage
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier si l'utilisateur a le droit de créer un plan
  const canCreatePlan = ['ADMIN', 'OWNER', 'MANAGER'].includes(role);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Tableau de bord</h2>
        <div className="date-picker-container">
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">Chargement des données...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="dashboard-content">
          {/* Section des alertes et informations */}
          <div className="dashboard-alerts">
            {!twoFactorEnabled && (role === 'ADMIN' || role === 'OWNER') && (
              <div className="alert warning">
                <h3>Important</h3>
                <p>Votre compte n'est pas protégé par l'authentification à deux facteurs. En tant que {role}, il est fortement recommandé d'activer cette protection.</p>
                <Link to="/2fa-management" className="btn btn-primary">Configurer maintenant</Link>
              </div>
            )}
          </div>
          
          {/* Section des statistiques */}
          <div className="dashboard-stats">
            <h3>Statistiques du jour</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalReservations}</div>
                <div className="stat-label">Réservations</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.confirmedReservations}</div>
                <div className="stat-label">Confirmées</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.pendingReservations}</div>
                <div className="stat-label">En attente</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.arrivedCustomers}</div>
                <div className="stat-label">Arrivées</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.cancelledReservations}</div>
                <div className="stat-label">Annulées</div>
              </div>
            </div>
          </div>
          
          {/* Section des raccourcis */}
          <div className="dashboard-shortcuts">
            <h3>Accès rapides</h3>
            <div className="shortcuts-grid">
              <Link to="/floor-plans" className="shortcut-card">
                <div className="shortcut-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="shortcut-label">Plans de salle</div>
              </Link>
              
              {/* Nouveau bouton pour créer un plan de salle */}
              {canCreatePlan && (
                <div 
                  className="shortcut-card create"
                  onClick={() => setShowNewPlanModal(true)}
                >
                  <div className="shortcut-icon create">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <div className="shortcut-label">Créer un plan</div>
                </div>
              )}
              
              <Link to="/reservations" className="shortcut-card">
                <div className="shortcut-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="shortcut-label">Réservations</div>
              </Link>
              
              {(role === 'ADMIN' || role === 'OWNER') && (
                <Link to="/users" className="shortcut-card">
                  <div className="shortcut-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="shortcut-label">Gestion des utilisateurs</div>
                </Link>
              )}
              
              <Link to="/account-settings" className="shortcut-card">
                <div className="shortcut-icon">
                  <i className="fas fa-cog"></i>
                </div>
                <div className="shortcut-label">Paramètres</div>
              </Link>
            </div>

           { /*<DebugPanel />*/}
          </div>
          
          {/* Section des réservations récentes */}
          <div className="dashboard-recent">
            <div className="recent-header">
              <h3>Réservations récentes</h3>
              <Link to="/reservations" className="view-all">
                Voir toutes les réservations
              </Link>
            </div>
            
            {reservations.length === 0 ? (
              <div className="no-reservations">
                <p>Aucune réservation pour cette date.</p>
                <Link to="/reservations/new" className="btn btn-primary">
                  Créer une réservation
                </Link>
              </div>
            ) : (
              <div className="reservations-list">
                <table>
                  <thead>
                    <tr>
                      <th>Heure</th>
                      <th>Client</th>
                      <th>Personnes</th>
                      <th>Statut</th>
                      <th>Tables</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.slice(0, 5).map(reservation => (
                      <tr key={reservation._id}>
                        <td>{formatTime(reservation.startTime)}</td>
                        <td>
                          {reservation.user ? 
                            `${reservation.user.firstname} ${reservation.user.lastname}` : 
                            reservation.customerInfo.name}
                        </td>
                        <td>{reservation.guests}</td>
                        <td>
                          <span className={`status ${reservation.status}`}>
                            {formatStatus(reservation.status)}
                          </span>
                        </td>
                        <td>
                          {Array.isArray(reservation.tables) ? 
                            reservation.tables.map(t => typeof t === 'string' ? t : t.number).join(', ') : 
                            'N/A'}
                        </td>
                        <td>
                          <Link to={`/reservations/${reservation._id}`} className="action-btn view">
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link to={`/reservations/edit/${reservation._id}`} className="action-btn edit">
                            <i className="fas fa-edit"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Section des plans de salle */}
          <div className="dashboard-floor-plans">
            <div className="section-header">
              <h3>Plans de salle disponibles</h3>
              <div>
                {canCreatePlan && (
                  <button 
                    className="btn btn-primary create-plan-btn" 
                    onClick={() => setShowNewPlanModal(true)}
                  >
                    <i className="fas fa-plus"></i> Nouveau plan
                  </button>
                )}
                <Link to="/floor-plans" className="view-all">
                  Gérer les plans
                </Link>
              </div>
            </div>
            
            {floorPlans.length === 0 ? (
              <div className="no-floor-plans">
                <p>Aucun plan de salle disponible.</p>
                {canCreatePlan && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowNewPlanModal(true)}
                  >
                    Créer un plan de salle
                  </button>
                )}
              </div>
            ) : (
              <div className="floor-plans-grid">
                {floorPlans.slice(0, 3).map(plan => (
                  <div key={plan._id} className="floor-plan-card">
                    <h4>{plan.name}</h4>
                    <p>{plan.description || 'Aucune description'}</p>
                    <div className="floor-plan-status">
                      <span className={`status ${plan.status}`}>
                        {plan.status === 'active' ? 'Actif' : 
                         plan.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                      </span>
                    </div>
                    <div className="floor-plan-actions">
                      <Link to={`/floor-plans/view/${plan._id}`} className="btn btn-secondary">
                        Voir
                      </Link>
                      {canCreatePlan && (
                        <Link to={`/floor-plans/edit/${plan._id}`} className="btn btn-primary">
                          Modifier
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Section du profil utilisateur */}
          <div className="dashboard-profile">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {firstname ? firstname.charAt(0) : username ? username.charAt(0) : 'U'}
                </div>
                <div className="profile-info">
                  <h3>{firstname && lastname ? `${firstname} ${lastname}` : username}</h3>
                  <p className="profile-role">{role}</p>
                </div>
              </div>
              <div className="profile-actions">
                <Link to="/account-settings" className="btn btn-secondary">
                  Paramètres du compte
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour créer un nouveau plan */}
      {showNewPlanModal && (
        <NewFloorPlanModal
          onClose={() => setShowNewPlanModal(false)}
          onSave={handleCreatePlan}
        />
      )}
    </div>
  );
};

export default Dashboard;