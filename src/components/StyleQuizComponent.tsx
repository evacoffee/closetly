'use client';

import React, { useCallback, useRef, useState, KeyboardEvent } from 'react';
import { StyleCard } from './StyleCard';
import { fashionStyles, StyleDefinition } from '@/config/styles';
import { AgeProfile } from './AgeProfileSelector';

interface StyleCardProps {
  style: StyleDefinition;
  selected: boolean;
  onSelect: (styleId: string) => void;
  disabled?: boolean;
}

interface StyleQuizProps {
  onComplete: (selectedStyles: StyleDefinition[], ageProfile: AgeProfile, bodyPhoto?: string) => void;
  maxSelections?: number;
  ageProfile?: AgeProfile;
  disabled?: boolean;
}

const StyleQuiz = ({ 
  onComplete, 
  maxSelections = 5, 
  ageProfile,
  disabled = false
}: StyleQuizProps) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDropRef = useRef<HTMLDivElement>(null);

  const filteredStyles = fashionStyles.filter(style =>
    style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    style.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStyleSelect = (styleId: string) => {
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
  };

  const handleKeyDown = (e: KeyboardEvent, styleId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStyleSelect(styleId);
    }
  };

  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBodyPhoto(reader.result as string);
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setBodyPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handlePhotoUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (disabled || !ageProfile) return;
    
    const selectedStyleObjects = fashionStyles.filter(style =>
      selectedStyles.includes(style.id)
    );
    
    onComplete(selectedStyleObjects, ageProfile, bodyPhoto || undefined);
  };

  const handleKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="max-w-7xl mx-auto container-padding" ref={fileDropRef}>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-satisfy text-4xl mb-4">Discover Your Personal Style</h1>
        <p className="text-lg font-amatic mb-6">
          Choose up to {maxSelections} styles that resonate with your fashion sense
        </p>
        
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search styles..."
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDownSearch}
              disabled={disabled}
              aria-label="Search styles"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        <div className="inline-block px-6 py-2 bg-accent/10 rounded-full mb-8">
          <span className="font-satisfy text-xl">
            {selectedStyles.length} of {maxSelections} styles selected
          </span>
        </div>

