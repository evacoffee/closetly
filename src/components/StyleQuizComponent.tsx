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

  // Filter styles based on search query
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

  // Track keyboard navigation for accessibility
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

        {/* Body Photo Upload Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-satisfy mb-4">Help Us Understand Your Body Type</h2>
          <p className="mb-6 font-amatic text-lg">
            Upload a full-body photo (optional) to get more accurate outfit recommendations
          </p>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragOver ? 'border-accent bg-accent/10' : 'border-gray-300 hover:border-accent'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerFileInput()}
            aria-label="Upload body photo"
            aria-disabled={disabled}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
              capture="environment"
              disabled={disabled}
              aria-hidden="true"
            />
            
            {bodyPhoto ? (
              <div className="relative">
                <img 
                  src={bodyPhoto} 
                  alt="Your body photo" 
                  className="mx-auto max-h-64 rounded-lg object-cover"
                />
                {!disabled && (
                  <button
                    className="mt-4 text-accent hover:text-accent-dark focus:outline-none focus:ring-2 focus:ring-accent rounded"
                    onClick={handleRemovePhoto}
                    aria-label="Remove photo"
                  >
                    Change Photo
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-5xl mb-2">📷</div>
                <p className="font-amatic text-xl">
                  {isDragOver ? 'Drop your photo here' : 'Drag & drop a photo or click to select'}
                </p>
                <p className="text-sm text-gray-500">We recommend a full-body photo in fitted clothing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid-layout" role="list" aria-label="Style options">
        {filteredStyles.length > 0 ? (
          filteredStyles.map((style) => (
            <div 
              key={style.id} 
              role="listitem"
              className={`transition-opacity ${disabled ? 'opacity-70' : 'hover:opacity-90'}`}
            >
              <StyleCard
                style={style}
                selected={selectedStyles.includes(style.id)}
                onSelect={handleStyleSelect}
                disabled={disabled}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg">No styles found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <button
          className={`btn btn-primary text-2xl px-8 py-3 transition-all ${
            selectedStyles.length === 0 || disabled
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          }`}
          onClick={handleSubmit}
          disabled={selectedStyles.length === 0 || disabled}
          aria-busy={disabled}
          aria-live="polite"
        >
          {disabled ? 'Processing...' : 'Complete Style Quiz'}
        </button>
      </div>
      
      {selectedStyles.length === maxSelections && (
        <div 
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-full shadow-lg animate-bounce"
          role="alert"
          aria-live="polite"
        >
          <p className="font-amatic text-xl">Maximum styles selected!</p>
        </div>
      )}
    </div>
  );
};

export { StyleQuiz };