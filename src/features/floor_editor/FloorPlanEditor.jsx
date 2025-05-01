import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Importations des services API
import floorPlanService from '../../services/floorPlanService';
import tableService from '../../services/tableService';

// Composants de l'étditeur
import TableShape from './TableShape';
import ObstacleShape from './ObstacleShape';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';


const FloorPlanEditor = () => {
    const { floorPlanId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stageRef = useRef();
    const user = useSelector(state => state.user.value);

    // Etats pour le plan de salle

    const [floorPlan, setFloorPlan] = useState(null);
    const [tables, setTables] = useState([]);
    const [obstacles, setObstacles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const response = await floorPlanService.getFloorPlanDetails(floorPlanId);

                if (response.success) {
                    setFloorPlan(response.data.floorPlan);
                    setTables(response.data.tables);
                    setObstacles(response.data.floorPlan.obstacles || []);
                } else {
                    setError(response.error || 'Erreur lors du chargement du plan de salle');
                }
            } catch (error) {
                console.error('Erreur lors du chargement du plan:', error);
                setError('Impossible de charger le plan de salle.')
            } finally {
                setIsLoading(false);
            }
        };

        if (floorPlanId) {
            loadFloorPlan();
        }
    }, [floorPlanId]);

    // Gestion de la sélection d'un élément
    const handleElementSelect = (element, type) => {
        setSelectedElement({ ...element, type });
    };

    // Gestion du déplacement d'une table
    const handleTableDrag = (tableId, newPos) => {
        const updatedTables = tables.map(table => {
            if (table._id === tableId) {
                return { ...table, position: newPos };
            }
            return table;
        });
        setTables(updatedTables);
    };

    // Gestion du déplacement d'un obstacle
    const handleObstacleDrag = (index, newPos) => {
        const updatedObstacles = [...obstacles];
        updatedObstacles[index] = { ...updatedObstacles[index], position: newPos };
        setObstacles(updatedObstacles);
    };

    // Sauvegarde des modifications
    const handleSave = async () => {
        try {
            // Sauvegarde du plan avec les obstacles
            const floorPlanResponse = await floorPlanService.updateFloorPlan(floorPlanId, {
                ...floorPlan,
                obstacles
            });

            // Sauvegarde des tables
            for (const table of tables) {
                await tableService.updateTable(table._id, table);
            }

            // Notification et redirection
            alert('Plan de salle sauvegardé avec succès');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setError('Erreur lors de la sauvegarde. veuillez réessayer.')
        }
    };

    // Ajout d'une nouvelle table
    handleAddTable = (tableData) => {
        // générer un Id temp pour la nouvelle table

        const tempId = `temp_${Date.now()}`;

        const newTable = {
            _id: tempId,
            number: tables.length + 1,
            capacity: tableData.capacity || 2,
            shape: tableData.shape || 'circle',
            position: tableData.position || { x: 100, y: 100 },
            dimensions: tableData.dimensions || { width: 60, height: 60 },
            status: 'free',
            floorPlan: floorPlanId
        };

        setTables([...tables, newTable]);
        setSelectedElement({ ...newTable, type: 'table' });
    };

    // Ajout d'un nouvel obstacle
    const handleAddObstacle (obstacleData) => {
        const newObstacle = {
            type: obstacleData.type || 'null',
            position: obstacleData.position || { x: 100, y: 100 },
            dimensions: obstacleData.dimensions || { width: 100, height: 20 },
            rotation: obstacleData.rotation || 0,
            color: obstacleData.color || '#000000',
            label: obstacleData.label || ''
        };

        setObstacles([...obstacles, newObstacle]);
        setSelectedElement({ ...newObstacle, type: 'obstacle' });
    };

    // Suppression d'uné lément
    const handleDeleteElement = () => {
        if (!selectedElement) return;

        if (selectedElement.type === 'table') {
            const updatedTables = tables.filter(table => table._id !== selectedElement._id);
            setTables(updatedTables);
        } else if (selectedElement.type === 'obstacle') {
            const index = obstacles.findIndex(obstacle =>
                obstacle.position.x === selectedElement.position.x &&
                obstacle.position.y === selectedElement.position.y);

            if (index !== -1) {
                const updatedObstacles = [...obstacles];
                updatedObstacles.splice(index, 1);
                setObstacles(updatedObstacles);
            }
        }
        setSelectedElement(null);
    };


    // Gestion du zoom
    const handleWheel = (e) => {
        e.evt.preventDefault();

        const scaleBy= 1.1;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();

        const pointerPosition = stage.getPointerPosition();
        const mousePointTo = {
            x: (pointerPosition.x - stage.x()) / oldScale,
            y: (pointerPosition.y - stage.x()) / oldScale
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({x: newScale , y: newScale});

        const newPos = {
            x: pointerPosition.x - mousePointTo.x * newScale,
            y: pointerPosition.y - mousePointTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();
        
        setScale(newScale);
        setStagePos(newPos);
    };

    if (isLoading) {
        return <div className='loading'>Chargement du plan de salle ...</div>
    }

    if (error) {
        return <div className='error-message'>{error}</div>
    }

    if (!floorPlan) {
        return <div> Aucun plan de salle trouvé</div>
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
                  {tables.map((table) => (
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
                  const updatedTables = tables.map(table => {
                    if (table._id === updatedElement._id) {
                      return { ...table, ...updatedElement };
                    }
                    return table;
                  });
                  setTables(updatedTables);
                  setSelectedElement(updatedElement);
                } else if (updatedElement.type === 'obstacle') {
                  const index = obstacles.findIndex(obstacle => 
                    obstacle.position.x === selectedElement.position.x && 
                    obstacle.position.y === selectedElement.position.y);
                  
                  if (index !== -1) {
                    const updatedObstacles = [...obstacles];
                    updatedObstacles[index] = { ...updatedObstacles[index], ...updatedElement };
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