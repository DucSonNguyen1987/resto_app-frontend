// src/features/floor_editor/TableShape.jsx
import React from 'react';
import { Group, Circle, Rect, Text, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';

const TableShape = ({ table, isSelected, onSelect, onDragEnd, draggable }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  
  // Mise à jour du transformer lorsque la table est sélectionnée
  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  
  // Rendu de la forme en fonction du type de table
  const renderTableShape = () => {
    const { shape, dimensions, status } = table;
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
            height={dimensions.width} // Utilise width pour garder un cercle parfait
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
            height={dimensions.width} // Utilise width pour garder un carré parfait
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
  
  return (
    <>
      <Group
        x={table.position.x}
        y={table.position.y}
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
        {renderTableShape()}
        
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
        
        {/* Capacité de la table (nombre de places) */}
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
      
      {/* Transformer pour redimensionner/tourner la table */}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limiter le redimensionnement à un minimum
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TableShape;