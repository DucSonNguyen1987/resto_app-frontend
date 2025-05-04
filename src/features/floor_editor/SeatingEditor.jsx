import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Group, Text, Line, Transformer } from 'react-konva';
import './SeatingEditor.css';

const SeatingEditor = () => {
  const [mode, setMode] = useState('view'); // 'view', 'draw', 'add-table', 'add-obstacle', 'edit-room', 'edit-table'
  const [roomShape, setRoomShape] = useState([]);
  const [tables, setTables] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedObstacle, setSelectedObstacle] = useState(null);
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tableConfig, setTableConfig] = useState({
    shape: 'rectangle',
    width: 100,
    height: 60,
    capacity: 4,
    name: ''
  });

  const [obstacleConfig, setObstacleConfig] = useState({
    shape: 'rectangle',
    width: 50,
    height: 50,
    name: 'Obstacle'
  });

  // Icônes personnalisées avec svgPath
  const MoveIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
    </svg>
  );

  const SquareIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    </svg>
  );

  const CircleIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );

  const BoxIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="6" x2="19" y2="6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );

  const EditIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  );

  const handleStageClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const x = pointerPosition.x;
    const y = pointerPosition.y;

    if (mode === 'draw') {
      setRoomShape([...roomShape, { x, y }]);
    } else if (mode === 'add-table') {
      const newTable = {
        ...tableConfig,
        x: x,
        y: y,
        id: Date.now()
      };
      setTables([...tables, newTable]);
      setMode('view');
    } else if (mode === 'add-obstacle') {
      const newObstacle = {
        ...obstacleConfig,
        x: x,
        y: y,
        id: Date.now()
      };
      setObstacles([...obstacles, newObstacle]);
      setMode('view');
    }
  };

  const handleDeleteSelectedTable = () => {
    if (selectedTable !== null) {
      const updatedTables = tables.filter((_, index) => index !== selectedTable);
      setTables(updatedTables);
      setSelectedTable(null);
    }
  };

  const handleDeleteSelectedObstacle = () => {
    if (selectedObstacle !== null) {
      const updatedObstacles = obstacles.filter((_, index) => index !== selectedObstacle);
      setObstacles(updatedObstacles);
      setSelectedObstacle(null);
    }
  };

  const clearRoom = () => {
    setRoomShape([]);
    setMode('view');
  };

  const saveTableConfig = () => {
    if (selectedTable !== null) {
      const updatedTables = [...tables];
      updatedTables[selectedTable] = {
        ...updatedTables[selectedTable],
        ...tableConfig
      };
      setTables(updatedTables);
    }
  };

  const saveObstacleConfig = () => {
    if (selectedObstacle !== null) {
      const updatedObstacles = [...obstacles];
      updatedObstacles[selectedObstacle] = {
        ...updatedObstacles[selectedObstacle],
        ...obstacleConfig
      };
      setObstacles(updatedObstacles);
    }
  };

  return (
    <div className="seating-editor">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Éditeur de plan de salle</h2>
        
        {/* Mode buttons */}
        <div className="mode-buttons">
          <button
            className={`mode-button ${mode === 'view' ? 'active' : ''}`}
            onClick={() => setMode('view')}
          >
            <MoveIcon />
            <span>Déplacer</span>
          </button>
          <button
            className={`mode-button ${mode === 'draw' ? 'active' : ''}`}
            onClick={() => setMode('draw')}
          >
            <EditIcon />
            <span>Dessiner la salle</span>
          </button>
          <button
            className={`mode-button ${mode === 'edit-room' ? 'active' : ''}`}
            onClick={() => setMode('edit-room')}
            disabled={roomShape.length === 0}
          >
            <SquareIcon />
            <span>Modifier la salle</span>
          </button>
          <button
            className={`mode-button ${mode === 'add-table' ? 'active' : ''}`}
            onClick={() => setMode('add-table')}
          >
            <PlusIcon />
            <span>Ajouter une table</span>
          </button>
          <button
            className={`mode-button ${mode === 'add-obstacle' ? 'active' : ''}`}
            onClick={() => setMode('add-obstacle')}
          >
            <BoxIcon />
            <span>Ajouter un obstacle</span>
          </button>
        </div>

        {/* Room controls */}
        {mode === 'draw' && (
          <div className="room-controls">
            <button
              className="button button-danger"
              onClick={clearRoom}
            >
              Effacer la salle
            </button>
          </div>
        )}

        {/* Configuration */}
        {(mode === 'add-table' || (mode === 'view' && selectedTable !== null)) && (
          <div className="config-section">
            <h3>Configuration de la table</h3>
            
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={tableConfig.name}
                onChange={(e) => setTableConfig({...tableConfig, name: e.target.value})}
                placeholder="Nom de la table"
              />
            </div>

            <div className="form-group">
              <label>Forme</label>
              <select
                value={tableConfig.shape}
                onChange={(e) => setTableConfig({...tableConfig, shape: e.target.value})}
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Cercle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Largeur</label>
              <input
                type="number"
                value={tableConfig.width}
                onChange={(e) => setTableConfig({...tableConfig, width: parseInt(e.target.value)})}
              />
            </div>

            {tableConfig.shape === 'rectangle' && (
              <div className="form-group">
                <label>Hauteur</label>
                <input
                  type="number"
                  value={tableConfig.height}
                  onChange={(e) => setTableConfig({...tableConfig, height: parseInt(e.target.value)})}
                />
              </div>
            )}

            <div className="form-group">
              <label>Capacité</label>
              <input
                type="number"
                value={tableConfig.capacity}
                onChange={(e) => setTableConfig({...tableConfig, capacity: parseInt(e.target.value)})}
              />
            </div>

            {selectedTable !== null && mode === 'view' && (
              <button
                className="button button-primary"
                onClick={saveTableConfig}
              >
                Sauvegarder les modifications
              </button>
            )}
          </div>
        )}

        {(mode === 'add-obstacle' || (mode === 'view' && selectedObstacle !== null)) && (
          <div className="config-section">
            <h3>Configuration de l'obstacle</h3>
            
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={obstacleConfig.name}
                onChange={(e) => setObstacleConfig({...obstacleConfig, name: e.target.value})}
                placeholder="Nom de l'obstacle"
              />
            </div>

            <div className="form-group">
              <label>Forme</label>
              <select
                value={obstacleConfig.shape}
                onChange={(e) => setObstacleConfig({...obstacleConfig, shape: e.target.value})}
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Cercle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Largeur</label>
              <input
                type="number"
                value={obstacleConfig.width}
                onChange={(e) => setObstacleConfig({...obstacleConfig, width: parseInt(e.target.value)})}
              />
            </div>

            {obstacleConfig.shape === 'rectangle' && (
              <div className="form-group">
                <label>Hauteur</label>
                <input
                  type="number"
                  value={obstacleConfig.height}
                  onChange={(e) => setObstacleConfig({...obstacleConfig, height: parseInt(e.target.value)})}
                />
              </div>
            )}

            {selectedObstacle !== null && mode === 'view' && (
              <button
                className="button button-primary"
                onClick={saveObstacleConfig}
              >
                Sauvegarder les modifications
              </button>
            )}
          </div>
        )}

        {/* Delete actions */}
        {selectedTable !== null && mode === 'view' && (
          <button
            className="button button-danger delete-button"
            onClick={handleDeleteSelectedTable}
          >
            <TrashIcon />
            <span>Supprimer la table</span>
          </button>
        )}

        {selectedObstacle !== null && mode === 'view' && (
          <button
            className="button button-danger delete-button"
            onClick={handleDeleteSelectedObstacle}
          >
            <TrashIcon />
            <span>Supprimer l'obstacle</span>
          </button>
        )}
      </div>

      {/* Konva Stage */}
      <div className="canvas-container">
        <div className="canvas-wrapper">
          <Stage
            width={500}
            height={500}
            className="seating-canvas"
            onClick={handleStageClick}
          >
            <Layer>
              {/* Dessiner la salle */}
              {roomShape.length > 0 && (
                <>
                  <Line
                    points={roomShape.reduce((acc, point) => [...acc, point.x, point.y], [])}
                    stroke="#333"
                    strokeWidth={2}
                    closed={true}
                    fill="#F8F8F8"
                  />
                  
                  {/* Coins de la salle en mode édition */}
                  {mode === 'edit-room' && roomShape.map((point, index) => (
                    <Circle
                      key={index}
                      x={point.x}
                      y={point.y}
                      radius={8}
                      fill={selectedCorner === index ? '#3b82f6' : '#ef4444'}
                      stroke="#fff"
                      strokeWidth={2}
                      draggable={true}
                      onDragMove={(e) => {
                        const updatedShape = [...roomShape];
                        updatedShape[index] = { x: e.target.x(), y: e.target.y() };
                        setRoomShape(updatedShape);
                      }}
                    />
                  ))}
                </>
              )}

              {/* Dessiner les tables */}
              {tables.map((table, index) => (
                <Group
                  key={table.id}
                  x={table.x}
                  y={table.y}
                  draggable={mode === 'view'}
                  onClick={() => setSelectedTable(index)}
                  onDblClick={() => setSelectedTable(index)}
                  onDragMove={(e) => {
                    const updatedTables = [...tables];
                    updatedTables[index] = { ...table, x: e.target.x(), y: e.target.y() };
                    setTables(updatedTables);
                  }}
                >
                  {table.shape === 'rectangle' ? (
                    <Rect
                      x={-table.width / 2}
                      y={-table.height / 2}
                      width={table.width}
                      height={table.height}
                      fill={selectedTable === index ? '#3b82f6' : '#94a3b8'}
                      shadowBlur={selectedTable === index ? 10 : 0}
                      shadowColor={selectedTable === index ? '#3b82f6' : ''}
                    />
                  ) : (
                    <Circle
                      radius={table.width / 2}
                      fill={selectedTable === index ? '#3b82f6' : '#94a3b8'}
                      shadowBlur={selectedTable === index ? 10 : 0}
                      shadowColor={selectedTable === index ? '#3b82f6' : ''}
                    />
                  )}
                  <Text
                    text={table.name || `Table ${index + 1}`}
                    fontSize={12}
                    fill="#334155"
                    width={table.width}
                    align="center"
                    y={-10}
                  />
                  <Text
                    text={`${table.capacity} places`}
                    fontSize={12}
                    fill="#334155"
                    width={table.width}
                    align="center"
                    y={5}
                  />
                </Group>
              ))}

              {/* Dessiner les obstacles */}
              {obstacles.map((obstacle, index) => (
                <Group
                  key={obstacle.id}
                  x={obstacle.x}
                  y={obstacle.y}
                  draggable={mode === 'view'}
                  onClick={() => setSelectedObstacle(index)}
                  onDblClick={() => setSelectedObstacle(index)}
                  onDragEnd={(e) => {
                    const updatedObstacles = [...obstacles];
                    updatedObstacles[index] = { ...obstacle, x: e.target.x(), y: e.target.y() };
                    setObstacles(updatedObstacles);
                  }}
                >
                  {obstacle.shape === 'rectangle' ? (
                    <Rect
                      x={-obstacle.width / 2}
                      y={-obstacle.height / 2}
                      width={obstacle.width}
                      height={obstacle.height}
                      fill={selectedObstacle === index ? '#fef2f2' : '#757575'}
                      stroke={selectedObstacle === index ? '#ef4444' : '#424242'}
                      strokeWidth={1}
                      shadowBlur={selectedObstacle === index ? 10 : 0}
                      shadowColor={selectedObstacle === index ? '#ef4444' : ''}
                    />
                  ) : (
                    <Circle
                      radius={obstacle.width / 2}
                      fill={selectedObstacle === index ? '#fef2f2' : '#757575'}
                      stroke={selectedObstacle === index ? '#ef4444' : '#424242'}
                      strokeWidth={1}
                      shadowBlur={selectedObstacle === index ? 10 : 0}
                      shadowColor={selectedObstacle === index ? '#ef4444' : ''}
                    />
                  )}
                  <Text
                    text={obstacle.name}
                    fontSize={12}
                    fill="#1f2937"
                    width={obstacle.width}
                    align="center"
                    y={-6}
                  />
                </Group>
              ))}
            </Layer>
          </Stage>
          
          {/* Instructions */}
          <div className="instructions">
            {mode === 'draw' && 'Cliquez pour dessiner les murs de la salle'}
            {mode === 'edit-room' && 'Déplacez les coins pour modifier la forme de la salle'}
            {mode === 'add-table' && 'Cliquez pour positionner une nouvelle table'}
            {mode === 'add-obstacle' && 'Cliquez pour positionner un nouvel obstacle'}
            {mode === 'view' && selectedTable !== null && 'Glissez pour déplacer la table'}
            {mode === 'view' && selectedObstacle !== null && 'Glissez pour déplacer l\'obstacle'}
            {mode === 'view' && selectedTable === null && selectedObstacle === null && 'Cliquez sur un élément pour le sélectionner'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingEditor;