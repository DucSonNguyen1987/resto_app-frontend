// src/features/floor_editor/PropertiesPanel.jsx
import React, { useState, useEffect } from 'react';

const PropertiesPanel = ({ selectedElement, onElementUpdate }) => {
  const [formData, setFormData] = useState({});
  
  // Mettre à jour le formulaire quand l'élément sélectionné change
  useEffect(() => {
    if (selectedElement) {
      setFormData({ ...selectedElement });
    } else {
      setFormData({});
    }
  }, [selectedElement]);
  
  // Si aucun élément n'est sélectionné, afficher un message
  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h3>Propriétés</h3>
        <p className="no-selection">Sélectionnez un élément pour voir ses propriétés</p>
      </div>
    );
  }
  
  // Gérer les changements de champs du formulaire
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      // Convertir les nombres
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Gérer les changements de dimensions
  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [name]: parseFloat(value)
      }
    });
  };
  
  // Gérer les changements de position
  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      position: {
        ...formData.position,
        [name]: parseFloat(value)
      }
    });
  };
  
  // Soumettre les changements
  const handleSubmit = (e) => {
    e.preventDefault();
    onElementUpdate(formData);
  };
  
  // Afficher les champs en fonction du type d'élément
  return (
    <div className="properties-panel">
      <h3>Propriétés {selectedElement.type === 'table' ? 'de la table' : 'de l\'obstacle'}</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Champs communs */}
        <div className="form-group">
          <label>Position X</label>
          <input
            type="number"
            name="x"
            value={formData.position?.x || 0}
            onChange={handlePositionChange}
          />
        </div>
        
        <div className="form-group">
          <label>Position Y</label>
          <input
            type="number"
            name="y"
            value={formData.position?.y || 0}
            onChange={handlePositionChange}
          />
        </div>
        
        <div className="form-group">
          <label>Largeur</label>
          <input
            type="number"
            name="width"
            value={formData.dimensions?.width || 0}
            onChange={handleDimensionChange}
          />
        </div>
        
        <div className="form-group">
          <label>Hauteur</label>
          <input
            type="number"
            name="height"
            value={formData.dimensions?.height || 0}
            onChange={handleDimensionChange}
          />
        </div>
        
        {/* Champs spécifiques aux tables */}
        {selectedElement.type === 'table' && (
          <>
            <div className="form-group">
              <label>Numéro</label>
              <input
                type="number"
                name="number"
                value={formData.number || 0}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Capacité</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity || 0}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Forme</label>
              <select
                name="shape"
                value={formData.shape || 'circle'}
                onChange={handleInputChange}
              >
                <option value="circle">Ronde</option>
                <option value="square">Carrée</option>
                <option value="rectangle">Rectangle</option>
                <option value="oval">Ovale</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Statut</label>
              <select
                name="status"
                value={formData.status || 'free'}
                onChange={handleInputChange}
              >
                <option value="free">Libre</option>
                <option value="reserved">Réservée</option>
                <option value="occupied">Occupée</option>
              </select>
            </div>
          </>
        )}
        
        {/* Champs spécifiques aux obstacles */}
        {selectedElement.type === 'obstacle' && (
          <>
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type || 'wall'}
                onChange={handleInputChange}
              >
                <option value="wall">Mur</option>
                <option value="pillar">Pilier</option>
                <option value="door">Porte</option>
                <option value="window">Fenêtre</option>
                <option value="bar">Bar</option>
                <option value="service">Zone de service</option>
                <option value="stairs">Escalier</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Étiquette</label>
              <input
                type="text"
                name="label"
                value={formData.label || ''}
                onChange={handleInputChange}
                placeholder="Optionnel"
              />
            </div>
            
            <div className="form-group">
              <label>Rotation (degrés)</label>
              <input
                type="number"
                name="rotation"
                value={formData.rotation || 0}
                onChange={handleInputChange}
                step="15"
              />
            </div>
            
            <div className="form-group">
              <label>Couleur</label>
              <input
                type="color"
                name="color"
                value={formData.color || '#808080'}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Appliquer les changements
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertiesPanel;