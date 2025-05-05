// src/features/floor_plans/FloorPlansList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import services from '../../services/serviceSwitch';

const FloorPlansList = () => {
  const navigate = useNavigate();
  
  // Récupérer les données de floorPlan depuis le store Redux
  const { floorPlans, loading, error } = useSelector(state => state.floorPlan.value);
  
  // État local pour gérer l'affichage
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [localFloorPlans, setLocalFloorPlans] = useState([]);
  
  // Charger les plans de salle au chargement du composant
  useEffect(() => {
    const loadFloorPlans = async () => {
      try {
        setLocalLoading(true);
        const response = await services.floorPlan.getAllFloorPlans();
        
        if (response.success) {
          setLocalFloorPlans(response.data.floorPlans);
        } else {
          setLocalError(response.error || 'Erreur lors du chargement des plans de salle');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error);
        setLocalError('Impossible de charger les plans de salle');
      } finally {
        setLocalLoading(false);
      }
    };
    
    loadFloorPlans();
  }, []);
  
  // Fonction pour gérer la suppression d'un plan
  const handleDeleteFloorPlan = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan de salle ?')) {
      try {
        const response = await services.floorPlan.deleteFloorPlan(id);
        
        if (response.success) {
          // Mettre à jour la liste locale après suppression
          setLocalFloorPlans(localFloorPlans.filter(plan => plan._id !== id));
        } else {
          setLocalError(response.error || 'Erreur lors de la suppression du plan');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du plan:', error);
        setLocalError('Erreur lors de la suppression du plan');
      }
    }
  };
  
  // Fonction pour créer un nouveau plan de salle
  const handleCreateFloorPlan = () => {
    navigate('/create-floor-plan');
  };
  
  // Afficher l'état de chargement
  if (localLoading || loading) {
    return <div className="loading">Chargement des plans de salle...</div>;
  }
  
  // Afficher les erreurs
  if (localError || error) {
    return (
      <div className="error-container">
        <div className="error-message">{localError || error}</div>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="floor-plans-list-container">
      <div className="header">
        <h1>Plans de salle</h1>
        <button 
          className="btn btn-primary"
          onClick={handleCreateFloorPlan}
        >
          Nouveau plan
        </button>
      </div>
      
      {localFloorPlans.length === 0 ? (
        <div className="empty-state">
          <p>Aucun plan de salle disponible</p>
          <button 
            className="btn btn-primary"
            onClick={handleCreateFloorPlan}
          >
            Créer votre premier plan
          </button>
        </div>
      ) : (
        <div className="floor-plans-grid">
          {localFloorPlans.map((plan) => (
            <div key={plan._id} className="floor-plan-card">
              <div className="card-header">
                <h3>{plan.name}</h3>
                <span className="capacity">Capacité: {plan.capacity} places</span>
              </div>
              
              <div className="card-body">
                <div className="dimensions">
                  Dimensions: {plan.dimensions.width} x {plan.dimensions.height}
                </div>
                <div className="info">
                  {plan.obstacles?.length || 0} obstacles
                </div>
                <div className="info">
                  Dernière modification: {new Date(plan.updatedAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/floor-plans/edit/${plan._id}`)}
                >
                  Modifier
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/floor-plans/view/${plan._id}`)}
                >
                  Voir
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteFloorPlan(plan._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorPlansList;