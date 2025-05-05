// src/components/floor/FloorPlanList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import services from '../../services/serviceSwitch';
import { 
  selectFloorPlansWithTableCount, 
  selectAllTables,
  selectTablesByFloorPlanId,
  selectLoading, 
  selectError,
  setFloorPlans,
  setTables,
  setLoading,
  setError
} from '../../reducers/floorPlanSlice';

import '../../styles/FloorPlanList.css';

// Composant pour la création d'un nouveau plan
import NewFloorPlanModal from './NewFloorPlanModal';

// Composant pour afficher une miniature du plan avec les tables
const FloorPlanPreview = ({ plan, tables }) => {
  // Calculer le facteur d'échelle pour la prévisualisation
  const scaleFactor = Math.min(200 / plan.dimensions.width, 150 / plan.dimensions.height);
  
  // Rendu d'une table selon sa forme
  const renderTable = (table) => {
    // Déterminer la couleur en fonction du statut
    const colorMap = {
      'free': '#8bc34a',      // Vert pour table libre
      'reserved': '#ffb74d',  // Orange pour table réservée
      'occupied': '#ef5350'   // Rouge pour table occupée
    };
    
    const color = colorMap[table.status] || '#8bc34a';
    
    return (
      <Group
        key={table._id}
        x={table.position.x * scaleFactor}
        y={table.position.y * scaleFactor}
      >
        <Rect
          width={table.dimensions.width * scaleFactor}
          height={(table.dimensions.height || table.dimensions.width) * scaleFactor}
          fill={color}
          opacity={0.8}
          cornerRadius={table.shape === 'circle' ? table.dimensions.width * scaleFactor / 2 : 0}
        />
        <Text
          text={table.number.toString()}
          fontSize={8 * scaleFactor}
          fill="#fff"
          width={table.dimensions.width * scaleFactor}
          height={(table.dimensions.height || table.dimensions.width) * scaleFactor}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  };
  
  return (
    <Stage
      width={plan.dimensions.width * scaleFactor}
      height={plan.dimensions.height * scaleFactor}
      style={{ border: '1px solid #ccc', background: '#f5f5f5' }}
    >
      <Layer>
        {/* Fond du plan */}
        <Rect
          width={plan.dimensions.width * scaleFactor}
          height={plan.dimensions.height * scaleFactor}
          fill="#f9f9f9"
        />
        
        {/* Obstacles (murs, piliers, etc.) */}
        {plan.obstacles && plan.obstacles.map((obstacle, index) => (
          <Rect
            key={`obs-${index}`}
            x={obstacle.position.x * scaleFactor}
            y={obstacle.position.y * scaleFactor}
            width={obstacle.dimensions.width * scaleFactor}
            height={obstacle.dimensions.height * scaleFactor}
            fill={obstacle.color || '#8d6e63'}
            rotation={obstacle.rotation || 0}
          />
        ))}
        
        {/* Tables */}
        {tables.map(table => renderTable(table))}
      </Layer>
    </Stage>
  );
};

const FloorPlanList = () => {
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [tablesByPlan, setTablesByPlan] = useState({});
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Utiliser les sélecteurs pour obtenir les données du store
  const floorPlansWithCount = useSelector(selectFloorPlansWithTableCount);
  const allTables = useSelector(selectAllTables);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const user = useSelector(state => state.user.value);
  
  // Vérifier si l'utilisateur a les permissions pour créer/éditer des plans
  const canCreatePlan = ['ADMIN', 'OWNER', 'MANAGER'].includes(user.role);
  
  // Charger les plans de salle et leurs tables associées
  useEffect(() => {
    const loadFloorPlanData = async () => {
      try {
        console.log('[FloorPlanList] Début du chargement des plans de salle');
        dispatch(setLoading(true));
        
        // Charger les plans
        const plansResponse = await services.floorPlan.getAllFloorPlans();
        
        if (!plansResponse.success) {
          throw new Error(plansResponse.error || 'Erreur lors du chargement des plans de salle');
        }
        
        // Extraire les plans
        const plans = plansResponse.data.floorPlans || plansResponse.data;
        const floorPlans = Array.isArray(plans) ? plans : [];
        
        // Mettre à jour Redux avec les plans
        dispatch(setFloorPlans(floorPlans));
        
        // Charger les tables pour chaque plan
        const tablesMap = {};
        let allTablesData = [];
        
        for (const plan of floorPlans) {
          try {
            // Obtenir les détails du plan avec ses tables
            const detailsResponse = await services.floorPlan.getFloorPlanDetails(plan._id);
            
            if (detailsResponse.success && detailsResponse.data.tables) {
              tablesMap[plan._id] = detailsResponse.data.tables;
              allTablesData = [...allTablesData, ...detailsResponse.data.tables];
            }
          } catch (error) {
            console.error(`[FloorPlanList] Erreur lors du chargement des tables pour le plan ${plan._id}:`, error);
          }
        }
        
        // Mettre à jour Redux avec toutes les tables
        dispatch(setTables(allTablesData));
        
        // Mettre à jour l'état local avec les tables par plan
        setTablesByPlan(tablesMap);
        
        console.log('[FloorPlanList] Plans chargés:', floorPlans);
        console.log('[FloorPlanList] Tables chargées:', allTablesData);
        
      } catch (error) {
        console.error('[FloorPlanList] Erreur lors du chargement des données:', error);
        dispatch(setError('Impossible de charger les plans de salle et leurs tables'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadFloorPlanData();
  }, [dispatch]);
  
  // Gérer la création d'un nouveau plan
  const handleCreatePlan = async (newPlanData) => {
    try {
      dispatch(setLoading(true));
      const response = await services.floorPlan.createFloorPlan(newPlanData);
      
      if (response.success) {
        // Recharger les données après création
        const plansResponse = await services.floorPlan.getAllFloorPlans();
        if (plansResponse.success) {
          const plans = plansResponse.data.floorPlans || plansResponse.data;
          dispatch(setFloorPlans(Array.isArray(plans) ? plans : []));
        }
        
        setShowNewPlanModal(false);
      } else {
        dispatch(setError(response.error || 'Erreur lors de la création du plan de salle'));
      }
    } catch (error) {
      console.error('[FloorPlanList] Erreur lors de la création du plan:', error);
      dispatch(setError('Impossible de créer le plan de salle'));
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Gérer la suppression d'un plan
  const handleDeletePlan = async (floorPlanId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan de salle ?')) {
      try {
        dispatch(setLoading(true));
        const response = await services.floorPlan.deleteFloorPlan(floorPlanId);
        
        if (response.success) {
          // Recharger les plans après suppression
          const plansResponse = await services.floorPlan.getAllFloorPlans();
          if (plansResponse.success) {
            const plans = plansResponse.data.floorPlans || plansResponse.data;
            dispatch(setFloorPlans(Array.isArray(plans) ? plans : []));
            
            // Supprimer les tables associées de l'état local
            const newTablesMap = {...tablesByPlan};
            delete newTablesMap[floorPlanId];
            setTablesByPlan(newTablesMap);
          }
        } else {
          dispatch(setError(response.error || 'Erreur lors de la suppression du plan de salle'));
        }
      } catch (error) {
        console.error('[FloorPlanList] Erreur lors de la suppression du plan:', error);
        dispatch(setError('Impossible de supprimer le plan de salle'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  
  // Naviguer vers l'éditeur de plan
  const handleEditPlan = async (floorPlanId) => {
    try {
      console.log(`[FloorPlanList] Préparation de l'édition du plan: ${floorPlanId}`);
      dispatch(setLoading(true));
      
      // Forcer le chargement des détails du plan avant de rediriger
      const response = await services.floorPlan.getFloorPlanDetails(floorPlanId);
      
      if (!response.success) {
        console.error(`[FloorPlanList] Erreur lors du chargement du plan ${floorPlanId}:`, response.error);
        dispatch(setError(response.error || 'Erreur lors du chargement des détails du plan'));
        return;
      }
      
      console.log(`[FloorPlanList] Plan ${floorPlanId} chargé avec succès:`, response.data);
      
      // Vérifier que les données nécessaires sont présentes
      if (!response.data.floorPlan) {
        console.error(`[FloorPlanList] Les données du plan ${floorPlanId} sont incomplètes ou invalides`);
        dispatch(setError('Données du plan incomplètes'));
        return;
      }
      
      // Stocker temporairement les données dans le localStorage pour assurer leur disponibilité
      localStorage.setItem('currentFloorPlan', JSON.stringify(response.data.floorPlan));
      localStorage.setItem('currentFloorPlanTables', JSON.stringify(response.data.tables || []));
      
      // Rediriger vers l'éditeur
      navigate(`/floor-plans/edit/${floorPlanId}`);
    } catch (error) {
      console.error(`[FloorPlanList] Exception lors du préchargement du plan ${floorPlanId}:`, error);
      dispatch(setError('Impossible de charger les détails du plan pour l\'édition'));
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Naviguer vers la visualisation du plan
  const handleViewPlan = (floorPlanId) => {
    navigate(`/floor-plans/view/${floorPlanId}`);
  };
  
  // Obtenir les tables pour un plan spécifique
  const getTablesForPlan = (planId) => {
    return tablesByPlan[planId] || [];
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
      
      {Array.isArray(floorPlansWithCount) && floorPlansWithCount.length > 0 ? (
        <div className="floor-plans-grid">
          {floorPlansWithCount.map(plan => (
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
              
              {/* Aperçu visuel du plan avec les tables */}
              <div className="preview-container">
                <FloorPlanPreview 
                  plan={plan} 
                  tables={getTablesForPlan(plan._id)} 
                />
              </div>
              
              <div className="card-body">
                <p className="description">{plan.description || 'Aucune description'}</p>
                
                <div className="plan-info">
                  <div className="info-item">
                    <strong>Dimensions:</strong> {plan.dimensions?.width || 0} x {plan.dimensions?.height || 0} {plan.dimensions?.unit || 'px'}
                  </div>
                  
                  <div className="info-item">
                    <strong>Tables:</strong> {plan.tableCount || 0}
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