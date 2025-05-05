// src/features/floor_plans/CreateFloorPlan.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../../services/serviceSwitch';

const CreateFloorPlan = () => {
  const navigate = useNavigate();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    restaurantId: 'rest1', // ID du restaurant par défaut
    dimensions: {
      width: 800,
      height: 600
    },
    capacity: 50
  });
  
  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Gérer les changements de dimensions
  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [name]: parseInt(value)
      }
    });
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validation des données
      if (!formData.name) {
        throw new Error('Le nom du plan est requis');
      }
      
      if (formData.dimensions.width < 300 || formData.dimensions.height < 300) {
        throw new Error('Les dimensions minimales sont de 300x300');
      }
      
      if (formData.capacity < 1) {
        throw new Error('La capacité doit être d\'au moins 1 place');
      }
      
      // Créer le plan de salle
      const response = await services.floorPlan.createFloorPlan({
        ...formData,
        obstacles: [] // Pas d'obstacles initialement
      });
      
      if (response.success) {
        // Rediriger vers l'éditeur du nouveau plan
        navigate(`/floor-plans/edit/${response.data.floorPlan._id}`);
      } else {
        throw new Error(response.error || 'Erreur lors de la création du plan');
      }
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      setError(error.message || 'Erreur lors de la création du plan');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="create-floor-plan-container">
      <div className="header">
        <h1>Créer un nouveau plan de salle</h1>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="floor-plan-form">
        <div className="form-group">
          <label htmlFor="name">Nom du plan</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Salle principale"
            required
          />
        </div>
        
        <div className="form-section">
          <h3>Dimensions</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="width">Largeur (px)</label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.dimensions.width}
                onChange={handleDimensionChange}
                min="300"
                max="2000"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Hauteur (px)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.dimensions.height}
                onChange={handleDimensionChange}
                min="300"
                max="2000"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="capacity">Capacité (nombre de places)</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création en cours...' : 'Créer le plan'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/floor-plans')}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        </div>
      </form>
      
      <div className="preview">
        <h3>Aperçu</h3>
        <div 
          className="dimensions-preview"
          style={{
            width: `${Math.min(formData.dimensions.width / 10, 300)}px`,
            height: `${Math.min(formData.dimensions.height / 10, 200)}px`,
            border: '1px solid #ccc',
            backgroundColor: '#f5f5f5',
            position: 'relative'
          }}
        >
          <div className="preview-label">{formData.name || 'Nom du plan'}</div>
          <div className="preview-dimensions">
            {formData.dimensions.width} x {formData.dimensions.height}
          </div>
          <div className="preview-capacity">
            {formData.capacity} places
          </div>
        </div>
        <p className="preview-note">
          Note: Vous pourrez ajouter des tables et des obstacles dans l'éditeur après avoir créé le plan.
        </p>
      </div>
    </div>
  );
};

export default CreateFloorPlan;