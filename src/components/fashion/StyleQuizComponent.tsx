'use client';

import React, { useState, useRef, useCallback, ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgeProfile, AgeProfileSelector } from './AgeProfileSelector';
import { StyleDefinition, fashionStyles } from '@/config/styles';
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react';

interface StyleCardProps {
  style: StyleDefinition;
  selected: boolean;
  onSelect: (styleId: string) => void;
  disabled?: boolean;
}

const StyleCard: React.FC<StyleCardProps> = ({ style, selected, onSelect, disabled }) => (
  <div 
    className={`relative overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={() => !disabled && onSelect(style.id)}
  >
    <div className="aspect-square bg-muted flex items-center justify-center">
      {style.imageUrl ? (
        <img 
          src={style.imageUrl} 
          alt={style.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="p-4 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">{style.name}</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{style.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{style.description}</p>
        </div>
        {selected && (
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  </div>
);

interface StyleQuizComponentProps {
  onComplete: (selectedStyles: StyleDefinition[], ageProfile: AgeProfile, bodyPhoto?: string) => void;
  maxSelections?: number;
  ageProfile?: AgeProfile;
  disabled?: boolean;
}

export const StyleQuizComponent: React.FC<StyleQuizComponentProps> = ({
  onComplete,
  maxSelections = 5,
  ageProfile: initialAgeProfile,
  disabled = false,
}) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ageProfile, setAgeProfile] = useState<AgeProfile | null>(initialAgeProfile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDropRef = useRef<HTMLDivElement>(null);

  const filteredStyles = fashionStyles.filter(style =>
    style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    style.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStyleSelect = useCallback((styleId: string) => {
    if (disabled) return;
    
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId);
      }
      if (prev.length >= maxSelections) {
        return prev;
      }
      return [...prev, styleId];
    });
  }, [disabled, maxSelections]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  }, []);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setBodyPhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleComplete = () => {
    if (!ageProfile) return;
    
    const selectedStyleDefs = selectedStyles
      .map(id => fashionStyles.find(style => style.id === id))
      .filter((style): style is StyleDefinition => style !== undefined);
    
    onComplete(selectedStyleDefs, ageProfile, bodyPhoto || undefined);
  };

  const selectedStyleDefs = selectedStyles
    .map(id => fashionStyles.find(style => style.id === id))
    .filter((style): style is StyleDefinition => style !== undefined);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="style-search">Search Styles</Label>
          <Input
            id="style-search"
            type="text"
            placeholder="Search for styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            className="mt-1"
          />
        </div>

        <AgeProfileSelector
          selectedAgeProfile={ageProfile}
          onSelect={setAgeProfile}
          disabled={disabled}
        />

        <div className="space-y-2">
          <Label>Upload Body Photo (Optional)</Label>
          <div
            ref={fileDropRef}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
