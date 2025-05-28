import * as React from 'react';
import { StyleCard } from './StyleCard';
import { fashionStyles, StyleDefinition } from '@/config/styles';
import { AgeProfile } from './AgeProfileSelector';

// Define the StyleCardProps interface to match the StyleCard component's expected props
interface StyleCardProps {
  style: StyleDefinition;
  selected: boolean;
  onSelect: (styleId: string) => void;
}

declare global {
  interface Window {
    React: typeof React;
  }
}

interface StyleQuizProps {
  onComplete: (selectedStyles: StyleDefinition[], ageProfile: AgeProfile, bodyPhoto?: string) => void;
  maxSelections?: number;
  ageProfile?: AgeProfile;
}

export const StyleQuiz = ({ onComplete, maxSelections = 5, ageProfile }: StyleQuizProps) => {
  const [selectedStyles, setSelectedStyles] = React.useState<string[]>([]);
  const [bodyPhoto, setBodyPhoto] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyles((prev: string[]) => {
      if (prev.includes(styleId)) {
        return prev.filter((id: string) => id !== styleId);
      }
      if (prev.length >= maxSelections) {
        return prev;
      }
      return [...prev, styleId];
    });
  };

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBodyPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setBodyPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    const selectedStyleObjects = fashionStyles.filter((style) =>
      selectedStyles.includes(style.id)
    );
    
    if (!ageProfile) {
      console.error('Age profile is required to complete style quiz');
      return;
    }

    onComplete(selectedStyleObjects, ageProfile, bodyPhoto || undefined);
  };

  return (
    <div className="max-w-7xl mx-auto container-padding">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-satisfy">Discover Your Personal Style</h1>
        <p className="text-lg font-amatic mb-6">
          Choose up to {maxSelections} styles that resonate with your fashion sense
        </p>
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
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
              capture="environment"
            />
            
            {bodyPhoto ? (
              <div className="relative">
                <img 
                  src={bodyPhoto} 
                  alt="Your body photo" 
                  className="mx-auto max-h-64 rounded-lg object-cover"
                />
                <button
                  className="mt-4 text-accent hover:text-accent-dark"
                  onClick={handleRemovePhoto}
                >
                  Change Photo
                </button>
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

      <div className="grid-layout">
        {fashionStyles.map((style) => (
          <div key={style.id}>
            <StyleCard
              style={style}
              selected={selectedStyles.includes(style.id)}
              onSelect={handleStyleSelect}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          className={`btn-primary text-2xl px-8 py-3 ${
            selectedStyles.length === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'transform hover:scale-105'
          }`}
          onClick={handleSubmit}
          disabled={selectedStyles.length === 0}
        >
          Complete Style Quiz
        </button>
      </div>
      
      {selectedStyles.length === maxSelections && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-accent text-text px-6 py-3 rounded-full shadow-lg animate-bounce">
            <p className="font-amatic text-xl">Maximum styles selected!</p>
          </div>
        </div>
      )}
    </div>
  );
};
