import React from 'react';
import { useSelector } from 'react-redux';
import services from '../../services/serviceSwitch';

const DebugPanel = () => {
  const auth = useSelector(state => state.auth.value);
  const user = useSelector(state => state.user.value);
  const [result, setResult] = React.useState(null);
  
  const testApi = async (serviceName, methodName) => {
    try {
      setResult(`Appel à ${serviceName}.${methodName}...`);
      console.log('État Redux avant appel:', { auth, user });
      console.log('Token utilisé:', auth.accessToken ? `${auth.accessToken.substring(0, 15)}...` : 'Aucun');
      const response = await services[serviceName][methodName]();
      console.log('Réponse complète:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setResult(`Erreur: ${error.message}`);
    }
  };
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px',
      zIndex: 9999,
      background: '#f5f5f5',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <h4>Débogage</h4>
      <div>
        <button onClick={() => testApi('floorPlan', 'getAllFloorPlans')}>
          Test Plans de Salle
        </button>
        <button onClick={() => testApi('reservation', 'getReservations')}>
          Test Réservations
        </button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <h5>Auth Status</h5>
        <pre style={{ fontSize: '10px' }}>
          {JSON.stringify({
            isAuth: auth.isAuthenticated,
            token: auth.accessToken ? `${auth.accessToken.substring(0, 10)}...` : 'None',
            role: auth.role
          }, null, 2)}
        </pre>
      </div>
      {result && (
        <div style={{ marginTop: '10px' }}>
          <h5>Résultat</h5>
          <pre style={{ fontSize: '10px', maxHeight: '100px', overflow: 'auto' }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;