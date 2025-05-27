import * as React from 'react';
import { OutfitErrorRegulator } from '@/utils/errorHandler';

type ErrorInfo = {
  componentStack: string;
};

type ReactNode = React.ReactNode;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error regulator
    OutfitErrorRegulator.logError({
      code: 'UI_ERROR_BOUNDARY',
      message: error.message,
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
    
    // Update state with error details
    this.setState({ 
      hasError: true,
      error
    });
    
    // You can also log to an error reporting service here
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    const { fallback, children } = this.props;
    const { hasError, error } = this.state;
    
    if (hasError) {
      // Render fallback UI
      return fallback || (
        <div className="p-4 text-red-600">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
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

// Custom hook for error handling in components
export function useErrorHandler() {
  const handleError = (error: unknown, context: Record<string, unknown> = {}) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    OutfitErrorRegulator.logError({
      code: 'COMPONENT_ERROR',
      message: errorMessage,
      severity: 'medium',
      context,
    });
    
    // Re-throw the error if you want to handle it in the component as well
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(errorMessage);
  };

  return { handleError };
}
