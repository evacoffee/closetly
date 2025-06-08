'use client';

import * as React from 'react';
const { useState } = React;

// Define types for clothing items
interface ClothingItem {
  id: number;
  name: string;
  category: string;
  color: string;
  season: string;
  favorite: boolean;
  image?: string;
}

// Mock data for clothing items
const initialClothingItems: ClothingItem[] = [
  { id: 1, name: 'Blue Denim Jacket', category: 'Outerwear', color: 'blue', season: 'Spring', favorite: true },
  { id: 2, name: 'White T-Shirt', category: 'Tops', color: 'white', season: 'All', favorite: false },
  { id: 3, name: 'Black Jeans', category: 'Bottoms', color: 'black', season: 'All', favorite: true },
  { id: 4, name: 'Floral Summer Dress', category: 'Dresses', color: 'multicolor', season: 'Summer', favorite: false },
  { id: 5, name: 'Gray Hoodie', category: 'Outerwear', color: 'gray', season: 'Fall', favorite: false },
  { id: 6, name: 'Khaki Chinos', category: 'Bottoms', color: 'beige', season: 'Spring', favorite: false },
  { id: 7, name: 'Red Sweater', category: 'Tops', color: 'red', season: 'Winter', favorite: true },
  { id: 8, name: 'Black Leather Boots', category: 'Footwear', color: 'black', season: 'Fall', favorite: true },
];

// Available filters
const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Footwear', 'Accessories'];
const colors = ['All', 'black', 'white', 'blue', 'red', 'gray', 'beige', 'multicolor'];
const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter'];

const ClothingItemCard = ({ item, onToggleFavorite }: { item: ClothingItem; onToggleFavorite: (id: number) => void }) => {
  return (
    <div className="wardrobe-item p-4 hover-lift">
      <div className={`aspect-square mb-3 rounded-md bg-${item.color === 'multicolor' ? 'gradient-to-r from-pink-200 via-purple-200 to-blue-200' : item.color}-100 flex items-center justify-center`}>
        <span className="text-4xl">👕</span>
      </div>
      <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
      <div className="flex items-center justify-between">
        <span className="badge badge-primary">{item.category}</span>
        <button 
          onClick={() => onToggleFavorite(item.id)}
          className="text-sm text-neutral-400 hover:text-accent"
        >
          {item.favorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
};

const AddItemCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="wardrobe-item aspect-square flex flex-col items-center justify-center p-4 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <span className="text-3xl mb-2 text-primary/70">+</span>
      <span className="text-sm text-neutral-500">Add New Item</span>
    </button>
  );
};

export default function WardrobePage() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(initialClothingItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [colorFilter, setColorFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<ClothingItem>({ 
    id: 0,
    name: '', 
    category: 'Tops', 
    color: 'black', 
    season: 'All', 
    favorite: false 
  });

  // Filter items based on search and filters
  const filterItems = (items: ClothingItem[]) => {
    return items.filter((item: ClothingItem) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesColor = colorFilter === 'All' || item.color === colorFilter;
      const matchesSeason = seasonFilter === 'All' || item.season === seasonFilter;
      const matchesFavorite = !showFavoritesOnly || item.favorite;
      
      return matchesSearch && matchesCategory && matchesColor && matchesSeason && matchesFavorite;
    });
  };

  const handleToggleFavorite = (id: number) => {
    setClothingItems((items: ClothingItem[]) => 
      items.map((item: ClothingItem) => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(0, ...clothingItems.map((item: ClothingItem) => item.id)) + 1;
    setClothingItems([...clothingItems, { ...newItem, id: newId }]);
    setShowAddModal(false);
    setNewItem({ id: 0, name: '', category: 'Tops', color: 'black', season: 'All', favorite: false });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Wardrobe</h1>
          <p className="text-neutral-600 max-w-2xl">
            Organize and manage your clothing collection. Add new items, filter by category, and find the perfect piece for any outfit.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search items..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <select 
                className="form-input py-1 px-2" 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                className="form-input py-1 px-2" 
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              
              <select 
                className="form-input py-1 px-2" 
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
              >
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
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
      
      {/* Clothing Items Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{filterItems(clothingItems).length} Items</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-sm btn-primary"
          >
            + Add New Item
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filterItems(clothingItems).map((item: ClothingItem) => (
            <ClothingItemCard
              key={item.id}
              item={item}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
          <AddItemCard onClick={() => setShowAddModal(true)} />
        </div>
        
        {filterItems(clothingItems).length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No items match your filters. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      
      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add New Item</h3>
            
            <form onSubmit={handleAddItem}>
              <div className="mb-4">
                <label className="form-label" htmlFor="name">Item Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label" htmlFor="category">Category</label>
                <select
                  id="category"
                  className="form-input"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="form-label" htmlFor="color">Color</label>
                  <select
                    id="color"
                    className="form-input"
                    value={newItem.color}
                    onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                  >
                    {colors.filter(c => c !== 'All').map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="form-label" htmlFor="season">Season</label>
                  <select
                    id="season"
                    className="form-input"
                    value={newItem.season}
                    onChange={(e) => setNewItem({...newItem, season: e.target.value})}
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newItem.favorite}
                    onChange={(e) => setNewItem({...newItem, favorite: e.target.checked})}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="form-label mb-0">Mark as favorite</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn-sm btn-outline" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-sm btn-primary">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
