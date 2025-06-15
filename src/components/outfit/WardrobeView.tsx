'use client';

import * as React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Search, X, Edit, Trash2, Image as ImageIcon, Shirt, Calendar, DollarSign, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ClothingItem = {
  id: string;
  name: string;
  type: string;
  color: string;
  brand: string;
  imageUrl: string;
  brandLogo?: string;
  price?: number;
  purchaseDate?: string;
  isFavorite: boolean;
  tags: string[];
};

type WardrobeTab = 'all' | 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'favorites';

const CLOTHING_TYPES = [
  { value: 'top', label: 'Tops' },
  { value: 'bottom', label: 'Bottoms' },
  { value: 'dress', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessories' },
];

const COLORS = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gray', label: 'Gray' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Purple' },
  { value: 'brown', label: 'Brown' },
];

// Mock data
const MOCK_WARDROBE: ClothingItem[] = [
  {
    id: '1',
    name: 'White T-Shirt',
    type: 'top',
    color: 'white',
    brand: 'Nike',
    imageUrl: 'https://example.com/tshirt.jpg',
    brandLogo: 'https://logo.clearbit.com/nike.com',
    price: 29.99,
    purchaseDate: '2023-05-15',
    isFavorite: true,
    tags: ['casual', 'summer']
  },
  {
    id: '2',
    name: 'Blue Jeans',
    type: 'bottom',
    color: 'blue',
    brand: 'Levi\'s',
    imageUrl: 'https://example.com/jeans.jpg',
    brandLogo: 'https://logo.clearbit.com/levi.com',
    price: 89.99,
    purchaseDate: '2023-04-20',
    isFavorite: true,
    tags: ['casual', 'everyday']
  },
  // Add more mock items as needed
];

export function WardrobeView() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = React.useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<WardrobeTab>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    type: '',
    color: '',
    minPrice: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Form state for add/edit item
  const [currentItem, setCurrentItem] = React.useState<Partial<ClothingItem> | null>(null);

  // Load items on mount
  React.useEffect(() => {
    const loadItems = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setItems(MOCK_WARDROBE);
        setFilteredItems(MOCK_WARDROBE);
      } catch (error) {
        console.error('Failed to load wardrobe:', error);
        toast({
          title: 'Error',
          description: 'Failed to load wardrobe items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [toast]);

  // Apply filters and search
  React.useEffect(() => {
    let result = [...items];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (activeTab !== 'all') {
      result = result.filter(item => item.type === activeTab);
    }

    // Apply additional filters
    if (filters.type) {
      result = result.filter(item => item.type === filters.type);
    }
    if (filters.color) {
      result = result.filter(item => item.color === filters.color);
    }
    if (filters.minPrice) {
      result = result.filter(item => (item.price || 0) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(item => (item.price || 0) <= Number(filters.maxPrice));
    }

    setFilteredItems(result);
  }, [items, searchQuery, activeTab, filters]);

  const handleAddItem = () => {
    setCurrentItem({
      id: '',
      name: '',
      type: '',
      color: '',
      brand: '',
      imageUrl: '',
      price: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      tags: [],
    });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: ClothingItem) => {
    setCurrentItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setItems(prev => prev.filter(item => item.id !== id));
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
      } catch (error) {
        console.error('Failed to delete item:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete item',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSaveItem = async () => {
    if (!currentItem) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (currentItem.id) {
        // Update existing item
        setItems(prev =>
          prev.map(item => (item.id === currentItem.id ? { ...item, ...currentItem } as ClothingItem : item))
        );
        toast({
          title: 'Success',
          description: 'Item updated successfully',
        });
      } else {
        // Add new item
        const newItem: ClothingItem = {
          ...currentItem,
          id: Math.random().toString(36).substr(2, 9),
          isFavorite: false,
          tags: [],
        } as ClothingItem;
        
        setItems(prev => [...prev, newItem]);
        toast({
          title: 'Success',
          description: 'Item added to wardrobe',
        });
      }
      
      setIsDialogOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Failed to save item:', error);
      toast({
        title: 'Error',
        description: 'Failed to save item',
        variant: 'destructive',
      });
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      color: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-2xl font-bold">My Wardrobe</h2>
        
        <div className="flex flex-1 max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {CLOTHING_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="color-filter">Color</Label>
              <Select
                value={filters.color}
                onValueChange={(value) => setFilters({ ...filters, color: value })}
              >
                <SelectTrigger id="color-filter">
                  <SelectValue placeholder="All colors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Colors</SelectItem>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-4 w-4 rounded-full border" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="min-price">Min Price</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="$"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="max-price">Max Price</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="$"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as WardrobeTab)}
        className="px-4"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="top">Tops</TabsTrigger>
          <TabsTrigger value="bottom">Bottoms</TabsTrigger>
          <TabsTrigger value="dress">Dresses</TabsTrigger>
          <TabsTrigger value="shoes">Shoes</TabsTrigger>
          <TabsTrigger value="accessory">Accessories</TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="h-4 w-4 mr-1" /> Favorites
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Shirt className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters'
              : 'Add your first item to get started'}
          </p>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="aspect-square bg-muted relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm ${
                    item.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'
                  }`}
                >
                  <Star 
                    className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} 
                  />
                </button>
                
                {item.brandLogo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <img 
                      src={item.brandLogo} 
                      alt={item.brand}
                      className="h-3 object-contain w-full"
                    />
                  </div>
                )}
              </div>
              
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {CLOTHING_TYPES.find(t => t.value === item.type)?.label || item.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.color.charAt(0).toUpperCase() + item.color.slice(1)}
                  </Badge>
                </div>
                
                {(item.price || item.purchaseDate) && (
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    {item.price && (
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {item.price.toFixed(2)}
                      </div>
                    )}
                    {item.purchaseDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentItem?.id ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {currentItem?.id ? 'Update the item details' : 'Add a new item to your wardrobe'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., White T-Shirt"
                value={currentItem?.name || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={currentItem?.type || ''}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLOTHING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={currentItem?.color || ''}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, color: value })}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border" 
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Nike"
                value={currentItem?.brand || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, brand: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={currentItem?.imageUrl || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={currentItem?.price || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={currentItem?.purchaseDate?.toString().split('T')[0] || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, purchaseDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {currentItem?.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => {
                        const newTags = [...(currentItem.tags || [])];
                        newTags.splice(index, 1);
                        setCurrentItem({ ...currentItem, tags: newTags });
                      }}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="flex-1 min-w-[100px] bg-transparent outline-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      const newTag = e.currentTarget.value.trim();
                      setCurrentItem({
                        ...currentItem,
                        tags: [...(currentItem?.tags || []), newTag],
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {currentItem?.id ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}