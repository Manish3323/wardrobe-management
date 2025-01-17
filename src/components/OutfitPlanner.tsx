import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { ClothingItem } from '../types';

const BodyModel = () => {
  const [outfit, setOutfit] = useState({
    head: null,
    torso: null,
    legs: null,
    feet: null
  });

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'CLOTHING',
    drop: (item: ClothingItem, monitor) => {
      const dropTarget = monitor.getDropResult();
      if (dropTarget) {
        setOutfit(prev => ({
          ...prev,
          [dropTarget]: item
        }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} className="relative w-full max-w-[16rem] sm:max-w-[20rem] h-[24rem] sm:h-[30rem] mx-auto bg-gray-100 rounded-lg">
      {/* Simple body outline */}
      <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 w-[25%] aspect-square rounded-full border-2 border-gray-300" />
      <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 w-[50%] h-[30%] rounded-lg border-2 border-gray-300" />
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 w-[40%] h-[35%] rounded-lg border-2 border-gray-300" />
      <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-[35%] h-[10%] rounded-lg border-2 border-gray-300" />
      
      {/* Dropped items */}
      {Object.entries(outfit).map(([zone, item]) => (
        item && (
          <div key={zone} className="absolute" style={getZoneStyle(zone)}>
            <img src={(item as ClothingItem).image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )
      ))}
    </div>
  );
};

const getZoneStyle = (zone: string) => {
  const baseStyles = {
    left: '50%',
    transform: 'translateX(-50%)',
  };

  switch (zone) {
    case 'head':
      return { ...baseStyles, top: '5%', width: '25%', height: '20%' };
    case 'torso':
      return { ...baseStyles, top: '25%', width: '50%', height: '30%' };
    case 'legs':
      return { ...baseStyles, top: '55%', width: '40%', height: '35%' };
    case 'feet':
      return { ...baseStyles, bottom: '5%', width: '35%', height: '10%' };
    default:
      return {};
  }
};

export default function OutfitPlanner() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold">Outfit Planner</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <BodyModel />
        </div>
        <div className="w-full lg:w-1/3">
          <h3 className="text-xl font-semibold mb-4">Saved Outfits</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-500 text-sm">No saved outfits yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}