// src/features/floor_editor/Toolbar.jsx
import React, { useState } from 'react';

const Toolbar = ({ 
  selectedTool, 
  onSelectTool, 
  onAddTable, 
  onAddObstacle,
  onDelete,
  selectedElement
}) => {
  const [showTableOptions, setShowTableOptions] = useState(false);
  const [showObstacleOptions, setShowObstacleOptions] = useState(false);
  
  // Options pour les formes de table
  const tableShapes = [
    { id: 'circle', label: 'Ronde' },
    { id: 'square', label: 'Carrée' },
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'oval', label: 'Ovale' }
  ];
  
  // Options pour les types d'obstacles
  const obstacleTypes = [
    { id: 'wall', label: 'Mur' },
    { id: 'pillar', label: 'Pilier' },
    { id: 'door', label: 'Porte' },
    { id: 'window', label: 'Fenêtre' },
    { id: 'bar', label: 'Bar' },
    { id: 'service', label: 'Service' },
    { id: 'stairs', label: 'Escalier' },
    { id: 'other', label: 'Autre' }
  ];
  
  // Ajouter une table avec la forme sélectionnée
  const handleAddTable = (shape) => {
    let dimensions;
    
    switch (shape) {
      case 'circle':
        dimensions = { width: 60, height: 60 };
        break;
      case 'square':
        dimensions = { width: 60, height: 60 };
        break;
      case 'rectangle':
        dimensions = { width: 80, height: 60 };
        break;
      case 'oval':
        dimensions = { width: 80, height: 60 };
        break;
      default:
        dimensions = { width: 60, height: 60 };
    }
    
    onAddTable({
      shape,
      dimensions,
      position: { x: 100, y: 100 }, // Position par défaut
      capacity: 4 // Capacité par défaut
    });
    
    setShowTableOptions(false);
    onSelectTool('select');
  };
  
  // Ajouter un obstacle avec le type sélectionné
  const handleAddObstacle = (type) => {
    let dimensions;
    
    switch (type) {
      case 'wall':
        dimensions = { width: 150, height: 20 };
        break;
      case 'pillar':
        dimensions = { width: 30, height: 30 };
        break;
      case 'door':
        dimensions = { width: 60, height: 10 };
        break;
      case 'window':
        dimensions = { width: 80, height: 10 };
        break;
      case 'bar':
        dimensions = { width: 200, height: 60 };
        break;
      case 'service':
        dimensions = { width: 100, height: 100 };
        break;
      case 'stairs':
        dimensions = { width: 100, height: 50 };
        break;
      case 'other':
        dimensions = { width: 50, height: 50 };
        break;
      default:
        dimensions = { width: 50, height: 50 };
    }
    
    onAddObstacle({
      type,
      dimensions,
      position: { x: 100, y: 100 }, // Position par défaut
      rotation: 0
    });
    
    setShowObstacleOptions(false);
    onSelectTool('select');
  };
  
  // Permet de réinitialiser les options lorsqu'on change d'outil
  const handleToolSelect = (tool) => {
    onSelectTool(tool);
    setShowTableOptions(false);
    setShowObstacleOptions(false);
  };
  
  return (
    <div className="toolbar">
      <div className="tool-section">
        <h3>Outils</h3>
        <div className="tool-buttons">
          <button 
            className={`tool-btn ${selectedTool === 'select' ? 'active' : ''}`}
            onClick={() => handleToolSelect('select')}
            title="Sélectionner et déplacer"
          >
            <i className="fas fa-mouse-pointer"></i> Sélectionner
          </button>
          
          <button 
            className={`tool-btn ${selectedTool === 'pan' ? 'active' : ''}`}
            onClick={() => handleToolSelect('pan')}
            title="Déplacer le canevas"
          >
            <i className="fas fa-hand-paper"></i> Déplacer
          </button>
          
          <button 
            className={`tool-btn ${showTableOptions ? 'active' : ''}`}
            onClick={() => {
              setShowTableOptions(!showTableOptions);
              setShowObstacleOptions(false);
            }}
            title="Ajouter une table"
          >
            <i className="fas fa-plus-circle"></i> Ajouter Table
          </button>
          
          <button 
            className={`tool-btn ${showObstacleOptions ? 'active' : ''}`}
            onClick={() => {
              setShowObstacleOptions(!showObstacleOptions);
              setShowTableOptions(false);
            }}
            title="Ajouter un obstacle"
          >
            <i className="fas fa-ban"></i> Ajouter Obstacle
          </button>
          
          <button 
            className="tool-btn delete-btn"
            onClick={onDelete}
            disabled={!selectedElement}
            title="Supprimer l'élément sélectionné"
          >
            <i className="fas fa-trash"></i> Supprimer
          </button>
        </div>
      </div>
      
      {/* Options pour les tables */}
      {showTableOptions && (
        <div className="tool-options">
          <h4>Choisir une forme de table</h4>
          <div className="shape-options">
            {tableShapes.map(shape => (
              <button
                key={shape.id}
                className="shape-btn"
                onClick={() => handleAddTable(shape.id)}
                title={shape.label}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Options pour les obstacles */}
      {showObstacleOptions && (
        <div className="tool-options">
          <h4>Choisir un type d'obstacle</h4>
          <div className="shape-options">
            {obstacleTypes.map(type => (
              <button
                key={type.id}
                className="shape-btn"
                onClick={() => handleAddObstacle(type.id)}
                title={type.label}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section informative */}
      <div className="tool-section">
        <h3>Instructions</h3>
        <div className="instructions">
          <p><strong>Sélectionner</strong> : Cliquez sur un élément pour le sélectionner et modifier ses propriétés.</p>
          <p><strong>Déplacer</strong> : Cliquez et faites glisser le plan pour naviguer.</p>
          <p><strong>Zoom</strong> : Utilisez la molette de la souris pour zoomer/dézoomer.</p>
          <p><strong>Rotation</strong> : Sélectionnez un élément puis utilisez les poignées pour le faire pivoter.</p>
        </div>
      </div>

      {/* Afficher les infos de l'élément sélectionné */}
      {selectedElement && (
        <div className="selected-element-info">
          <h3>Élément sélectionné</h3>
          <div className="info-box">
            {selectedElement.type === 'table' ? (
              <>
                <p><strong>Type:</strong> Table n°{selectedElement.number}</p>
                <p><strong>Forme:</strong> {
                  selectedElement.shape === 'circle' ? 'Ronde' :
                  selectedElement.shape === 'square' ? 'Carrée' :
                  selectedElement.shape === 'rectangle' ? 'Rectangle' :
                  selectedElement.shape === 'oval' ? 'Ovale' : 'Inconnue'
                }</p>
                <p><strong>Capacité:</strong> {selectedElement.capacity} personnes</p>
              </>
            ) : (
              <>
                <p><strong>Type:</strong> {
                  selectedElement.type === 'wall' ? 'Mur' :
                  selectedElement.type === 'pillar' ? 'Pilier' :
                  selectedElement.type === 'door' ? 'Porte' :
                  selectedElement.type === 'window' ? 'Fenêtre' :
                  selectedElement.type === 'bar' ? 'Bar' :
                  selectedElement.type === 'service' ? 'Zone de service' :
                  selectedElement.type === 'stairs' ? 'Escalier' : 'Autre'
                }</p>
                <p><strong>Dimensions:</strong> {selectedElement.dimensions?.width}x{selectedElement.dimensions?.height}</p>
                {selectedElement.label && <p><strong>Étiquette:</strong> {selectedElement.label}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;