import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../reducers/authSlice';
import services from '../../services/serviceSwitch';

const AuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const auth = useSelector(state => state.auth.value);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setResponse('Connexion en cours...');
    
    try {
      const result = await services.auth.login(email, password);
      setResponse(JSON.stringify(result, null, 2));
      
      if (result.success) {
        if (result.requires2FA) {
          dispatch(login({ requires2FA: true, tempToken: result.tempToken }));
        } else {
          dispatch(login(result.data));
        }
      }
    } catch (error) {
      setResponse(`Erreur: ${error.message}`);
    }
  };

  const testApi = async () => {
    try {
      setResponse('Test de l\'API en cours...');
      const result = await services.floorPlan.getAllFloorPlans();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(`Erreur API: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test d'authentification</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>État actuel</h3>
        <pre>{JSON.stringify(auth, null, 2)}</pre>
      </div>
      
      <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      
      <button onClick={testApi}>Tester l'API</button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Réponse</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
      </div>
    </div>
  );
};

export default AuthTest;