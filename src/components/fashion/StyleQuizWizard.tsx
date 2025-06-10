'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { fashionStyles, StyleDefinition } from '@/config/styles';
import { styleQuizQuestions, calculateStyleScores, getTopStyles } from '@/config/styleQuizQuestions';
import { AgeProfile } from './AgeProfileSelector';

interface StyleQuizWizardProps {
  onComplete: (selectedStyles: StyleDefinition[], ageProfile: AgeProfile | null, bodyPhoto?: string) => void;
  maxSelections?: number;
  initialAgeProfile?: AgeProfile;
  disabled?: boolean;
}

export function StyleQuizWizard({
  onComplete,
  maxSelections = 5,
  initialAgeProfile,
  disabled = false,
}: StyleQuizWizardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(styleQuizQuestions.length).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ageProfile, setAgeProfile] = useState<AgeProfile | null>(initialAgeProfile || null);
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [recommendedStyles, setRecommendedStyles] = useState<StyleDefinition[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const currentQuestion = styleQuizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / styleQuizQuestions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < styleQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const scores = calculateStyleScores(answers);
    const topStyleIds = getTopStyles(scores, maxSelections);
    const topStyles = topStyleIds
      .map(id => fashionStyles.find(style => style.id === id))
      .filter((style): style is StyleDefinition => style !== undefined);
    
    setRecommendedStyles(topStyles);
    setSelectedStyles(topStyleIds);
    setShowResults(true);
  };

  const handleStyleToggle = (styleId: string) => {
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

  const handleComplete = () => {
    if (selectedStyles.length === 0 || !ageProfile) return;
    
    const selectedStyleDefs = selectedStyles
      .map(id => fashionStyles.find(style => style.id === id))
      .filter((style): style is StyleDefinition => style !== undefined);
    
    onComplete(selectedStyleDefs, ageProfile, bodyPhoto || undefined);
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Style Profile</h2>
        <p className="text-muted-foreground">
          Based on your answers, we recommend these styles. You can customize your selection before continuing.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedStyles.map((style) => (
            <div 
              key={style.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedStyles.includes(style.id) ? 'border-primary bg-primary/10' : 'hover:bg-muted'}`}
              onClick={() => handleStyleToggle(style.id)}
            >
              <h3 className="font-medium">{style.name}</h3>
              <p className="text-sm text-muted-foreground">{style.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setShowResults(false)}>
            Back to Quiz
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={selectedStyles.length === 0 || !ageProfile || disabled}
          >
            Complete Style Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {styleQuizQuestions.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="mt-4">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={answers[currentQuestionIndex]} 
          onValueChange={handleAnswerSelect}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <RadioGroupItem 
                value={option.text} 
                id={`q${currentQuestionIndex}-${index}`} 
                disabled={disabled}
              />
              <Label htmlFor={`q${currentQuestionIndex}-${index}`} className="cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || disabled}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!answers[currentQuestionIndex] || disabled}
        >
          {currentQuestionIndex === styleQuizQuestions.length - 1 ? 'See Results' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default StyleQuizWizard;
