// src/features/floor_editor/FloorPlanEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


// Import des actions Redux
import {
  updateFloorPlan,
  updateTable,
  addTable,
  deleteTable,
  setLoading,
  setError,
  setCurrentFloorPlan
} from '../../reducers/floorPlanSlice';

// Import des services
import services from '../../services/serviceSwitch';

// Composants de l'éditeur
import TableShape from './TableShape';
import ObstacleShape from './ObstacleShape';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';

// Importer les styles
import '../../styles/FloorEditor.css';

const FloorPlanEditor = () => {
  const { floorPlanId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stageRef = useRef(null);

  // Obtenir les données du store Redux
  const { floorPlans, tables, loading, error } = useSelector(state => state.floorPlan.value);
  
  // États pour le plan de salle
  const [floorPlan, setFloorPlan] = useState(null);
  const [currentTables, setCurrentTables] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  // État pour l'outil sélectionné et l'élément sélectionné
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState(null);
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Chargement initial des données
// Extrait à ajouter dans le useEffect de chargement des données de FloorPlanEditor.jsx
useEffect(() => {
  let isMounted = true; // Pour éviter les fuites de mémoire
  
  const loadFloorPlan = async () => {
    try {
      if (!floorPlanId) return;
      
      console.log(`[FloorPlanEditor] Début du chargement du plan: ${floorPlanId}`);
      dispatch(setLoading(true));
      setIsLoading(true);
      
      // AMÉLIORATION: Récupérer les données du localStorage si elles existent
      const localStoragePlan = localStorage.getItem('currentFloorPlan');
      const localStorageTables = localStorage.getItem('currentFloorPlanTables');
      
      if (localStoragePlan && localStorageTables) {
        console.log(`[FloorPlanEditor] Plan trouvé dans localStorage`);
        try {
          const parsedPlan = JSON.parse(localStoragePlan);
          const parsedTables = JSON.parse(localStorageTables);
          
          // Vérifier que le plan dans localStorage correspond à celui demandé
          if (parsedPlan._id === floorPlanId) {
            if (isMounted) {
              setFloorPlan(parsedPlan);
              setCurrentTables(parsedTables);
              setObstacles(parsedPlan.obstacles || []);
              
              // Mettre à jour le store Redux
              dispatch(setCurrentFloorPlan(parsedPlan));
              
              // Nettoyer localStorage pour éviter les confusions futures
              localStorage.removeItem('currentFloorPlan');
              localStorage.removeItem('currentFloorPlanTables');
              
              console.log(`[FloorPlanEditor] Données chargées depuis localStorage avec succès`);
              setIsLoading(false);
              dispatch(setLoading(false));
              return; // Sortir de la fonction si chargement réussi
            }
          }
        } catch (e) {
          console.error(`[FloorPlanEditor] Erreur lors de l'analyse des données localStorage:`, e);
          // Continuer avec les autres méthodes de chargement
        }
      }
      
      // Chercher d'abord dans le store Redux
      const existingPlan = floorPlans.find(plan => plan._id === floorPlanId);
      
      if (existingPlan) {
        console.log(`[FloorPlanEditor] Plan trouvé dans le store Redux: ${existingPlan.name}`);
        
        // Trouver les tables associées
        const planTables = tables.filter(table => table.floorPlan === floorPlanId);
        
        if (isMounted) {
          setFloorPlan(existingPlan);
          setCurrentTables(planTables);
          setObstacles(existingPlan.obstacles || []);
          
          // Mettre à jour le plan actuel dans le store
          dispatch(setCurrentFloorPlan(existingPlan));
        }
      } else {
        // Si non trouvé dans le store, charger depuis l'API
        console.log(`[FloorPlanEditor] Plan non trouvé dans le store, chargement depuis l'API...`);
        
        const response = await services.floorPlan.getFloorPlanDetails(floorPlanId);
        
        if (!response.success) {
          throw new Error(response.error || 'Erreur lors du chargement du plan');
        }
        
        const { floorPlan: loadedPlan, tables: loadedTables } = response.data;
        
        if (isMounted) {
          setFloorPlan(loadedPlan);
          setCurrentTables(loadedTables || []);
          setObstacles(loadedPlan.obstacles || []);
          
          // Mettre à jour le store Redux
          dispatch(setCurrentFloorPlan(loadedPlan));
        }
      }
    } catch (error) {
      console.error('[FloorPlanEditor] Erreur lors du chargement du plan:', error);
      
      if (isMounted) {
        setLocalError('Impossible de charger le plan de salle');
        dispatch(setError('Impossible de charger le plan de salle'));
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
    }
  };

  loadFloorPlan();
  
  // Nettoyage lors du démontage du composant
  return () => {
    isMounted = false;
  };
}, [floorPlanId, dispatch, floorPlans, tables]);

  // Gestion de la sélection d'un élément
  const handleElementSelect = (element, type) => {
    setSelectedElement({ ...element, type });
  };

  // Gestion du déplacement d'une table
  const handleTableDrag = (tableId, newPos) => {
    const updatedTables = currentTables.map(table => {
      if (table._id === tableId) {
        return {
          ...table,
          position: newPos
        };
      }
      return table;
    });
    
    setCurrentTables(updatedTables);
    
    const updatedTable = updatedTables.find(table => table._id === tableId);
    if (updatedTable) {
      // Mettre à jour l'élément sélectionné si c'est cette table
      if (selectedElement && selectedElement._id === tableId) {
        setSelectedElement({ ...updatedTable, type: 'table' });
      }
      
      // Dispatch action pour mettre à jour dans le store
      dispatch(updateTable(updatedTable));
    }
  };

  // Gestion du déplacement d'un obstacle
  const handleObstacleDrag = (index, newPos) => {
    const updatedObstacles = [...obstacles];
    updatedObstacles[index] = { ...updatedObstacles[index], position: newPos };
    setObstacles(updatedObstacles);
    
    // Mettre à jour l'élément sélectionné si c'est cet obstacle
    if (selectedElement && selectedElement.type === 'obstacle' && 
        selectedElement.position.x === obstacles[index].position.x && 
        selectedElement.position.y === obstacles[index].position.y) {
      setSelectedElement({ ...updatedObstacles[index], type: 'obstacle' });
    }
  };

  // Sauvegarde des modifications
  const handleSave = async () => {
    try {
      console.log('[FloorPlanEditor] Sauvegarde des modifications...');
      
      if (!floorPlan) {
        throw new Error('Aucun plan à sauvegarder');
      }
      
      setIsLoading(true);
      dispatch(setLoading(true));
      
      // Préparer les données du plan mis à jour
      const updatedFloorPlan = {
        ...floorPlan,
        obstacles,
        updatedAt: new Date().toISOString()
      };
      
      // Dispatch action pour mettre à jour le plan dans le store
      dispatch(updateFloorPlan(updatedFloorPlan));
      
      // Sauvegarde du plan avec les obstacles via le service
      const planResponse = await services.floorPlan.updateFloorPlan(floorPlanId, updatedFloorPlan);
      
      if (!planResponse.success) {
        throw new Error(planResponse.error || 'Erreur lors de la sauvegarde du plan');
      }
      
      console.log('[FloorPlanEditor] Plan sauvegardé avec succès, sauvegarde des tables...');
      
      // Sauvegarde des tables
      const tablePromises = currentTables.map(table => {
        return services.floorPlan.updateTable(table._id, table);
      });
      
      // Attendre que toutes les tables soient sauvegardées
      const tableResults = await Promise.allSettled(tablePromises);
      
      // Vérifier si certaines tables n'ont pas été sauvegardées
      const failedTables = tableResults.filter(result => result.status === 'rejected' || (result.value && !result.value.success));
      
      if (failedTables.length > 0) {
        console.warn('[FloorPlanEditor] Certaines tables n\'ont pas pu être sauvegardées:', failedTables);
      }

      alert('Plan de salle sauvegardé avec succès');
      navigate('/floor-plans');
    } catch (error) {
      console.error('[FloorPlanEditor] Erreur lors de la sauvegarde:', error);
      setLocalError('Erreur lors de la sauvegarde. Veuillez réessayer.');
      dispatch(setError('Erreur lors de la sauvegarde. Veuillez réessayer.'));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  // Ajout d'une nouvelle table
  const handleAddTable = async (tableData) => {
    try {
      console.log('[FloorPlanEditor] Ajout d\'une nouvelle table:', tableData);
      
      if (!floorPlanId) {
        throw new Error('ID du plan de salle manquant');
      }
      
      setIsLoading(true);
      
      // Préparer les données de la table
      const tableToAdd = {
        number: currentTables.length + 1,
        capacity: tableData.capacity || 2,
        shape: tableData.shape || 'circle',
        position: tableData.position || { x: 100, y: 100 },
        dimensions: tableData.dimensions || { width: 60, height: 60 },
        status: 'free',
        floorPlan: floorPlanId
      };
      
      // Générer un ID temporaire
      const tempId = `temp_${Date.now()}`;
      const newTable = { ...tableToAdd, _id: tempId };
      
      // Ajouter la table dans l'état local
      setCurrentTables(prevTables => [...prevTables, newTable]);
      setSelectedElement({ ...newTable, type: 'table' });
      
      // Dispatch action pour ajouter la table dans le store Redux
      dispatch(addTable(newTable));
      
      // Créer la table via le service
      const response = await services.floorPlan.createTable(tableToAdd);
      
      if (response.success) {
        const createdTable = response.data.table || response.data;
        
        // Mettre à jour l'ID de la table avec l'ID réel
        setCurrentTables(prevTables => 
          prevTables.map(table => 
            table._id === tempId ? { ...table, _id: createdTable._id } : table
          )
        );
        
        // Mettre à jour la sélection si nécessaire
        if (selectedElement && selectedElement._id === tempId) {
          setSelectedElement({ ...createdTable, type: 'table' });
        }
        
        // Mettre à jour dans le store Redux
        dispatch(updateTable({ ...newTable, _id: createdTable._id }));
        
        console.log('[FloorPlanEditor] Table créée avec succès:', createdTable);
      } else {
        throw new Error(response.error || 'Erreur lors de la création de la table');
      }
    } catch (error) {
      console.error('[FloorPlanEditor] Erreur lors de l\'ajout de la table:', error);
      setLocalError('Erreur lors de l\'ajout de la table');
      dispatch(setError('Erreur lors de l\'ajout de la table'));
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout d'un nouvel obstacle
  const handleAddObstacle = (obstacleData) => {
    const newObstacle = {
      type: obstacleData.type || 'wall',
      position: obstacleData.position || { x: 100, y: 100 },
      dimensions: obstacleData.dimensions || { width: 100, height: 20 },
      rotation: obstacleData.rotation || 0,
      color: obstacleData.color || '#000000',
      label: obstacleData.label || ''
    };

    // Mettre à jour les obstacles
    setObstacles(prevObstacles => [...prevObstacles, newObstacle]);
    setSelectedElement({ ...newObstacle, type: 'obstacle' });
  };

  // Suppression d'un élément
  const handleDeleteElement = async () => {
    if (!selectedElement) return;

    if (selectedElement.type === 'table') {
      try {
        setIsLoading(true);
        
        const tableId = selectedElement._id;
        console.log('[FloorPlanEditor] Suppression de la table:', tableId);
        
        // Mettre à jour l'état local
        setCurrentTables(prevTables => prevTables.filter(table => table._id !== tableId));
        setSelectedElement(null);
        
        // Dispatch action pour supprimer la table du store
        dispatch(deleteTable(tableId));
        
        // Supprimer la table via le service
        if (!tableId.startsWith('temp_')) {
          const response = await services.floorPlan.deleteTable(tableId);
          
          if (!response.success) {
            console.warn('[FloorPlanEditor] Avertissement: La table a été supprimée localement mais pas sur le serveur');
          }
        }
      } catch (error) {
        console.error('[FloorPlanEditor] Erreur lors de la suppression de la table:', error);
        setLocalError('Erreur lors de la suppression de la table');
        dispatch(setError('Erreur lors de la suppression de la table'));
      } finally {
        setIsLoading(false);
      }
    } else if (selectedElement.type === 'obstacle') {
      // Pour les obstacles (pas besoin d'appel serveur car ils sont stockés dans le plan)
      const index = obstacles.findIndex(obstacle =>
        obstacle.position.x === selectedElement.position.x &&
        obstacle.position.y === selectedElement.position.y);

      if (index !== -1) {
        const updatedObstacles = [...obstacles];
        updatedObstacles.splice(index, 1);
        setObstacles(updatedObstacles);
      }
      
      setSelectedElement(null);
    }
  };

  // Gestion du zoom
  const handleWheel = (e) => {
    e.evt.preventDefault();

    if (!stageRef.current) return;

    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointerPosition.x - mousePointTo.x * newScale,
      y: pointerPosition.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
    
    setScale(newScale);
    setStagePos(newPos);
  };

  // Afficher l'état de chargement
  if (isLoading || loading) {
    return <div className="loading">Chargement du plan de salle...</div>;
  }

  // Afficher les erreurs
  if (localError || error) {
    return (
      <div className="error-message">
        <h3>Erreur</h3>
        <p>{localError || error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/floor-plans')}
        >
          Retour à la liste des plans
        </button>
      </div>
    );
  }

  // Vérifier si le plan existe
  if (!floorPlan) {
    return (
      <div className="error-message">
        <h3>Plan de salle non trouvé</h3>
        <p>Le plan de salle avec l'ID "{floorPlanId}" n'existe pas ou n'a pas pu être chargé.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/floor-plans')}
        >
          Retour à la liste des plans
        </button>
      </div>
    );
  }

  return (
    <div className="floor-plan-editor">
      <div className="editor-header">
        <h2>{floorPlan.name}</h2>
        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={handleSave}
          >
            Sauvegarder
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/floor-plans')}
          >
            Retour
          </button>
        </div>
      </div>
      
      <div className="editor-container">
        <Toolbar 
          selectedTool={selectedTool} 
          onSelectTool={setSelectedTool}
          onAddTable={handleAddTable}
          onAddObstacle={handleAddObstacle}
          onDelete={handleDeleteElement}
          selectedElement={selectedElement}
        />
        
        <div className="canvas-container">
          <Stage
            ref={stageRef}
            width={window.innerWidth * 0.7}
            height={window.innerHeight * 0.7}
            onWheel={handleWheel}
            scaleX={scale}
            scaleY={scale}
            x={stagePos.x}
            y={stagePos.y}
            draggable={selectedTool === 'pan'}
          >
            <Layer>
              {/* Fond du plan de salle */}
              <Rect
                x={0}
                y={0}
                width={floorPlan.dimensions?.width || 800}
                height={floorPlan.dimensions?.height || 600}
                fill="#f5f5f5"
                stroke="#cccccc"
              />
              
              {/* Grille pour faciliter le placement */}
              {Array.from({ length: Math.floor((floorPlan.dimensions?.width || 800) / 50) }).map((_, i) => (
                <Line
                  key={`vline-${i}`}
                  points={[i * 50, 0, i * 50, floorPlan.dimensions?.height || 600]}
                  stroke="#e0e0e0"
                  strokeWidth={1}
                />
              ))}
              
              {Array.from({ length: Math.floor((floorPlan.dimensions?.height || 600) / 50) }).map((_, i) => (
                <Line
                  key={`hline-${i}`}
                  points={[0, i * 50, floorPlan.dimensions?.width || 800, i * 50]}
                  stroke="#e0e0e0"
                  strokeWidth={1}
                />
              ))}
              
              {/* Obstacles */}
              {obstacles.map((obstacle, i) => (
                <ObstacleShape
                  key={`obstacle-${i}`}
                  obstacle={obstacle}
                  isSelected={selectedElement?.type === 'obstacle' && 
                    selectedElement.position.x === obstacle.position.x &&
                    selectedElement.position.y === obstacle.position.y}
                  onSelect={() => handleElementSelect(obstacle, 'obstacle')}
                  onDragEnd={(newPos) => handleObstacleDrag(i, newPos)}
                  draggable={selectedTool === 'select'}
                />
              ))}
              
              {/* Tables */}
              {currentTables.map((table) => (
                <TableShape
                  key={`table-${table._id}`}
                  table={table}
                  isSelected={selectedElement?.type === 'table' && selectedElement._id === table._id}
                  onSelect={() => handleElementSelect(table, 'table')}
                  onDragEnd={(newPos) => handleTableDrag(table._id, newPos)}
                  draggable={selectedTool === 'select'}
                />
              ))}
            </Layer>
          </Stage>
        </div>
        
        <PropertiesPanel 
          selectedElement={selectedElement}
          onElementUpdate={(updatedElement) => {
            if (!updatedElement) return;
            
            if (updatedElement.type === 'table') {
              // Mettre à jour l'état local
              const updatedTables = currentTables.map(table => {
                if (table._id === updatedElement._id) {
                  return { ...table, ...updatedElement };
                }
                return table;
              });
              
              setCurrentTables(updatedTables);
              setSelectedElement(updatedElement);
              
              // Dispatch pour mettre à jour dans le store
              dispatch(updateTable(updatedElement));
            } else if (updatedElement.type === 'obstacle') {
              const index = obstacles.findIndex(obstacle => 
                obstacle.position.x === selectedElement.position.x && 
                obstacle.position.y === selectedElement.position.y);
              
              if (index !== -1) {
                // Mettre à jour l'état local
                const updatedObstacles = [...obstacles];
                updatedObstacles[index] = { 
                  ...updatedObstacles[index], 
                  ...updatedElement,
                  type: updatedElement.type 
                };
                
                setObstacles(updatedObstacles);
                setSelectedElement(updatedElement);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default FloorPlanEditor;