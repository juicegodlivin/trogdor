'use client';

import React, { Component, ReactNode } from 'react';
import { MedievalIcon } from './ui/MedievalIcon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // TODO: Send to error monitoring service (Sentry)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { contexts: { react: errorInfo } });
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen notebook-paper flex items-center justify-center p-4">
          <div className="max-w-md w-full border-sketch border-pencil bg-white p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <MedievalIcon name="torch" size={80} />
                <span className="absolute -top-2 -right-2 text-4xl">💥</span>
              </div>
            </div>
            
            <h1 className="font-hand text-4xl text-center mb-4 text-accent-red">
              Burnination Failed!
            </h1>
            
            <p className="text-center text-pencil mb-6">
              Something went wrong. The dragon encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-accent-red rounded">
                <p className="font-mono text-xs text-accent-red break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="btn-sketch w-full px-6 py-3 bg-accent-green text-white hover:bg-accent-green/90"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="btn-sketch w-full px-6 py-3 hover:bg-sketch"
              >
                Return Home
              </button>
            </div>

            <p className="text-center text-sm text-pencil-light mt-6">
              If this keeps happening, please refresh the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Smaller error boundary for component-level errors
 */
export function ComponentErrorBoundary({ 
  children, 
  componentName = 'Component' 
}: { 
  children: ReactNode; 
  componentName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="border-sketch border-pencil bg-red-50 p-6 text-center">
          <MedievalIcon name="flag" size={48} className="mx-auto mb-3" />
          <h3 className="font-hand text-xl text-accent-red mb-2">
            Oops!
          </h3>
          <p className="text-pencil text-sm">
            {componentName} failed to load. Please refresh the page.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

