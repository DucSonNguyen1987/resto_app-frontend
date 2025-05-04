// src/components/floor/FloorPlanViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Group, Text, Line } from 'react-konva';
//import services from '../../services/serviceSwitch';

// Composants
import TableShape from '../../features/floor_editor/TableShape';
import ObstacleShape from '../../features/floor_editor/ObstacleShape';
import ReservationDetails from './ReservationDetails';
import DateSelector from '../common/DateSelector';

const FloorPlanViewer = () => {
  const { floorPlanId } = useParams();
  const navigate = useNavigate();
  const stageRef = useRef(null);
  
  // États pour les données
  const [floorPlan, setFloorPlan] = useState(null);
  const [tables, setTables] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour le zoom et le déplacement
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  
  // Charger les données du plan de salle
  useEffect(() => {
    const loadFloorPlan = async () => {
      try {
        setIsLoading(true);
        
        // Charger le plan de salle et ses tables
        const response = await services.floorPlan.getFloorPlanDetails(floorPlanId);
        
        if (response.success) {
          setFloorPlan(response.data.floorPlan);
          setTables(response.data.tables);
          setObstacles(response.data.floorPlan.obstacles || []);
        } else {
          setError(response.error || 'Erreur lors du chargement du plan de salle');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du plan:', error);
        setError('Impossible de charger le plan de salle');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (floorPlanId) {
      loadFloorPlan();
    }
  }, [floorPlanId]);
  
  // Charger les réservations pour la date sélectionnée
  useEffect(() => {
    const loadReservations = async () => {
      if (!floorPlanId || !selectedDate) return;
      
      try {
        // Formater la date au format YYYY-MM-DD
        const dateString = selectedDate.toISOString().split('T')[0];
        
        const response = await services.reservation.getReservations({
          date: dateString,
          floorPlan: floorPlanId
        });
        
        if (response.success) {
          setReservations(response.data);
          
          // Mettre à jour le statut des tables en fonction des réservations
          updateTableStatus(response.data);
        } else {
          console.error('Erreur lors du chargement des réservations:', response.error);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des réservations:', error);
      }
    };
    
    if (floorPlan) {
      loadReservations();
    }
  }, [floorPlanId, selectedDate, floorPlan]);
  
  // Mettre à jour le statut des tables en fonction des réservations
  const updateTableStatus = (reservationList) => {
    // Créer une map des IDs de tables réservées
    const reservedTableIds = new Map();
    
    // Parcourir toutes les réservations
    reservationList.forEach(reservation => {
      // Ignorer les réservations annulées ou terminées
      if (reservation.status === 'cancelled' || reservation.status === 'completed') return;
      
      // Pour chaque table de la réservation
      reservation.tables.forEach(tableId => {
        // Si la réservation est confirmée, la table est réservée
        if (reservation.status === 'confirmed') {
          reservedTableIds.set(tableId, 'reserved');
        }
        // Si le client est arrivé, la table est occupée
        else if (reservation.status === 'arrived') {
          reservedTableIds.set(tableId, 'occupied');
        }
        // Si la réservation est en attente, la table est en attente
        else if (reservation.status === 'pending') {
          // Ne pas écraser une réservation confirmée ou un client arrivé
          if (!reservedTableIds.has(tableId)) {
            reservedTableIds.set(tableId, 'pending');
          }
        }
      });
    });
    
    // Mettre à jour le statut des tables
    const updatedTables = tables.map(table => {
      if (reservedTableIds.has(table._id)) {
        return { ...table, status: reservedTableIds.get(table._id) };
      }
      // Si la table n'est pas réservée, elle est libre
      return { ...table, status: 'free' };
    });
    
    setTables(updatedTables);
  };
  
  // Gérer la sélection d'une table
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    
    // Trouver les réservations pour cette table
    const tableReservations = reservations.filter(reservation => 
      reservation.tables.some(tableId => tableId === table._id)
    );
    
    // Si la table a une réservation, la sélectionner
    if (tableReservations.length > 0) {
      setSelectedReservation(tableReservations[0]);
    } else {
      setSelectedReservation(null);
    }
  };
  
  // Gérer le zoom
  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
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
  
  // Créer une nouvelle réservation pour la table sélectionnée
  const handleCreateReservation = () => {
    if (selectedTable) {
      navigate(`/reservations/new?floorPlan=${floorPlanId}&table=${selectedTable._id}&date=${selectedDate.toISOString().split('T')[0]}`);
    }
  };
  
  // Afficher un état de chargement
  if (isLoading) {
    return <div className="loading">Chargement du plan de salle...</div>;
  }
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!floorPlan) {
    return <div>Aucun plan de salle trouvé</div>;
  }
  
  return (
    <div className="floor-plan-viewer">
      <div className="viewer-header">
        <h2>{floorPlan.name}</h2>
        <div className="date-selector-container">
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
      
      <div className="viewer-container">
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
              
              {/* Obstacles */}
              {obstacles.map((obstacle, i) => (
                <ObstacleShape
                  key={`obstacle-${i}`}
                  obstacle={obstacle}
                  draggable={false}
                />
              ))}
              
              {/* Tables */}
              {tables.map((table) => (
                <TableShape
                  key={`table-${table._id}`}
                  table={table}
                  isSelected={selectedTable && selectedTable._id === table._id}
                  onSelect={() => handleTableSelect(table)}
                  draggable={false}
                />
              ))}
              
              {/* Légende */}
              <Group x={10} y={floorPlan.dimensions.height - 70}>
                <Rect
                  width={150}
                  height={60}
                  fill="white"
                  opacity={0.8}
                  stroke="#cccccc"
                  cornerRadius={5}
                />
                
                <Group x={10} y={10}>
                  <Rect width={15} height={15} fill="#8bc34a" />
                  <Text text="Libre" x={20} y={2} fontSize={12} />
                </Group>
                
                <Group x={10} y={30}>
                  <Rect width={15} height={15} fill="#ffb74d" />
                  <Text text="Réservée" x={20} y={2} fontSize={12} />
                </Group>
                
                <Group x={80} y={10}>
                  <Rect width={15} height={15} fill="#ef5350" />
                  <Text text="Occupée" x={20} y={2} fontSize={12} />
                </Group>
                
                <Group x={80} y={30}>
                  <Rect width={15} height={15} fill="#90caf9" />
                  <Text text="En attente" x={20} y={2} fontSize={12} />
                </Group>
              </Group>
            </Layer>
          </Stage>
        </div>
        
        <div className="info-panel">
          {selectedTable ? (
            <div className="table-info">
              <h3>Table {selectedTable.number}</h3>
              <p>Capacité: {selectedTable.capacity} personnes</p>
              <p>Statut: {
                selectedTable.status === 'free' ? 'Libre' :
                selectedTable.status === 'reserved' ? 'Réservée' :
                selectedTable.status === 'occupied' ? 'Occupée' : 'En attente'
              }</p>
              
              {selectedReservation ? (
                <ReservationDetails
                  reservation={selectedReservation}
                  onEdit={() => navigate(`/reservations/edit/${selectedReservation._id}`)}
                />
              ) : (
                <div className="no-reservation">
                  <p>Aucune réservation pour cette table.</p>
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateReservation}
                  >
                    Créer une réservation
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <p>Sélectionnez une table pour voir ses détails et réservations.</p>
            </div>
          )}
          
          <div className="reservation-list">
            <h3>Réservations du jour</h3>
            {reservations.length === 0 ? (
              <p>Aucune réservation pour cette date.</p>
            ) : (
              <ul className="reservation-items">
                {reservations.map(reservation => (
                  <li
                    key={reservation._id}
                    className={`reservation-item ${reservation.status}`}
                    onClick={() => setSelectedReservation(reservation)}
                  >
                    <div className="reservation-time">
                      {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="reservation-info">
                      <span className="customer-name">
                        {reservation.user ? 
                          `${reservation.user.firstname} ${reservation.user.lastname}` : 
                          reservation.customerInfo.name}
                      </span>
                      <span className="guest-count">
                        {reservation.guests} personnes
                      </span>
                    </div>
                    <div className={`reservation-status ${reservation.status}`}>
                      {reservation.status === 'pending' ? 'En attente' :
                       reservation.status === 'confirmed' ? 'Confirmée' :
                       reservation.status === 'cancelled' ? 'Annulée' :
                       reservation.status === 'completed' ? 'Terminée' :
                       reservation.status === 'no-show' ? 'Non présenté' :
                       reservation.status === 'arrived' ? 'Arrivé' : 'Inconnue'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanViewer;