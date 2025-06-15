// src/components/outfit/EnhancedOutfitRecommender.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OutfitGrid = dynamic(() => import('./OutfitGrid'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});

const WardrobeView = dynamic(() => import('./WardrobeView'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});

const PreferencesModal = dynamic(() => import('./PreferencesModal'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});

export function EnhancedOutfitRecommender() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('outfits');
  const [showPreferences, setShowPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadInitialData();
    }
  }, [status, router]);

  const loadInitialData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="outfits">Outfits</TabsTrigger>
            <TabsTrigger value="wardrobe">My Wardrobe</TabsTrigger>
          </TabsList>
          <Button 
            onClick={() => setShowPreferences(true)}
            variant="outline"
          >
            Preferences
          </Button>
        </div>

        <TabsContent value="outfits">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <OutfitGrid />
          </Suspense>
        </TabsContent>

        <TabsContent value="wardrobe">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <WardrobeView />
          </Suspense>
        </TabsContent>
      </Tabs>

      <PreferencesModal 
        open={showPreferences} 
        onOpenChange={setShowPreferences} 
      />
    </div>
  );
}