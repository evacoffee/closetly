'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import type { UserPreferences } from '@/lib/preferences';

type PreferenceKey = keyof UserPreferences;

interface PreferencesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialPreferences?: Partial<UserPreferences>;
  onSave?: (preferences: UserPreferences) => void;
}

export function PreferencesModal({
  isOpen,
  onOpenChange,
  initialPreferences = {},
  onSave,
}: PreferencesModalProps) {
  const [preferences, setPreferences] = React.useState<UserPreferences>(() => ({
    weatherAware: true,
    seasonalSuggestions: true,
    occasionBased: false,
    colorMatching: true,
    favoritesFirst: false,
    ...initialPreferences,
  }));

  const togglePreference = (key: PreferenceKey) => {
    setPreferences(prev => {
      const newPrefs = {
        ...prev,
        [key]: !prev[key]
      };
      return newPrefs as UserPreferences;
    });
  };

  const handleSave = () => {
    onSave?.(preferences);
    onOpenChange(false);
  };

  const PreferenceToggle = ({ id, label, description }: { id: PreferenceKey; label: string; description: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={preferences[id]}
        onCheckedChange={() => togglePreference(id)}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <DialogTitle>Wardrobe Preferences</DialogTitle>
          </div>
          <DialogDescription>
            Customize how your wardrobe is displayed and managed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <PreferenceToggle
            id="weatherAware"
            label="Weather Awareness"
            description="Show weather-appropriate clothing suggestions"
          />
          
          <PreferenceToggle
            id="seasonalSuggestions"
            label="Seasonal Suggestions"
            description="Highlight seasonal clothing items"
          />
          
          <PreferenceToggle
            id="occasionBased"
            label="Occasion-based Filtering"
            description="Filter items by occasion (casual, formal, etc.)"
          />
          
          <PreferenceToggle
            id="colorMatching"
            label="Color Matching"
            description="Suggest color-coordinated outfits"
          />
          
          <PreferenceToggle
            id="favoritesFirst"
            label="Show Favorites First"
            description="Always display favorited items at the top"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
