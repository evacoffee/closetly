'use client';

import * as React from 'react';
const { useState, useEffect } = React;
import Link from 'next/link';

interface OutfitItem {
  id: number;
  name: string;
  description: string;
  season: string;
  occasion: string;
  items: string[];
  color: string;
  favorite: boolean;
  createdAt: string;
}

const initialOutfits: OutfitItem[] = [
  {
    id: 1,
    name: 'Casual Friday',
    description: 'Perfect for a relaxed day at the office',
    season: 'All',
    occasion: 'Work',
    items: ['Blue Denim Jacket', 'White T-Shirt', 'Black Jeans', 'Black Leather Boots'],
    color: 'blue',
    favorite: true,
    createdAt: '2025-05-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Weekend Brunch',
    description: 'Stylish and comfortable for weekend outings',
    season: 'Spring',
    occasion: 'Casual',
    items: ['White T-Shirt', 'Khaki Chinos', 'White Sneakers'],
    color: 'beige',
    favorite: false,
    createdAt: '2025-05-20T14:45:00Z'
  },
  {
    id: 3,
    name: 'Evening Dinner',
    description: 'Elegant outfit for dinner dates',
    season: 'All',
    occasion: 'Date',
    items: ['Black Blazer', 'White Dress Shirt', 'Black Jeans', 'Black Leather Boots'],
    color: 'black',
    favorite: true,
    createdAt: '2025-05-25T18:15:00Z'
  },
  {
    id: 4,
    name: 'Summer Festival',
    description: 'Fun and vibrant for outdoor events',
    season: 'Summer',
    occasion: 'Party',
    items: ['Floral Summer Dress', 'Straw Hat', 'Sandals'],
    color: 'multicolor',
    favorite: false,
    createdAt: '2025-06-01T09:20:00Z'
  },
];

const seasons = ['All Seasons', 'Spring', 'Summer', 'Fall', 'Winter', 'All'];
const occasions = ['All Occasions', 'Work', 'Casual', 'Date', 'Party', 'Formal', 'Sport'];

const OutfitCard = ({ outfit, onToggleFavorite }: { outfit: OutfitItem; onToggleFavorite: (id: number) => void }) => {
  return (
    <div className="outfit-card hover-lift bg-white rounded-lg overflow-hidden shadow-md transition-all">
      <div 
        className={`aspect-[3/4] relative ${outfit.color === 'multicolor' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : `bg-${outfit.color}-100`}`}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className="badge badge-primary">{outfit.occasion}</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(outfit.id);
              }}
              className="text-xl text-white drop-shadow-md hover:text-accent transition-colors"
              aria-label={outfit.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {outfit.favorite ? '★' : '☆'}
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg">
            <h3 className="font-bold text-lg mb-1">{outfit.name}</h3>
            <p className="text-sm text-neutral-600 line-clamp-2">{outfit.description}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-neutral-500 mb-1">Items:</h4>
          <ul className="text-sm">
            {outfit.items.slice(0, 3).map((item: string, index) => (
              <li key={index} className="truncate">{item}</li>
            ))}
            {outfit.items.length > 3 && (
              <li className="text-neutral-400">+{outfit.items.length - 3} more</li>
            )}
          </ul>
        </div>
        
        <div className="flex justify-between items-center text-xs text-neutral-500">
          <span>{outfit.season}</span>
          <span>{new Date(outfit.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const CreateOutfitCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="outfit-card aspect-[3/4] flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <span className="text-4xl mb-3 text-primary/70">+</span>
      <span className="text-lg font-medium text-neutral-600">Create New Outfit</span>
      <p className="text-sm text-neutral-400 mt-2 text-center">Mix and match items from your wardrobe</p>
    </button>
  );
};

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All Seasons');
  const [occasionFilter, setOccasionFilter] = useState('All Occasions');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOutfits = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setOutfits(initialOutfits);
      setIsLoading(false);
    };
    
    loadOutfits();
  }, []);

  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = 
      outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSeason = seasonFilter === 'All Seasons' || outfit.season === seasonFilter || outfit.season === 'All';
    const matchesOccasion = occasionFilter === 'All Occasions' || outfit.occasion === occasionFilter;
    const matchesFavorite = !showFavoritesOnly || outfit.favorite;
    
    return matchesSearch && matchesSeason && matchesOccasion && matchesFavorite;
  });

  const handleToggleFavorite = (id: number) => {
    setOutfits(outfits.map((outfit: OutfitItem) => 
      outfit.id === id ? { ...outfit, favorite: !outfit.favorite } : outfit
    ));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search outfits..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <select 
                className="form-input py-1 px-2" 
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
              >
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
              
              <select 
                className="form-input py-1 px-2" 
                value={occasionFilter}
                onChange={(e) => setOccasionFilter(e.target.value)}
              >
                {occasions.map(occasion => (
                  <option key={occasion} value={occasion}>{occasion}</option>
                ))}
              </select>
              
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={showFavoritesOnly}
                  onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="rounded text-primary focus:ring-primary"
                />
                Favorites only
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Create New Outfit</h3>
            <p className="mb-4">This feature would allow you to select items from your wardrobe to create a new outfit.</p>
            
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                className="btn-sm btn-outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Close
              </button>
              <Link href="/wardrobe" className="btn-sm btn-primary">
                Go to Wardrobe
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
