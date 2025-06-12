'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useOutfitGenerator } from '@/hooks/useOutfitGenerator';

const OCCASIONS = [
  { value: 'casual', label: 'Casual' },
  { value: 'work', label: 'Work' },
  { value: 'formal', label: 'Formal' },
  { value: 'date', label: 'Date Night' },
  { value: 'gym', label: 'Gym' },
  { value: 'party', label: 'Party' },
  { value: 'travel', label: 'Travel' },
];

export function OutfitGenerator() {
  const [occasion, setOccasion] = React.useState('');
  const [weatherEnabled, setWeatherEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');
  
  const { generateOutfit, suggestion, isLoading, error } = useOutfitGenerator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const locationToUse = weatherEnabled ? location : undefined;
    await generateOutfit(occasion, locationToUse);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Outfit</CardTitle>
          <CardDescription>
            Get AI-powered outfit suggestions based on your wardrobe and the occasion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable-weather"
                  checked={weatherEnabled}
                  onChange={(e) => setWeatherEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="enable-weather">Consider weather</Label>
              </div>
              
              {weatherEnabled && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!weatherEnabled}
                  />
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Outfit'
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {suggestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{suggestion.outfitName}</CardTitle>
                <CardDescription>For {suggestion.occasion}</CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                AI Generated
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">{suggestion.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items in this outfit:</h4>
                <ul className="space-y-2">
                  {suggestion.items.map((itemId, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {itemId}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="outline">Save Outfit</Button>
                <Button>Regenerate</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
