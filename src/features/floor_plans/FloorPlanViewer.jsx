// src/features/floor_plans/FloorPlanViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Stage, Layer, Rect, Line, Circle, Text, Group } from 'react-konva';
import services from '../../services/serviceSwitch';

// Importer les styles
import './FloorPlanViewer.css';

// Composant principal de visualisation d'un plan de salle (en lecture seule)
const FloorPlanViewer = () => {
  const { floorPlanId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stageRef = useRef(null);
  
  // Récupérer les données du store Redux
  const { 
    floorPlans, 
    tables, 
    loading: isLoading, 
    error, 
    currentFloorPlan 
  } = useSelector(state => state.floorPlan.value);
  
  // État pour la visualisation
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Récupérer les données du plan de salle et des tables
  useEffect(() => {
    const loadFloorPlan = async () => {
      if (floorPlanId) {
        await services.floorPlan.getFloorPlanDetails(floorPlanId);
      }
    };
    
    loadFloorPlan();
  }, [floorPlanId, dispatch]);
  
  // Filtrer les tables liées à ce plan
  const planTables = tables.filter(table => table.floorPlan === floorPlanId);
  
  // Récupérer le plan actuel à partir du store
  const floorPlan = currentFloorPlan || floorPlans.find(plan => plan._id === floorPlanId);
  
  // Gérer le zoom
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
  
  // Rendu de différentes formes de table
  const renderTableShape = (table) => {
    const { shape, dimensions, status } = table;
    
    // Déterminer la couleur en fonction du statut
    const colorMap = {
      'free': '#8bc34a',      // Vert pour table libre
      'reserved': '#ffb74d',  // Orange pour table réservée
      'occupied': '#ef5350'   // Rouge pour table occupée
    };
    
    const color = colorMap[status] || '#8bc34a';
    
    switch (shape) {
      case 'circle':
        return (
          <Circle
            width={dimensions.width}
            height={dimensions.width}
            fill={color}
            opacity={0.8}
            stroke="#333"
            strokeWidth={1}
          />
        );
      case 'square':
        return (
          <Rect
            width={dimensions.width}
            height={dimensions.width}
            fill={color}
            opacity={0.8}
            stroke="#333"
            strokeWidth={1}
          />
        );
      case 'rectangle':
        return (
          <Rect
            width={dimensions.width}
            height={dimensions.height}
            fill={color}
            opacity={0.8}
            stroke="#333"
            strokeWidth={1}
          />
        );
      case 'oval':
        return (
          <Rect
            width={dimensions.width}
            height={dimensions.height}
            fill={color}
            opacity={0.8}
            stroke="#333"
            strokeWidth={1}
            cornerRadius={dimensions.height / 2}
          />
        );
      default:
        return (
          <Circle
            width={dimensions.width}
            height={dimensions.width}
            fill={color}
            opacity={0.8}
            stroke="#333"
            strokeWidth={1}
          />
        );
    }
  };
  
  // Rendu des obstacles
  const renderObstacle = (obstacle) => {
    const { type, dimensions, position, rotation, color, label } = obstacle;
    
    // Couleurs par type d'obstacle
    const getObstacleColor = (type) => {
      const colorMap = {
        'wall': '#8d6e63',      // Marron pour les murs
        'pillar': '#78909c',    // Gris-bleu pour les piliers
        'door': '#90a4ae',      // Gris clair pour les portes
        'window': '#b3e5fc',    // Bleu très clair pour les fenêtres
        'bar': '#5d4037',       // Marron foncé pour le bar
        'service': '#ffcc80',   // Orange clair pour les zones de service
        'stairs': '#9e9e9e',    // Gris pour les escaliers
        'other': '#bdbdbd'      // Gris clair pour autres obstacles
      };
      
      return colorMap[type] || color || '#808080';
    };
    
    return (
      <Group
        key={`obstacle-${position.x}-${position.y}`}
        x={position.x}
        y={position.y}
        rotation={rotation || 0}
      >
        <Rect
          width={dimensions.width}
          height={dimensions.height}
          fill={getObstacleColor(type)}
          opacity={0.9}
          stroke="#333"
          strokeWidth={1}
          cornerRadius={type === 'pillar' ? dimensions.width / 2 : 0}
        />
        
        {label && (
          <Text
            text={label}
            fontSize={12}
            fontStyle="bold"
            fill="#fff"
            width={dimensions.width}
            height={dimensions.height}
            align="center"
            verticalAlign="middle"
          />
        )}
      </Group>
    );
  };
  
  // Afficher l'état de chargement
  if (isLoading) {
    return <div className="loading">Chargement du plan de salle...</div>;
  }
  
  // Afficher les erreurs
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  // Vérifier si le plan existe
  if (!floorPlan) {
    return <div>Aucun plan de salle trouvé</div>;
  }
  
  return (
    <div className="floor-plan-viewer">
      <div className="viewer-header">
        <h2>{floorPlan.name}</h2>
        <div className="info">
          <p>Capacité: {floorPlan.capacity || planTables.reduce((sum, table) => sum + table.capacity, 0)} places</p>
          <p>Statut: {floorPlan.status || 'Active'}</p>
        </div>
        <div className="actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/floor-plans/edit/${floorPlanId}`)}
          >
            Modifier
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/floor-plans')}
          >
            Retour
          </button>
        </div>
      </div>
      
      <div className="viewer-container">
        <div className="canvas-container">
          <Stage
            ref={stageRef}
            width={window.innerWidth * 0.8}
            height={window.innerHeight * 0.7}
            onWheel={handleWheel}
            scaleX={scale}
            scaleY={scale}
            x={stagePos.x}
            y={stagePos.y}
            draggable={true}
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
              
              {/* Grille pour faciliter la visualisation */}
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
              {(floorPlan.obstacles || []).map((obstacle, i) => (
                <React.Fragment key={`obstacle-${i}`}>
                  {renderObstacle(obstacle)}
                </React.Fragment>
              ))}
              
              {/* Tables */}
              {planTables.map((table) => (
                <Group
                  key={`table-${table._id}`}
                  x={table.position.x}
                  y={table.position.y}
                  onClick={() => setSelectedTable(table)}
                >
                  {renderTableShape(table)}
                  
                  {/* Numéro de table */}
                  <Text
                    text={`${table.number}`}
                    fontSize={16}
                    fontStyle="bold"
                    fill="#fff"
                    width={table.dimensions.width}
                    height={table.dimensions.height}
                    align="center"
                    verticalAlign="middle"
                  />
                  
                  {/* Capacité de la table */}
                  <Text
                    text={`(${table.capacity})`}
                    fontSize={12}
                    fill="#fff"
                    width={table.dimensions.width}
                    height={table.dimensions.height}
                    offsetY={-15}
                    align="center"
                    verticalAlign="bottom"
                  />
                </Group>
              ))}
            </Layer>
          </Stage>
        </div>
        
        {/* Panneau d'informations sur la table sélectionnée */}
        {selectedTable && (
          <div className="table-info-panel">
            <h3>Table {selectedTable.number}</h3>
            <div className="info-container">
              <p><strong>Capacité:</strong> {selectedTable.capacity} personnes</p>
              <p><strong>Forme:</strong> {
                selectedTable.shape === 'circle' ? 'Ronde' :
                selectedTable.shape === 'square' ? 'Carrée' :
                selectedTable.shape === 'rectangle' ? 'Rectangle' :
                selectedTable.shape === 'oval' ? 'Ovale' : 'Autre'
              }</p>
              <p><strong>Statut:</strong> {
                selectedTable.status === 'free' ? 'Libre' :
                selectedTable.status === 'reserved' ? 'Réservée' :
                selectedTable.status === 'occupied' ? 'Occupée' : selectedTable.status
              }</p>
              <p><strong>Dimensions:</strong> {selectedTable.dimensions.width} x {
                (selectedTable.shape === 'circle' || selectedTable.shape === 'square') 
                  ? selectedTable.dimensions.width 
                  : selectedTable.dimensions.height
              }</p>
            </div>
            <button 
              className="btn btn-secondary close-btn"
              onClick={() => setSelectedTable(null)}
            >
              Fermer
            </button>
          </div>
        )}
        
        <div className="instructions">
          <h4>Navigation</h4>
          <ul>
            <li>Cliquez et faites glisser pour déplacer le plan</li>
            <li>Utilisez la molette de la souris pour zoomer/dézoomer</li>
            <li>Cliquez sur une table pour voir ses détails</li>
          </ul>
        </div>
      </div>
      
      {/* Légende */}
      <div className="legend">
        <h4>Légende</h4>
        <div className="legend-item">
          <div className="color-box free"></div>
          <span>Table libre</span>
        </div>
        <div className="legend-item">
          <div className="color-box reserved"></div>
          <span>Table réservée</span>
        </div>
        <div className="legend-item">
          <div className="color-box occupied"></div>
          <span>Table occupée</span>
        </div>
        <div className="legend-item">
          <div className="color-box wall"></div>
          <span>Mur</span>
        </div>
        <div className="legend-item">
          <div className="color-box pillar"></div>
          <span>Pilier</span>
        </div>
        <div className="legend-item">
          <div className="color-box bar"></div>
          <span>Bar</span>
        </div>
      </div>
      
      {/* Statistiques du plan */}
      <div className="plan-statistics">
        <h4>Statistiques</h4>
        <p><strong>Nombre de tables:</strong> {planTables.length}</p>
        <p><strong>Capacité totale:</strong> {planTables.reduce((sum, table) => sum + table.capacity, 0)} places</p>
        <p>
          <strong>Tables libres:</strong> {planTables.filter(table => table.status === 'free').length} 
          ({planTables.length > 0 ? Math.round(planTables.filter(table => table.status === 'free').length / planTables.length * 100) : 0}%)
        </p>
        <p>
          <strong>Tables réservées:</strong> {planTables.filter(table => table.status === 'reserved').length}
          ({planTables.length > 0 ? Math.round(planTables.filter(table => table.status === 'reserved').length / planTables.length * 100) : 0}%)
        </p>
        <p>
          <strong>Tables occupées:</strong> {planTables.filter(table => table.status === 'occupied').length}
          ({planTables.length > 0 ? Math.round(planTables.filter(table => table.status === 'occupied').length / planTables.length * 100) : 0}%)
        </p>
      </div>
    </div>
  );
};

export default FloorPlanViewer;