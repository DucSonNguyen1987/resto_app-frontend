// src/components/floor/FloorPlanList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import services from '../../services/serviceSwitch';

// Composant pour la création d'un nouveau plan
import NewFloorPlanModal from './NewFloorPlanModal';

const FloorPlanList = () => {
  const [floorPlans, setFloorPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  
  const navigate = useNavigate();
  const user = useSelector(state => state.user.value);
  
  // Vérifier si l'utilisateur a les permissions pour créer/éditer des plans
  const canCreatePlan = ['ADMIN', 'OWNER', 'MANAGER'].includes(user.role);
  
  // Charger les plans de salle
  useEffect(() => {
    const loadFloorPlans = async () => {
      try {
        console.log('Début du chargement des plans de salle');
        setIsLoading(true);
        const response = await services.floorPlan.getAllFloorPlans();
        
        // Vérifier l'état de l'authentification avant l'appel
        console.log('Permissions utilisateur:', user.role);

        if (response.success) {
          // Gérer à la fois les structures de réponse possibles
          const plans = response.data.floorPlans || response.data;
          setFloorPlans(Array.isArray(plans) ? plans : []);
          console.log('Plans chargés:', plans);
        } else {
          console.error('Erreur de réponse:', response.error);
          setError(response.error || 'Erreur lors du chargement des plans de salle');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error);
        console.error('Détails de l\'erreur:', error.response?.data || error.message);
        setError('Impossible de charger les plans de salle');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFloorPlans();
  }, [user.role]);
  
  // Gérer la création d'un nouveau plan
  const handleCreatePlan = async (newPlanData) => {
    try {
      const response = await services.floorPlan.createFloorPlan(newPlanData);
      
      if (response.success) {
        // Ajouter le nouveau plan à la liste
        setFloorPlans(prevPlans => [...prevPlans, response.data]);
        setShowNewPlanModal(false);
      } else {
        setError(response.error || 'Erreur lors de la création du plan de salle');
      }
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      setError('Impossible de créer le plan de salle');
    }
  };
  
  // Gérer la suppression d'un plan
  const handleDeletePlan = async (floorPlanId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan de salle ?')) {
      try {
        const response = await services.floorPlan.deleteFloorPlan(floorPlanId);
        
        if (response.success) {
          // Retirer le plan supprimé de la liste
          setFloorPlans(floorPlans.filter(plan => plan._id !== floorPlanId));
        } else {
          setError(response.error || 'Erreur lors de la suppression du plan de salle');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du plan:', error);
        setError('Impossible de supprimer le plan de salle');
      }
    }
  };
  
  const handleEditPlan = async (floorPlanId) => {
    try {
      console.log(`[FloorPlanList] Préparation de l'édition du plan: ${floorPlanId}`);
      setIsLoading(true);
      
      // Forcer le chargement des détails du plan avant de rediriger
      const response = await services.floorPlan.getFloorPlanDetails(floorPlanId);
      
      if (!response.success) {
        console.error(`[FloorPlanList] Erreur lors du chargement du plan ${floorPlanId}:`, response.error);
        setError(response.error || 'Erreur lors du chargement des détails du plan');
        setIsLoading(false);
        return;
      }
      
      console.log(`[FloorPlanList] Plan ${floorPlanId} chargé avec succès:`, response.data);
      
      // Vérifier que les données nécessaires sont présentes
      if (!response.data.floorPlan) {
        console.error(`[FloorPlanList] Les données du plan ${floorPlanId} sont incomplètes ou invalides`);
        setError('Données du plan incomplètes');
        setIsLoading(false);
        return;
      }
      
      // Stocker temporairement les données dans le localStorage pour assurer leur disponibilité
      // même en cas de problème avec Redux
      localStorage.setItem('currentFloorPlan', JSON.stringify(response.data.floorPlan));
      localStorage.setItem('currentFloorPlanTables', JSON.stringify(response.data.tables || []));
      
      // Ajouter un petit délai pour s'assurer que Redux a le temps de traiter les données
      setTimeout(() => {
        // Maintenant que les détails sont chargés, naviguer vers l'éditeur
        console.log(`[FloorPlanList] Redirection vers l'éditeur pour le plan: ${floorPlanId}`);
        setIsLoading(false);
        navigate(`/floor-plans/edit/${floorPlanId}`);
      }, 300);
    } catch (error) {
      console.error(`[FloorPlanList] Exception lors du préchargement du plan ${floorPlanId}:`, error);
      setError('Impossible de charger les détails du plan pour l\'édition');
      setIsLoading(false);
    }
  };
  
  // Naviguer vers la visualisation du plan
  const handleViewPlan = (floorPlanId) => {
    navigate(`/floor-plans/view/${floorPlanId}`);
  };
  
  // Afficher un état de chargement
  if (isLoading) {
    return <div className="loading">Chargement des plans de salle...</div>;
  }
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="floor-plan-list-container">
      <div className="header">
        <h2>Plans de salle</h2>
        {canCreatePlan && (
          <button
            className="btn btn-primary"
            onClick={() => setShowNewPlanModal(true)}
          >
            <i className="fas fa-plus"></i> Nouveau plan
          </button>
        )}
      </div>
      
      {/* Vérification améliorée avant d'utiliser .map() */}
      {Array.isArray(floorPlans) && floorPlans.length > 0 ? (
        <div className="floor-plans-grid">
          {floorPlans.map(plan => (
            <div
              key={plan._id}
              className={`floor-plan-card ${plan.status === 'active' ? 'active' : ''}`}
            >
              <div className="card-header">
                <h3>{plan.name}</h3>
                <span className={`status-badge ${plan.status}`}>
                  {plan.status === 'active' ? 'Actif' : 
                   plan.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                </span>
              </div>
              
              <div className="card-body">
                <p className="description">{plan.description || 'Aucune description'}</p>
                
                <div className="plan-info">
                  <div className="info-item">
                    <strong>Dimensions:</strong> {plan.dimensions?.width || 0} x {plan.dimensions?.height || 0} {plan.dimensions?.unit || 'px'}
                  </div>
                  
                  <div className="info-item">
                    <strong>Tables:</strong> {plan.tables || 0}
                  </div>
                  
                  <div className="info-item">
                    <strong>Créé par:</strong> {plan.createdBy?.username || 'Inconnu'}
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleViewPlan(plan._id)}
                >
                  <i className="fas fa-eye"></i> Voir
                </button>
                
                {canCreatePlan && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditPlan(plan._id)}
                  >
                    <i className="fas fa-edit"></i> Modifier
                  </button>
                )}
                
                {user.role === 'ADMIN' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeletePlan(plan._id)}
                  >
                    <i className="fas fa-trash"></i> Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucun plan de salle disponible</p>
          {canCreatePlan && (
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowNewPlanModal(true)}
            >
              Créer votre premier plan de salle
            </button>
          )}
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

export default FloorPlanList;