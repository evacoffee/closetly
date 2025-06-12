'use client';

import * as React from 'react';

const { useRef, useEffect, useState, useCallback } = React;

type SceneManagerOptions = {
  container: HTMLElement;
  onLoad?: () => void;
  onError?: (error: Error) => void;
};

type ISceneManager = {
  dispose: () => void;
};

type SceneManagerClass = new (options: SceneManagerOptions) => ISceneManager;
type SceneManagerInstance = ISceneManager;

interface OutfitVisualizerProps {
  outfitId: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function OutfitVisualizer({
  outfitId,
  className = '',
  onLoad,
  onError,
}: OutfitVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sceneManagerRef = useRef<SceneManagerClass | null>(null);
  const [sceneManagerLoaded, setSceneManagerLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadSceneManager = async () => {
      try {
        const module = await import('../../../lib/three/sceneManager');
        const SceneManager = module.default || module.SceneManager || module;
        
        if (!SceneManager) {
          throw new Error('Failed to load 3D viewer');
        }
        
        sceneManagerRef.current = SceneManager;
        setSceneManagerLoaded(true);
      } catch (err) {
        console.error('Failed to load SceneManager:', err);
        setError('Failed to load 3D viewer');
        onError?.(new Error('Failed to load 3D viewer'));
      }
    };

    loadSceneManager();
  }, [onError]);

  const initScene = useCallback(async () => {
    if (!containerRef.current || !sceneManagerLoaded) return;

    try {
      const SceneManagerConstructor = sceneManagerRef.current;
      if (!SceneManagerConstructor) {
        throw new Error('3D viewer not available');
      }

      const manager = new SceneManagerConstructor({
        container: containerRef.current,
        onLoad: () => {
          setIsLoading(false);
          onLoad?.();
        },
        onError: (error: Error) => {
          setError(error.message);
          onError?.(error);
          setIsLoading(false);
        },
      });

      return () => {
        if (manager) {
          manager.dispose();
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize 3D viewer');
      setError(error.message);
      onError?.(error);
      setIsLoading(false);
    }
  }, [onLoad, onError, sceneManagerLoaded]);

  useEffect(() => {
    if (!sceneManagerLoaded) return;
    
    const cleanup = initScene();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [initScene, sceneManagerLoaded]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center text-red-500 ${className}`}>
        <div className="text-center">
          <p className="font-semibold">Error loading 3D viewer</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-white rounded-lg overflow-hidden shadow-sm ${className}`}
      aria-label="3D Outfit Viewer"
      role="img"
    >
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-4">
        <span className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-white/50 mr-1"></span>
          Drag to rotate
        </span>
        <span className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-white/50 mr-1"></span>
          Scroll to zoom
        </span>
      </div>
    </div>
  );
}
