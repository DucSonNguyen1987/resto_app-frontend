// src/components/floor/NewFloorPlanModal.jsx
import React, { useState } from 'react';
import FloorPlanEditor from '../../features/floor_editor/FloorPlanEditor';
import SeatingEditor from '../../features/floor_editor/SeatingEditor';


const NewFloorPlanModal = ({ onClose, onSave }) => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dimensions: {
      width: 800,
      height: 600,
      unit: 'pixels'
    },
    status: 'draft'
  });

  // État pour la validation du formulaire
  const [errors, setErrors] = useState({});

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Gérer les changements dans les dimensions
  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [name]: name === 'unit' ? value : parseInt(value, 10)
      }
    });

    // Effacer l'erreur pour ce champ
    if (errors[`dimensions.${name}`]) {
      setErrors({
        ...errors,
        [`dimensions.${name}`]: null
      });
    }
  };

  // Valider le formulaire avant la soumission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (formData.dimensions.width < 100) {
      newErrors['dimensions.width'] = 'La largeur doit être d\'au moins 100';
    }

    if (formData.dimensions.height < 100) {
      newErrors['dimensions.height'] = 'La hauteur doit être d\'au moins 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Créer un nouveau plan de salle</h3>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Nom du plan *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'has-error' : ''}
                required
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>


            <div className='modal-content'>
              <SeatingEditor />
            </div>


            <div className="form-group">
              <label htmlFor="status">Statut initial</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Créer le plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFloorPlanModal;