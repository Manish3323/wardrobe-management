import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { ClothingItem } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DraggableItemProps {
  item: ClothingItem;
}

const DraggableItem = ({ item }: DraggableItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CLOTHING',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`relative aspect-square rounded-lg overflow-hidden shadow-sm cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-2 text-sm">
        {item.name}
      </div>
    </div>
  );
};

const BodyModel = () => {
  const [outfit, setOutfit] = useState<{
    head: ClothingItem | null;
    torso: ClothingItem | null;
    legs: ClothingItem | null;
    feet: ClothingItem | null;
  }>({
    head: null,
    torso: null,
    legs: null,
    feet: null
  });

  const renderDropZone = (zone: keyof typeof outfit) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'CLOTHING',
      drop: (item: ClothingItem) => {
        setOutfit(prev => ({
          ...prev,
          [zone]: item
        }));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    const item = outfit[zone];

    return (
      <div
        ref={drop}
        className={`absolute ${getZoneStyle(zone)} ${
          isOver ? 'bg-blue-100' : 'bg-gray-100'
        } ${getZoneShape(zone)} border-2 border-dashed ${
          item ? 'border-transparent' : 'border-gray-300'
        } transition-colors duration-200`}
      >
        {item ? (
          <div className="relative w-full h-full group">
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            <button
              onClick={() => setOutfit(prev => ({ ...prev, [zone]: null }))}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Drop {zone}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-[16rem] sm:max-w-[20rem] h-[24rem] sm:h-[30rem] mx-auto">
      {/* Silhouette background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <path
            d="M50,10 
                C45,10 40,15 40,20 
                C40,25 45,30 50,30 
                C55,30 60,25 60,20 
                C60,15 55,10 50,10 
                M40,30 
                C35,35 35,40 35,45 
                L40,65 
                L35,90 
                L40,120 
                L45,140 
                L50,145 
                L55,140 
                L60,120 
                L65,90 
                L60,65 
                L65,45 
                C65,40 65,35 60,30"
            fill="#000"
          />
        </svg>
      </div>
      {renderDropZone('head')}
      {renderDropZone('torso')}
      {renderDropZone('legs')}
      {renderDropZone('feet')}
    </div>
  );
};

const getZoneStyle = (zone: string): string => {
  switch (zone) {
    case 'head':
      return 'top-[2%] left-1/2 -translate-x-1/2 w-[25%] aspect-square';
    case 'torso':
      return 'top-[22%] left-1/2 -translate-x-1/2 w-[45%] h-[35%]';
    case 'legs':
      return 'top-[57%] left-1/2 -translate-x-1/2 w-[35%] h-[30%]';
    case 'feet':
      return 'bottom-[2%] left-1/2 -translate-x-1/2 w-[30%] h-[10%]';
    default:
      return '';
  }
};

const getZoneShape = (zone: string): string => {
  switch (zone) {
    case 'head':
      return 'rounded-full';
    case 'torso':
      return 'rounded-xl';
    case 'legs':
      return 'rounded-t-lg rounded-b-xl';
    case 'feet':
      return 'rounded-lg';
    default:
      return 'rounded-lg';
  }
};

export default function OutfitPlanner() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from('clothing_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load items');
      return;
    }

    setItems(data || []);
  }

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold">Outfit Planner</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <BodyModel />
        </div>
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Your Items</h3>
            <select
              className="w-full px-3 py-2 border rounded-lg mb-4"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dresses">Dresses</option>
              <option value="outerwear">Outerwear</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {filteredItems.map((item) => (
                <DraggableItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}