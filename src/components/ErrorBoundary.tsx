import React from 'react';
import { OutfitErrorRegulator } from '@/utils/errorHandler';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps> & Readonly<{ children?: React.ReactNode }>;
  declare setState: React.Dispatch<React.SetStateAction<ErrorBoundaryState>>;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    OutfitErrorRegulator.logError({
      name: 'ReactErrorBoundary',
      code: 'REACT_ERROR',
      message: error.message,
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack
      }
    });
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-600">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function useErrorHandler() {
  const handleError = (error: unknown, context: Record<string, unknown> = {}) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    OutfitErrorRegulator.logError({
      name: 'ComponentError',
      code: 'COMPONENT_ERROR',
      message: errorMessage,
      severity: 'medium',
      context,
    });
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(errorMessage);
  };

  return { handleError };
}

export default ErrorBoundary;
