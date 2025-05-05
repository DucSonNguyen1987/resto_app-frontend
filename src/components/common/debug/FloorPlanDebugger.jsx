// src/components/common/debug/FloorPlanDebugger.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import services from '../../../services/serviceSwitch';

const FloorPlanDebugger = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Récupérer les plans du store Redux
  const floorPlanState = useSelector(state => state.floorPlan.value);
  
  // Charger tous les plans au démarrage
  useEffect(() => {
    const loadPlans = async () => {
      if (initialLoadDone) return;
      
      setLoading(true);
      try {
        const response = await services.floorPlan.getAllFloorPlans();
        if (response.success) {
          setPlans(response.data.floorPlans || []);
        } else {
          setError(response.error || 'Erreur lors du chargement des plans');
        }
      } catch (err) {
        setError(`Erreur: ${err.message}`);
      } finally {
        setLoading(false);
        setInitialLoadDone(true);
      }
    };
    
    loadPlans();
  }, [initialLoadDone]);
  
  // Forcer le rechargement des plans
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await services.floorPlan.getAllFloorPlans();
      if (response.success) {
        setPlans(response.data.floorPlans || []);
        setError(null);
      } else {
        setError(response.error || 'Erreur lors du chargement des plans');
      }
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Style pour le debugger
  const containerStyle = {
    position: 'fixed',
    bottom: expanded ? '10px' : '70px',
    left: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 9999,
    maxWidth: expanded ? '400px' : '200px',
    maxHeight: expanded ? '500px' : '50px',
    overflow: 'auto',
    transition: 'all 0.3s ease'
  };
  
  // Si le debugger est masqué, afficher uniquement un petit bouton
  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          zIndex: 9999,
          padding: '5px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🧩 Plans
      </button>
    );
  }
  
  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '14px' }}>Debug Plans de Salle</h4>
        <div>
          <button 
            onClick={() => setExpanded(!expanded)} 
            style={{ marginRight: '5px', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            {expanded ? '▼' : '▲'}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            style={{ cursor: 'pointer', background: 'none', border: 'none' }}
          >
            ✕
          </button>
        </div>
      </div>
      
      {expanded && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              style={{
                padding: '5px 10px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Chargement...' : 'Rafraîchir les plans'}
            </button>
          </div>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '10px', fontSize: '12px' }}>
              {error}
            </div>
          )}
          
          <div>
            <h5 style={{ margin: '5px 0', fontSize: '13px' }}>État Redux (store):</h5>
            <div style={{ fontSize: '12px', marginBottom: '10px' }}>
              <p style={{ margin: '2px 0' }}>Plans chargés: {floorPlanState.floorPlans.length}</p>
              <p style={{ margin: '2px 0' }}>Tables chargées: {floorPlanState.tables.length}</p>
              <p style={{ margin: '2px 0' }}>En chargement: {floorPlanState.loading ? 'Oui' : 'Non'}</p>
              <p style={{ margin: '2px 0' }}>Erreur: {floorPlanState.error || 'Aucune'}</p>
            </div>
            
            <h5 style={{ margin: '10px 0 5px', fontSize: '13px' }}>Plans disponibles:</h5>
            {plans.length === 0 ? (
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>
                {loading ? 'Chargement...' : 'Aucun plan trouvé'}
              </p>
            ) : (
              <ul style={{ fontSize: '12px', padding: '0 0 0 20px', margin: 0 }}>
                {plans.map(plan => (
                  <li key={plan._id} style={{ marginBottom: '5px' }}>
                    <strong>{plan.name}</strong> (ID: {plan._id})
                  </li>
                ))}
              </ul>
            )}
            
            <h5 style={{ margin: '10px 0 5px', fontSize: '13px' }}>Plans dans Redux:</h5>
            {floorPlanState.floorPlans.length === 0 ? (
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>Aucun plan dans le store</p>
            ) : (
              <ul style={{ fontSize: '12px', padding: '0 0 0 20px', margin: 0 }}>
                {floorPlanState.floorPlans.map(plan => (
                  <li key={plan._id} style={{ marginBottom: '5px' }}>
                    <strong>{plan.name}</strong> (ID: {plan._id})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FloorPlanDebugger;