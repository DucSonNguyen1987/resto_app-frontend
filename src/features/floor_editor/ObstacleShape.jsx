// src/features/floor_editor/ObstacleShape.jsx
import React, { useRef, useEffect } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';

const ObstacleShape = ({ obstacle, isSelected, onSelect, onDragEnd, draggable }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  
  // Mise à jour du transformer lorsque l'obstacle est sélectionné
  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  
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
    
    return colorMap[type] || obstacle.color || '#808080';
  };
  
  // Rendu de l'obstacle en fonction du type
  const renderObstacleShape = () => {
    const { type, dimensions } = obstacle;
    const color = getObstacleColor(type);
    
    // Formes spécifiques selon le type d'obstacle
    return (
      <Rect
        width={dimensions.width}
        height={dimensions.height}
        fill={color}
        opacity={0.9}
        stroke="#333"
        strokeWidth={1}
        cornerRadius={type === 'pillar' ? dimensions.width / 2 : 0}
      />
    );
  };
  
  return (
    <>
      <Group
        x={obstacle.position.x}
        y={obstacle.position.y}
        rotation={obstacle.rotation || 0}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd({
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        ref={shapeRef}
      >
        {renderObstacleShape()}
        
        {/* Étiquette de l'obstacle si elle existe */}
        {obstacle.label && (
          <Text
            text={obstacle.label}
            fontSize={12}
            fontStyle="bold"
            fill="#fff"
            width={obstacle.dimensions.width}
            height={obstacle.dimensions.height}
            align="center"
            verticalAlign="middle"
          />
        )}
      </Group>
      
      {/* Transformer pour redimensionner/tourner l'obstacle */}
      {isSelected && (
        <Transformer
          ref={trRef}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            // Limiter le redimensionnement à un minimum
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          onTransformEnd={(e) => {
            // Mettre à jour les dimensions quand le redimensionnement est terminé
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            
            // Réinitialiser les échelles
            node.scaleX(1);
            node.scaleY(1);
            
            onDragEnd({
              x: node.x(),
              y: node.y()
            });
            
            // Mettre à jour l'obstacle avec les nouvelles dimensions
            const updatedObstacle = {
              ...obstacle,
              dimensions: {
                width: Math.round(node.width() * scaleX),
                height: Math.round(node.height() * scaleY)
              },
              rotation: node.rotation()
            };
            
            // Appeler la fonction de mise à jour du parent
            onSelect(updatedObstacle);
          }}
        />
      )}
    </>
  );
};

export default ObstacleShape;