'use client';

import React, { useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgeProfile, AgeProfileSelector } from './AgeProfileSelector';
import { StyleDefinition } from '@/config/styles';
import { StyleQuizWizard } from './StyleQuizWizard';
import dynamic from 'next/dynamic';

const StyleQuizComponent = dynamic(
  () => import('./StyleQuizComponent').then(mod => mod.StyleQuizComponent),
  { 
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ),
    ssr: false 
  }
);

interface StyleQuizProps {
  onComplete: (selectedStyles: StyleDefinition[], ageProfile: AgeProfile, bodyPhoto?: string) => void;
  maxSelections?: number;
  initialAgeProfile?: AgeProfile;
  disabled?: boolean;
}

export function StyleQuiz({
  onComplete,
  maxSelections = 5,
  initialAgeProfile,
  disabled = false,
}: StyleQuizProps) {
  const [ageProfile, setAgeProfile] = useState<AgeProfile | null>(initialAge || null);
  const [selectedTab, setSelectedTab] = useState<'select' | 'quiz'>('select');
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [quizStyles, setQuizStyles] = useState<StyleDefinition[]>([]);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);

  const handleQuizComplete = (styles: StyleDefinition[], quizAgeProfile: AgeProfile | null, quizBodyPhoto?: string) => {
    if (quizBodyPhoto) {
      setBodyPhoto(quizBodyPhoto);
    }
    if (quizAgeProfile) {
      setAgeProfile(quizAgeProfile);
    }
    setQuizStyles(styles);
    setIsQuizComplete(true);
  };

  const handleComplete = () => {
    if (ageProfile) {
      onComplete(quizStyles, ageProfile, bodyPhoto || undefined);
    }
  };

  if (isQuizComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your Style Selection</CardTitle>
          <p className="text-muted-foreground">
            Review your selected styles before continuing.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {quizStyles.map((style) => (
              <div key={style.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{style.name}</h3>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedTab('select')}
              disabled={disabled}
            >
              Change Selection
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!ageProfile || disabled}
            >
              Complete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs 
      value={selectedTab} 
      onValueChange={(value) => setSelectedTab(value as 'select' | 'quiz')}
      className="w-full max-w-4xl mx-auto"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="select">Select Styles</TabsTrigger>
        <TabsTrigger value="quiz">Take Style Quiz</TabsTrigger>
      </TabsList>
      
      <TabsContent value="select">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Styles</CardTitle>
            <p className="text-muted-foreground">
              Choose up to {maxSelections} styles that best represent your fashion sense.
            </p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }>
              <StyleQuizComponent 
                onComplete={onComplete} 
                maxSelections={maxSelections} 
                ageProfile={ageProfile || undefined} 
                disabled={disabled} 
              />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="quiz">
        <Card>
          <CardHeader>
            <CardTitle>Style Quiz</CardTitle>
            <p className="text-muted-foreground">
              Answer a few questions to discover your perfect style match.
            </p>
          </CardHeader>
          <CardContent>
            <StyleQuizWizard 
              onComplete={handleQuizComplete}
              maxSelections={maxSelections}
              initialAgeProfile={ageProfile || undefined}
              disabled={disabled}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default StyleQuiz;
