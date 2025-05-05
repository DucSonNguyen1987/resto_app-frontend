// src/features/floor_editor/FloorPlanEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import services from '../../services/serviceSwitch';

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

// Composants de l'éditeur
import TableShape from './TableShape';
import ObstacleShape from './ObstacleShape';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';

// Importer les styles
import '../../styles/FloorEditor.css';

const FloorPlanEditor = () => {
    const { floorPlanId } = useParams();
    console.log('[FloorPlanEditor] Rendu avec floorPlanId:', floorPlanId);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stageRef = useRef(null);

    // Obtenez les données du store Redux
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
    useEffect(() => {
        const loadFloorPlan = async () => {
            try {
                setIsLoading(true);
                dispatch(setLoading(true));
                
                console.log(`[FloorPlanEditor] Tentative de chargement du plan ${floorPlanId}`);
                
                // ⚠️ NOUVEAU: Vérifier si le store Redux est vide
                if (floorPlans.length === 0) {
                    console.log("[FloorPlanEditor] Le store Redux est vide, chargement initial des plans...");
                    const allPlansResponse = await services.floorPlan.getAllFloorPlans();
                    
                    if (!allPlansResponse.success) {
                        const errorMsg = "Erreur lors du chargement initial des plans de salle";
                        console.error(`[FloorPlanEditor] ${errorMsg}:`, allPlansResponse.error);
                        setLocalError(errorMsg);
                        dispatch(setError(errorMsg));
                        setIsLoading(false);
                        dispatch(setLoading(false));
                        return;
                    }
                    
                    console.log(`[FloorPlanEditor] ${allPlansResponse.data.floorPlans?.length || 0} plans chargés avec succès`);
                }
                
                // Trouver le plan dans le store Redux
                const foundFloorPlan = floorPlans.find(plan => plan._id === floorPlanId);
                
                if (foundFloorPlan) {
                    console.log(`[FloorPlanEditor] Plan trouvé dans le store Redux: ${foundFloorPlan.name}`);
                    
                    // Trouver les tables associées
                    const planTables = tables.filter(table => table.floorPlan === floorPlanId);
                    
                    setFloorPlan(foundFloorPlan);
                    setCurrentTables(planTables);
                    setObstacles(foundFloorPlan.obstacles || []);
                    
                    // Mettre à jour le plan actuel dans le store
                    dispatch(setCurrentFloorPlan(foundFloorPlan));
                } else {
                    // ⚠️ NOUVEAU: Logs améliorés et gestion d'erreurs plus robuste
                    console.log(`[FloorPlanEditor] Plan ${floorPlanId} non trouvé dans le store, chargement depuis l'API...`);
                    const response = await services.floorPlan.getFloorPlanDetails(floorPlanId);
                    
                    if (response.success) {
                        console.log(`[FloorPlanEditor] Plan chargé depuis l'API: ${response.data.floorPlan.name}`);
                        setFloorPlan(response.data.floorPlan);
                        setCurrentTables(response.data.tables || []);
                        setObstacles(response.data.floorPlan.obstacles || []);
                        
                        // Mettre à jour le store Redux avec le plan chargé
                        dispatch(setCurrentFloorPlan(response.data.floorPlan));
                    } else {
                        const errorMsg = `Erreur lors du chargement du plan ${floorPlanId}`;
                        console.error(`[FloorPlanEditor] ${errorMsg}:`, response.error);
                        setLocalError(response.error || errorMsg);
                        dispatch(setError(response.error || errorMsg));
                    }
                }
            } catch (error) {
                // ⚠️ NOUVEAU: Logs d'erreurs améliorés
                console.error('[FloorPlanEditor] Exception lors du chargement du plan:', error);
                console.error('[FloorPlanEditor] Stack trace:', error.stack);
                
                setLocalError('Impossible de charger le plan de salle.');
                dispatch(setError('Impossible de charger le plan de salle.'));
            } finally {
                setIsLoading(false);
                dispatch(setLoading(false));
            }
        };

        if (floorPlanId) {
            loadFloorPlan();
        }
    }, [floorPlanId, floorPlans, tables, dispatch]);

    // Gestion de la sélection d'un élément
    const handleElementSelect = (element, type) => {
        setSelectedElement({ ...element, type });
    };

    // Gestion du déplacement d'une table
    const handleTableDrag = (tableId, newPos) => {
        const updatedTable = currentTables.find(table => table._id === tableId);
        
        if (updatedTable) {
            const tableWithNewPos = {
                ...updatedTable,
                position: newPos
            };
            
            // Mettre à jour l'état local
            const updatedTables = currentTables.map(table => {
                if (table._id === tableId) {
                    return tableWithNewPos;
                }
                return table;
            });
            
            setCurrentTables(updatedTables);
            
            // Dispatch action pour mettre à jour dans le store
            dispatch(updateTable(tableWithNewPos));
        }
    };

    // Gestion du déplacement d'un obstacle
    const handleObstacleDrag = (index, newPos) => {
        const updatedObstacles = [...obstacles];
        updatedObstacles[index] = { ...updatedObstacles[index], position: newPos };
        setObstacles(updatedObstacles);
        
        // Pas besoin de dispatch ici car les obstacles sont stockés directement dans floorPlan
        // Ils seront sauvegardés ensemble lors de l'appel à updateFloorPlan
    };

    // Sauvegarde des modifications
    const handleSave = async () => {
        try {
            console.log('[FloorPlanEditor] Sauvegarde des modifications...');
            
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
                // Dispatch action pour mettre à jour chaque table dans le store
                dispatch(updateTable(table));
                
                // Sauvegarde de chaque table via le service
                return services.table.updateTable(table._id, table);
            });
            
            // Attendre que toutes les tables soient sauvegardées
            const tableResults = await Promise.allSettled(tablePromises);
            
            // Vérifier si toutes les tables ont été sauvegardées avec succès
            const failedTables = tableResults.filter(result => result.status === 'rejected' || !result.value.success);
            
            if (failedTables.length > 0) {
                console.warn('[FloorPlanEditor] Certaines tables n\'ont pas pu être sauvegardées:', failedTables);
            }

            // Notification et redirection
            alert('Plan de salle sauvegardé avec succès');
            navigate('/floor-plans');
        } catch (error) {
            console.error('[FloorPlanEditor] Erreur lors de la sauvegarde:', error);
            setLocalError('Erreur lors de la sauvegarde. Veuillez réessayer.');
            dispatch(setError('Erreur lors de la sauvegarde. Veuillez réessayer.'));
        }
    };

    // Ajout d'une nouvelle table
    const handleAddTable = async (tableData) => {
        try {
            console.log('[FloorPlanEditor] Ajout d\'une nouvelle table:', tableData);
            
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
            setCurrentTables([...currentTables, newTable]);
            setSelectedElement({ ...newTable, type: 'table' });
            
            // Dispatch action pour ajouter la table dans le store
            dispatch(addTable(newTable));
            
            // Créer la table via le service
            const response = await services.floorPlan.createTable(tableToAdd);
            
            if (response.success) {
                console.log('[FloorPlanEditor] Table créée avec succès:', response.data.table);
                
                // Si l'ID renvoyé par le service est différent de l'ID temporaire
                // mettre à jour l'ID dans l'état local et dans le store
                if (response.data.table._id !== tempId) {
                    const tableWithRealId = { ...newTable, _id: response.data.table._id };
                    
                    // Mettre à jour l'état local
                    setCurrentTables(prevTables => 
                        prevTables.map(table => 
                            table._id === tempId ? tableWithRealId : table
                        )
                    );
                    
                    // Mettre à jour la sélection si nécessaire
                    if (selectedElement?._id === tempId) {
                        setSelectedElement({ ...tableWithRealId, type: 'table' });
                    }
                    
                    // Dispatch action pour mettre à jour la table dans le store
                    dispatch(updateTable(tableWithRealId));
                }
            } else {
                console.error('[FloorPlanEditor] Erreur lors de la création de la table:', response.error);
                setLocalError(response.error || 'Erreur lors de l\'ajout de la table');
                dispatch(setError(response.error || 'Erreur lors de l\'ajout de la table'));
            }
        } catch (error) {
            console.error('[FloorPlanEditor] Exception lors de l\'ajout de la table:', error);
            setLocalError('Erreur lors de l\'ajout de la table');
            dispatch(setError('Erreur lors de l\'ajout de la table'));
        }
    };

    // Ajout d'un nouvel obstacle
    const handleAddObstacle = (obstacleData) => {
        console.log('[FloorPlanEditor] Ajout d\'un nouvel obstacle:', obstacleData);
        
        const newObstacle = {
            type: obstacleData.type || 'wall',
            position: obstacleData.position || { x: 100, y: 100 },
            dimensions: obstacleData.dimensions || { width: 100, height: 20 },
            rotation: obstacleData.rotation || 0,
            color: obstacleData.color || '#000000',
            label: obstacleData.label || ''
        };

        // Mettre à jour l'état local des obstacles
        const updatedObstacles = [...obstacles, newObstacle];
        setObstacles(updatedObstacles);
        setSelectedElement({ ...newObstacle, type: 'obstacle' });
        
        // Mettre à jour le floorPlan local avec les nouveaux obstacles
        const updatedFloorPlan = {
            ...floorPlan,
            obstacles: updatedObstacles
        };
        
        setFloorPlan(updatedFloorPlan);
        
        // Pas de dispatch ici car les obstacles seront sauvegardés avec le plan
    };

    // Suppression d'un élément
    const handleDeleteElement = async () => {
        if (!selectedElement) return;

        if (selectedElement.type === 'table') {
            try {
                console.log('[FloorPlanEditor] Suppression de la table:', selectedElement._id);
                
                // Mettre à jour l'état local
                const updatedTables = currentTables.filter(table => table._id !== selectedElement._id);
                setCurrentTables(updatedTables);
                setSelectedElement(null);
                
                // Dispatch action pour supprimer la table du store
                dispatch(deleteTable(selectedElement._id));
                
                // Supprimer la table via le service
                const response = await services.floorPlan.deleteTable(selectedElement._id);
                
                if (!response.success) {
                    console.warn('[FloorPlanEditor] Erreur lors de la suppression de la table:', response.error);
                }
            } catch (error) {
                console.error('[FloorPlanEditor] Exception lors de la suppression de la table:', error);
                setLocalError('Erreur lors de la suppression de la table');
                dispatch(setError('Erreur lors de la suppression de la table'));
            }
        } else if (selectedElement.type === 'obstacle') {
            console.log('[FloorPlanEditor] Suppression de l\'obstacle');
            
            const index = obstacles.findIndex(obstacle =>
                obstacle.position.x === selectedElement.position.x &&
                obstacle.position.y === selectedElement.position.y);

            if (index !== -1) {
                const updatedObstacles = [...obstacles];
                updatedObstacles.splice(index, 1);
                
                // Mettre à jour l'état local
                setObstacles(updatedObstacles);
                
                // Mettre à jour le floorPlan local
                const updatedFloorPlan = {
                    ...floorPlan,
                    obstacles: updatedObstacles
                };
                
                setFloorPlan(updatedFloorPlan);
            }
            setSelectedElement(null);
        }
    };

    // Gestion du zoom
    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();

        const pointerPosition = stage.getPointerPosition();
        const mousePointTo = {
            x: (pointerPosition.x - stage.x()) / oldScale,
            y: (pointerPosition.y - stage.y()) / oldScale
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({x: newScale, y: newScale});

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
                height={window.innerHeight * 0.8}
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
                    width={floorPlan.dimensions.width}
                    height={floorPlan.dimensions.height}
                    fill="#f5f5f5"
                    stroke="#cccccc"
                  />
                  
                  {/* Grille pour faciliter le placement */}
                  {Array.from({ length: Math.floor(floorPlan.dimensions.width / 50) }).map((_, i) => (
                    <Line
                      key={`vline-${i}`}
                      points={[i * 50, 0, i * 50, floorPlan.dimensions.height]}
                      stroke="#e0e0e0"
                      strokeWidth={1}
                    />
                  ))}
                  
                  {Array.from({ length: Math.floor(floorPlan.dimensions.height / 50) }).map((_, i) => (
                    <Line
                      key={`hline-${i}`}
                      points={[0, i * 50, floorPlan.dimensions.width, i * 50]}
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
                    updatedObstacles[index] = { ...updatedObstacles[index], ...updatedElement };
                    
                    setObstacles(updatedObstacles);
                    setSelectedElement(updatedElement);
                    
                    // Mettre à jour le floorPlan local
                    const updatedFloorPlan = {
                      ...floorPlan,
                      obstacles: updatedObstacles
                    };
                    
                    setFloorPlan(updatedFloorPlan);
                  }
                }
              }}
            />
          </div>
        </div>
      );
};

export default FloorPlanEditor;