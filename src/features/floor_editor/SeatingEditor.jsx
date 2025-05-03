import React, { useState, useRef, useEffect } from 'react';
import { Move, Square, Circle, Save, Trash2, Edit2, Plus, Box } from 'lucide-react';

const SeatingPlanEditor = () => {
  const [mode, setMode] = useState('view'); // 'view', 'draw', 'add-table', 'add-obstacle', 'edit-room', 'edit-table'
  const [roomShape, setRoomShape] = useState([]);
  const [tables, setTables] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedObstacle, setSelectedObstacle] = useState(null);
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
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

  useEffect(() => {
    drawCanvas();
  }, [roomShape, tables, obstacles, selectedTable, selectedObstacle, selectedCorner, mode]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw room shape
    if (roomShape.length > 0) {
      ctx.beginPath();
      ctx.moveTo(roomShape[0].x, roomShape[0].y);
      roomShape.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#f8f8f8';
      ctx.fill();
      
      // Draw corner handles if in edit mode
      if (mode === 'edit-room') {
        roomShape.forEach((point, index) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = selectedCorner === index ? '#3b82f6' : '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }
    }
    
    // Draw tables
    tables.forEach((table, index) => {
      ctx.save();
      ctx.translate(table.x, table.y);
      
      if (selectedTable === index) {
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#3b82f6';
      } else {
        ctx.fillStyle = '#94a3b8';
      }
      
      if (table.shape === 'rectangle') {
        ctx.fillRect(-table.width/2, -table.height/2, table.width, table.height);
      } else if (table.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, table.width/2, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Draw table info
      ctx.fillStyle = '#334155';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(table.name || `Table ${index + 1}`, 0, 0);
      ctx.fillText(`${table.capacity} places`, 0, 15);
      
      ctx.restore();
    });

    // Draw obstacles
    obstacles.forEach((obstacle, index) => {
      ctx.save();
      ctx.translate(obstacle.x, obstacle.y);
      
      if (selectedObstacle === index) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fef2f2';
        ctx.strokeStyle = '#ef4444';
      } else {
        ctx.fillStyle = '#757575';
        ctx.strokeStyle = '#424242';
      }
      
      if (obstacle.shape === 'rectangle') {
        ctx.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
        ctx.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
      } else if (obstacle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, obstacle.width/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
      
      // Draw obstacle name
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obstacle.name, 0, 5);
      
      ctx.restore();
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
    } else if (mode === 'view') {
      // Check if clicked on a table
      const clickedTableIndex = tables.findIndex(table => {
        const distance = Math.sqrt(Math.pow(table.x - x, 2) + Math.pow(table.y - y, 2));
        return distance < table.width / 2;
      });
      
      // Check if clicked on an obstacle
      const clickedObstacleIndex = obstacles.findIndex(obstacle => {
        const distance = Math.sqrt(Math.pow(obstacle.x - x, 2) + Math.pow(obstacle.y - y, 2));
        return distance < obstacle.width / 2;
      });
      
      setSelectedTable(clickedTableIndex >= 0 ? clickedTableIndex : null);
      setSelectedObstacle(clickedObstacleIndex >= 0 ? clickedObstacleIndex : null);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'view' && selectedTable !== null) {
      setIsDragging(true);
    } else if (mode === 'edit-room') {
      // Check if clicked on a corner
      const clickedCorner = roomShape.findIndex(point => {
        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
        return distance < 8;
      });
      
      if (clickedCorner >= 0) {
        setSelectedCorner(clickedCorner);
        setIsDragging(true);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (mode === 'view' && selectedTable !== null) {
        const updatedTables = [...tables];
        updatedTables[selectedTable] = {
          ...updatedTables[selectedTable],
          x: x,
          y: y
        };
        setTables(updatedTables);
      } else if (mode === 'view' && selectedObstacle !== null) {
        const updatedObstacles = [...obstacles];
        updatedObstacles[selectedObstacle] = {
          ...updatedObstacles[selectedObstacle],
          x: x,
          y: y
        };
        setObstacles(updatedObstacles);
      } else if (mode === 'edit-room' && selectedCorner !== null) {
        const updatedShape = [...roomShape];
        updatedShape[selectedCorner] = { x, y };
        setRoomShape(updatedShape);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (mode === 'edit-room') {
      setSelectedCorner(null);
    }
  };

  const deleteSelectedTable = () => {
    if (selectedTable !== null) {
      const updatedTables = tables.filter((_, index) => index !== selectedTable);
      setTables(updatedTables);
      setSelectedTable(null);
    }
  };

  const deleteSelectedObstacle = () => {
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white p-6 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6">Éditeur de plan de salle</h2>
        
        {/* Mode buttons */}
        <div className="space-y-3 mb-6">
          <button
            className={`w-full flex items-center gap-2 p-3 rounded-lg border ${
              mode === 'view' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMode('view')}
          >
            <Move className="w-5 h-5" />
            Déplacer
          </button>
          <button
            className={`w-full flex items-center gap-2 p-3 rounded-lg border ${
              mode === 'draw' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMode('draw')}
          >
            <Edit2 className="w-5 h-5" />
            Dessiner la salle
          </button>
          <button
            className={`w-full flex items-center gap-2 p-3 rounded-lg border ${
              mode === 'edit-room' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMode('edit-room')}
            disabled={roomShape.length === 0}
          >
            <Square className="w-5 h-5" />
            Modifier la salle
          </button>
          <button
            className={`w-full flex items-center gap-2 p-3 rounded-lg border ${
              mode === 'add-table' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMode('add-table')}
          >
            <Plus className="w-5 h-5" />
            Ajouter une table
          </button>
          <button
            className={`w-full flex items-center gap-2 p-3 rounded-lg border ${
              mode === 'add-obstacle' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => setMode('add-obstacle')}
          >
            <Box className="w-5 h-5" />
            Ajouter un obstacle
          </button>
        </div>

        {/* Room controls */}
        {mode === 'draw' && (
          <div className="mb-6">
            <button
              className="w-full p-3 bg-red-500 text-white rounded-lg"
              onClick={clearRoom}
            >
              Effacer la salle
            </button>
          </div>
        )}

        {/* Configuration */}
        {(mode === 'add-table' || (mode === 'view' && selectedTable !== null)) && (
          <div className="space-y-4">
            <h3 className="font-semibold">Configuration de la table</h3>
            
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <input
                type="text"
                value={tableConfig.name}
                onChange={(e) => setTableConfig({...tableConfig, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Nom de la table"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Forme</label>
              <select
                value={tableConfig.shape}
                onChange={(e) => setTableConfig({...tableConfig, shape: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Cercle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Largeur</label>
              <input
                type="number"
                value={tableConfig.width}
                onChange={(e) => setTableConfig({...tableConfig, width: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>

            {tableConfig.shape === 'rectangle' && (
              <div>
                <label className="block text-sm mb-1">Hauteur</label>
                <input
                  type="number"
                  value={tableConfig.height}
                  onChange={(e) => setTableConfig({...tableConfig, height: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">Capacité</label>
              <input
                type="number"
                value={tableConfig.capacity}
                onChange={(e) => setTableConfig({...tableConfig, capacity: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>

            {selectedTable !== null && mode === 'view' && (
              <button
                className="w-full p-3 bg-blue-500 text-white rounded-lg"
                onClick={saveTableConfig}
              >
                Sauvegarder les modifications
              </button>
            )}
          </div>
        )}

        {(mode === 'add-obstacle' || (mode === 'view' && selectedObstacle !== null)) && (
          <div className="space-y-4">
            <h3 className="font-semibold">Configuration de l'obstacle</h3>
            
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <input
                type="text"
                value={obstacleConfig.name}
                onChange={(e) => setObstacleConfig({...obstacleConfig, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Nom de l'obstacle"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Forme</label>
              <select
                value={obstacleConfig.shape}
                onChange={(e) => setObstacleConfig({...obstacleConfig, shape: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Cercle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Largeur</label>
              <input
                type="number"
                value={obstacleConfig.width}
                onChange={(e) => setObstacleConfig({...obstacleConfig, width: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>

            {obstacleConfig.shape === 'rectangle' && (
              <div>
                <label className="block text-sm mb-1">Hauteur</label>
                <input
                  type="number"
                  value={obstacleConfig.height}
                  onChange={(e) => setObstacleConfig({...obstacleConfig, height: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {selectedObstacle !== null && mode === 'view' && (
              <button
                className="w-full p-3 bg-blue-500 text-white rounded-lg"
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
            className="w-full mt-6 p-3 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
            onClick={deleteSelectedTable}
          >
            <Trash2 className="w-5 h-5" />
            Supprimer la table
          </button>
        )}

        {selectedObstacle !== null && mode === 'view' && (
          <button
            className="w-full mt-6 p-3 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
            onClick={deleteSelectedObstacle}
          >
            <Trash2 className="w-5 h-5" />
            Supprimer l'obstacle
          </button>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 bg-white rounded-lg shadow-sm cursor-crosshair"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm">
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

export default SeatingPlanEditor;