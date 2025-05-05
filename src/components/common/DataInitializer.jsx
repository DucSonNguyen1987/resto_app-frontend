// src/components/common/DataInitializer.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import services from '../../services/serviceSwitch';

const DataInitializer = ({ children }) => {
  const [isLoading, setIsLoadingState] = useState(true);
  const [errorState, setErrorState] = useState(null);
  
  // Vérifier si les données sont déjà chargées
  const floorPlanState = useSelector(state => state.floorPlan.value);
  const isAuthenticated = useSelector(state => state.user.value.isAuthenticated);
  
  useEffect(() => {
    // Ne charger les données que si l'utilisateur est authentifié
    if (!isAuthenticated) {
      setIsLoadingState(false);
      return;
    }
    
    // Ne charger les données que si elles ne sont pas déjà présentes
    if (floorPlanState.floorPlans.length > 0) {
      setIsLoadingState(false);
      return;
    }
    
    const initializeData = async () => {
      try {
        console.log("DataInitializer: Chargement initial des plans de salle...");
        
        // Charger tous les plans de salle
        const floorPlansResponse = await services.floorPlan.getAllFloorPlans();
        
        if (floorPlansResponse.success) {
          console.log("DataInitializer: Plans de salle chargés avec succès !");
          
          // Nous n'utilisons pas de dispatch ici, nous laissons le service se charger de mettre à jour Redux
          // Les services getAllFloorPlans et getFloorPlanDetails devraient déjà mettre à jour le store Redux
          
          // Charger les détails de chaque plan pour s'assurer que les tables sont également chargées
          for (const plan of floorPlansResponse.data.floorPlans || []) {
            await services.floorPlan.getFloorPlanDetails(plan._id);
          }
          
          console.log("DataInitializer: Toutes les données chargées avec succès !");
        } else {
          console.error("DataInitializer: Erreur lors du chargement des plans:", floorPlansResponse.error);
          setErrorState(floorPlansResponse.error || "Erreur lors du chargement des données");
        }
      } catch (err) {
        console.error("DataInitializer: Exception lors du chargement des données:", err);
        setErrorState(`Erreur: ${err.message}`);
      } finally {
        setIsLoadingState(false);
      }
    };
    
    initializeData();
  }, [isAuthenticated, floorPlanState.floorPlans.length]);
  
  // Si une erreur s'est produite, afficher un message (invisible en production)
  if (errorState && import.meta.env.MODE !== 'production') {
    return (
      <div style={{ padding: '10px', background: '#fff3f3', border: '1px solid #ffcfcf', borderRadius: '4px', margin: '10px' }}>
        <h3>Erreur de chargement des données initiales</h3>
        <p>{errorState}</p>
        <p>Cette erreur n'est visible qu'en mode développement.</p>
        {children}
      </div>
    );
  }
  
  // Si les données sont en cours de chargement, afficher un indicateur de chargement
  // uniquement si aucune donnée n'est présente
  if (isLoading && floorPlanState.floorPlans.length === 0) {
    return (
      <>
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 9999
        }}>
          Chargement des données initiales...
        </div>
        {children}
      </>
    );
  }
  
  // Simplement rendre les enfants une fois les données chargées
  return children;
};

export default DataInitializer;