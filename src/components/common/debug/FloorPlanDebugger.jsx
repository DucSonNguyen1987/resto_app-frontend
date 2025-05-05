// src/components/common/debug/FloorPlanDebugger.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import services from '../../../services/serviceSwitch';
import { setFloorPlans, setTables, setLoading, setError } from '../../../reducers/floorPlanSlice';

const FloorPlanDebugger = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLocalLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setLocalError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    debugStep: 'init',
    apiResponse: null,
    forceDataTriggered: false
  });

  // Navigation et dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Récupérer les données du store Redux
  const floorPlanState = useSelector(state => state.floorPlan.value);
  const userState = useSelector(state => state.user.value);
  
  // Charger tous les plans au démarrage
  useEffect(() => {
    const loadPlans = async () => {
      if (initialLoadDone) return;
      
      setLocalLoading(true);
      try {
        const response = await services.floorPlan.getAllFloorPlans();
        if (response.success) {
          setPlans(response.data.floorPlans || []);
        } else {
          setLocalError(response.error || 'Erreur lors du chargement des plans');
        }
      } catch (err) {
        setLocalError(`Erreur: ${err.message}`);
      } finally {
        setLocalLoading(false);
        setInitialLoadDone(true);
      }
    };
    
    loadPlans();
  }, [initialLoadDone]);
  
  // Forcer le rechargement des plans
  const handleRefresh = async () => {
    setLocalLoading(true);
    setDebugInfo({ ...debugInfo, debugStep: 'refreshing' });
    try {
      const response = await services.floorPlan.getAllFloorPlans();
      if (response.success) {
        setPlans(response.data.floorPlans || []);
        setLocalError(null);
        setDebugInfo({ ...debugInfo, apiResponse: response });
      } else {
        setLocalError(response.error || 'Erreur lors du chargement des plans');
      }
    } catch (err) {
      setLocalError(`Erreur: ${err.message}`);
    } finally {
      setLocalLoading(false);
    }
  };
  
  // Tester le chargement direct d'un plan spécifique
  const testLoadSpecificPlan = async (planId) => {
    setLocalLoading(true);
    setDebugInfo({ ...debugInfo, debugStep: 'loadingSpecificPlan' });
    try {
      const response = await services.floorPlan.getFloorPlanDetails(planId);
      setDebugInfo({ ...debugInfo, apiResponse: response });
      
      if (response.success) {
        alert(`Plan ${planId} chargé avec succès! ${response.data.floorPlan?.name || 'Nom non disponible'}`);
      } else {
        alert(`Échec du chargement du plan ${planId}: ${response.error}`);
      }
      return response;
    } catch (err) {
      setLocalError(`Erreur: ${err.message}`);
      alert(`Exception lors du chargement du plan ${planId}: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLocalLoading(false);
    }
  };

  // Forcer l'initialisation des données
  const forceInitialData = () => {
    try {
      // Données mockées pour les plans de salle
      const defaultFloorPlans = [
        {
          _id: 'fp1',
          name: 'Salle Principale',
          restaurantId: 'rest1',
          dimensions: { width: 800, height: 600 },
          capacity: 50,
          obstacles: [
            {
              type: 'wall',
              position: { x: 100, y: 100 },
              dimensions: { width: 200, height: 20 },
              rotation: 0,
              color: '#8d6e63',
            },
            {
              type: 'pillar',
              position: { x: 400, y: 300 },
              dimensions: { width: 30, height: 30 },
              rotation: 0,
              color: '#78909c',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: 'fp2',
          name: 'Terrasse',
          restaurantId: 'rest1',
          dimensions: { width: 500, height: 400 },
          capacity: 30,
          obstacles: [
            {
              type: 'bar',
              position: { x: 250, y: 50 },
              dimensions: { width: 200, height: 60 },
              rotation: 0,
              color: '#5d4037',
              label: 'Bar Extérieur',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Données mockées pour les tables
      const defaultTables = [
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
      
      // Dispatch les actions pour mettre à jour le store Redux
      dispatch(setFloorPlans(defaultFloorPlans));
      dispatch(setTables(defaultTables));
      
      setPlans(defaultFloorPlans);
      setDebugInfo({ 
        ...debugInfo, 
        forceDataTriggered: true,
        debugStep: 'forcedData' 
      });
      
      alert('Données initiales chargées avec succès dans Redux!');
    } catch (error) {
      console.error('Erreur lors du chargement forcé des données:', error);
      setLocalError(`Erreur lors du chargement forcé: ${error.message}`);
    }
  };

  // Exécuter un diagnostic complet
  const runDiagnostic = async () => {
    setLocalLoading(true);
    setDebugInfo({ ...debugInfo, debugStep: 'diagnosticRunning' });
    setLocalError(null);

    try {
      // Étape 1: Vérifier l'authentification
      const isAuthenticated = userState.isAuthenticated;
      if (!isAuthenticated) {
        setLocalError('Vous n\'êtes pas authentifié! Connectez-vous avant de continuer.');
        return;
      }

      // Étape 2: Initialiser le store Redux
      dispatch(setLoading(true));
      const allPlansResponse = await services.floorPlan.getAllFloorPlans();
      
      if (!allPlansResponse.success) {
        setLocalError(`Échec de l'initialisation du store Redux: ${allPlansResponse.error}`);
        return;
      }

      // Étape 3: Tester le chargement d'un plan spécifique
      const planResponse = await testLoadSpecificPlan('fp1');
      
      if (!planResponse.success) {
        setLocalError(`Échec du chargement du plan fp1: ${planResponse.error}`);
        return;
      }

      // Si tout va bien
      setDebugInfo({
        ...debugInfo,
        debugStep: 'diagnosticSuccess',
        apiResponse: planResponse
      });

      alert('Diagnostic terminé avec succès! Vous pouvez maintenant essayer d\'accéder à l\'éditeur.');
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setLocalError(`Erreur lors du diagnostic: ${error.message}`);
    } finally {
      dispatch(setLoading(false));
      setLocalLoading(false);
    }
  };

  // Vérifier l'état du store Redux
  const checkReduxState = () => {
    const { floorPlans, tables, loading, error, currentFloorPlan } = floorPlanState;
    
    // Vérifier si les données sont présentes
    const hasFloorPlans = Array.isArray(floorPlans) && floorPlans.length > 0;
    const hasTables = Array.isArray(tables) && tables.length > 0;
    const hasCurrentPlan = currentFloorPlan !== null;
    
    // Vérifier si des plans spécifiques existent
    const fp1Exists = hasFloorPlans && floorPlans.some(plan => plan._id === 'fp1');
    const fp2Exists = hasFloorPlans && floorPlans.some(plan => plan._id === 'fp2');
    
    // Calculer des statistiques sur les tables
    const tablesForFp1 = hasTables ? tables.filter(table => table.floorPlan === 'fp1').length : 0;
    const tablesForFp2 = hasTables ? tables.filter(table => table.floorPlan === 'fp2').length : 0;
    
    return {
      hasFloorPlans,
      hasTables,
      hasCurrentPlan,
      fp1Exists,
      fp2Exists,
      tablesForFp1,
      tablesForFp2,
      loading,
      error
    };
  };

  // Naviguer vers l'éditeur
  const goToEditor = (planId) => {
    navigate(`/floor-plans/edit/${planId}`);
  };

  // Obtenir l'état actuel de Redux
  const reduxState = checkReduxState();

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
    maxWidth: expanded ? '500px' : '200px',
    maxHeight: expanded ? '80vh' : '50px',
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
            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
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
                  opacity: loading ? 0.7 : 1,
                  fontSize: '12px',
                  flex: 1
                }}
              >
                {loading ? 'Chargement...' : 'Rafraîchir les plans'}
              </button>
              
              <button 
                onClick={() => testLoadSpecificPlan('fp1')}
                disabled={loading}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '12px',
                  flex: 1
                }}
              >
                Tester Plan fp1
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={runDiagnostic}
                disabled={loading}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '12px',
                  flex: 1
                }}
              >
                Diagnostic complet
              </button>
              
              <button 
                onClick={forceInitialData}
                disabled={loading}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '12px',
                  flex: 1
                }}
              >
                Forcer données initiales
              </button>
            </div>
          </div>
          
          {loading && (
            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#777', textAlign: 'center' }}>
              {debugInfo.debugStep === 'init' ? 'Initialisation...' : 
               debugInfo.debugStep === 'refreshing' ? 'Rafraîchissement des plans...' :
               debugInfo.debugStep === 'diagnosticRunning' ? 'Diagnostic en cours...' :
               debugInfo.debugStep === 'loadingSpecificPlan' ? 'Chargement du plan spécifique...' :
               'Chargement en cours...'}
            </div>
          )}
          
          {error && (
            <div style={{ color: 'red', marginBottom: '10px', fontSize: '12px', padding: '5px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '15px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h5 style={{ margin: '0 0 5px 0', fontSize: '13px' }}>État d'Authentification</h5>
            <div style={{ fontSize: '12px' }}>
              <p style={{ margin: '2px 0' }}>Utilisateur: {userState.username || 'Non connecté'}</p>
              <p style={{ margin: '2px 0' }}>Authentifié: {userState.isAuthenticated ? '✅' : '❌'}</p>
              <p style={{ margin: '2px 0' }}>Rôle: {userState.role || 'Non défini'}</p>
            </div>
            
            {!userState.isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '5px'
                }}
              >
                Se connecter
              </button>
            )}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <h5 style={{ margin: '5px 0', fontSize: '13px' }}>État Redux (store):</h5>
            <div style={{ fontSize: '12px', marginBottom: '10px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <p style={{ margin: '2px 0' }}>Plans chargés: {reduxState.hasFloorPlans ? '✅' : '❌'} ({floorPlanState.floorPlans.length})</p>
              <p style={{ margin: '2px 0' }}>Tables chargées: {reduxState.hasTables ? '✅' : '❌'} ({floorPlanState.tables.length})</p>
              <p style={{ margin: '2px 0' }}>Plan courant: {reduxState.hasCurrentPlan ? '✅' : '❌'}</p>
              <p style={{ margin: '2px 0' }}>Plan fp1 existe: {reduxState.fp1Exists ? '✅' : '❌'}</p>
              <p style={{ margin: '2px 0' }}>Tables pour fp1: {reduxState.tablesForFp1}</p>
              <p style={{ margin: '2px 0' }}>En chargement: {floorPlanState.loading ? '⏳' : '✅'}</p>
              <p style={{ margin: '2px 0' }}>Erreur: {floorPlanState.error ? `❌ ${floorPlanState.error}` : '✅ Aucune'}</p>
            </div>
            
            <h5 style={{ margin: '10px 0 5px', fontSize: '13px' }}>Plans dans Redux:</h5>
            {floorPlanState.floorPlans.length === 0 ? (
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>Aucun plan dans le store</p>
            ) : (
              <ul style={{ fontSize: '12px', padding: '0 0 0 20px', margin: 0 }}>
                {floorPlanState.floorPlans.map(plan => (
                  <li key={plan._id} style={{ marginBottom: '5px' }}>
                    <strong>{plan.name}</strong> (ID: {plan._id})
                    <button
                      onClick={() => goToEditor(plan._id)}
                      style={{
                        marginLeft: '5px',
                        padding: '2px 5px',
                        fontSize: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Éditer
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            <h5 style={{ margin: '10px 0 5px', fontSize: '13px' }}>Tables dans Redux:</h5>
            {floorPlanState.tables.length === 0 ? (
              <p style={{ fontSize: '12px', fontStyle: 'italic' }}>Aucune table dans le store</p>
            ) : (
              <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '12px', padding: '5px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <p>Nombre total: {floorPlanState.tables.length}</p>
                <ul style={{ padding: '0 0 0 20px', margin: 0 }}>
                  {floorPlanState.tables.slice(0, 5).map(table => (
                    <li key={table._id}>
                      Table #{table.number} (Plan: {table.floorPlan})
                    </li>
                  ))}
                  {floorPlanState.tables.length > 5 && <li>... et {floorPlanState.tables.length - 5} autres</li>}
                </ul>
              </div>
            )}
          </div>
          
          {debugInfo.apiResponse && (
            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ margin: '5px 0', fontSize: '13px' }}>Détails de la dernière réponse API:</h5>
              <details>
                <summary style={{ fontSize: '12px', cursor: 'pointer' }}>Afficher le détail</summary>
                <pre style={{ fontSize: '10px', backgroundColor: '#f5f5f5', padding: '5px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(debugInfo.apiResponse, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          {debugInfo.forceDataTriggered && (
            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px', fontSize: '12px' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>✅ Données forcées chargées dans Redux</p>
              <p style={{ margin: '0' }}>Vous pouvez maintenant essayer d'accéder à l'éditeur:</p>
              <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                <button
                  onClick={() => goToEditor('fp1')}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Éditer Plan FP1
                </button>
                <button
                  onClick={() => goToEditor('fp2')}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Éditer Plan FP2
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FloorPlanDebugger;