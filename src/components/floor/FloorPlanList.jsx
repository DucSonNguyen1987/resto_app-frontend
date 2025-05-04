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
  const user = useSelector(state => state.auth.value);
  
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
          setFloorPlans(response.data);
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
  }, []);
  
  // Gérer la création d'un nouveau plan
  const handleCreatePlan = async (newPlanData) => {
    try {
      const response = await services.floorPlan.createFloorPlan(newPlanData);
      
      if (response.success) {
        // Ajouter le nouveau plan à la liste
        setFloorPlans([...floorPlans, response.data]);
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
  
  // Naviguer vers l'éditeur de plan
  const handleEditPlan = (floorPlanId) => {
    navigate(`/floor-plans/edit/${floorPlanId}`);
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
      
      {floorPlans.length === 0 ? (
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
      ) : (
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
                    <strong>Dimensions:</strong> {plan.dimensions.width} x {plan.dimensions.height} {plan.dimensions.unit}
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