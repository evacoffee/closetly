import { Types } from 'mongoose';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type ErrorSeverity = 'low' | 'medium' | 'high';

interface CircuitBreakerState {
  key: string;
  isOpen: boolean;
  lastFailure: Date | null;
  failureCount: number;
  successCount: number;
  nextAttempt: Date | null;
  lastError?: OutfitError;
}

interface RetryQueueState {
  pending: number;
  inProgress: boolean;
}

interface Metrics {
  errorCounts: Record<string, number>;
  regulationTriggers: Record<string, number>;
  lastTriggered: Date | null;
  circuitBreakers: CircuitBreakerState[];
  retryQueue: RetryQueueState;
}

type ErrorContext = Record<string, unknown> & {
  requestId?: string;
  userId?: string | Types.ObjectId;
  componentStack?: string;
  correlationId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
};

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors?: (string | RegExp)[];
}

export interface OutfitError {
  id: string;
  name: string;
  message: string;
  code: string;
  severity: ErrorSeverity;
  source?: 'client' | 'server' | 'api';
  timestamp: Date;
  context?: ErrorContext;
  stack?: string;
  isRetryable?: boolean;
  retryCount?: number;
  resolved: boolean;
  resolvedAt?: Date;
  resolution?: string;
  operation?: () => Promise<unknown>;
  cause?: unknown;
  metadata?: Record<string, unknown>;
}

export interface OutfitRegulation {
  id: string;
  name: string;
  description?: string;
  condition: RegulationCondition;
  action: RegulationAction;
  status: 'active' | 'inactive' | 'testing';
  lastTriggered?: Date;
  cooldown?: number; // in minutes
}

export interface RegulationCondition {
  errorCode?: string | string[];
  errorPattern?: RegExp;
  errorCount: number;
  timeWindow: number; // in minutes
  severity?: ErrorSeverity | ErrorSeverity[];
  source?: 'client' | 'server' | 'api';
  userImpacted?: boolean;
}

export interface RegulationAction {
  type: 'notify' | 'adjust' | 'disable' | 'fallback' | 'throttle' | 'circuit_breaker';
  params?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

interface ErrorHistoryItem extends OutfitError {
  id: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolution?: string;
}

// Global error handler for uncaught exceptions and unhandled rejections
const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return; // Skip in Node.js

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = event.error || event;
    
    OutfitErrorRegulator.logError({
      name: 'UncaughtError',
      code: 'UNCAUGHT_ERROR',
      message: error.message || 'Uncaught error',
      severity: 'high',
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: error.stack,
      },
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason || 'Unknown promise rejection';
    const message = error instanceof Error ? error.message : String(error);
    
    OutfitErrorRegulator.logError({
      name: 'UnhandledRejection',
      code: 'UNHANDLED_REJECTION',
      message,
      severity: 'high',
      context: {
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
  });
};

// Initialize global error handlers when this module is imported
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}

export class OutfitErrorRegulator {
  private static readonly MAX_ERROR_HISTORY = 1000;
  private static readonly ERROR_HISTORY: OutfitError[] = [];
  private static readonly REGULATIONS: OutfitRegulation[] = [];
  private static metrics: Metrics = {
    errorCounts: {},
    regulationTriggers: {},
    lastTriggered: null,
    circuitBreakers: [],
    retryQueue: { pending: 0, inProgress: false }
  };

  private static isProcessingQueue = false;
  private static retryQueue: Array<{
    operation: () => Promise<unknown>;
    retries: number;
    maxRetries: number;
    delay: number;
    error: OutfitError;
    context?: ErrorContext;
  }> = [];
  
  private static circuitBreakers = new Map<string, CircuitBreakerState>();

  // Single implementation of logToService
  private static logToService(error: OutfitError): void {
    // Implementation for logging to external service
    if (process.env.ERROR_LOGGING_SERVICE_URL) {
      try {
        // In a real implementation, you would send the error to your logging service
        // Example:
        // await fetch(process.env.ERROR_LOGGING_SERVICE_URL, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     ...error,
        //     timestamp: error.timestamp.toISOString(),
        //     environment: process.env.NODE_ENV
        //   })
        // });
      } catch (logError) {
        console.error('Failed to log error to service:', logError);
      }
    }
  }

  private static triggerRegulation(regulation: OutfitRegulation, error: OutfitError): void {
    try {
      console.log(`Triggering regulation: ${regulation.id} for error: ${error.code}`);
      
      // Update regulation last triggered time
      regulation.lastTriggered = new Date();
      
      // Apply regulation action based on type
      switch (regulation.action.type) {
        case 'notify':
          this.handleNotification(regulation, error);
          break;
        case 'circuit_breaker':
          this.handleCircuitBreaker(regulation, error);
          break;
        case 'throttle':
          this.handleThrottle(regulation, error);
          break;
        case 'fallback':
          this.handleFallback(regulation, error);
          break;
        case 'disable':
          this.handleDisable(regulation, error);
          break;
        case 'adjust':
          this.handleAdjust(regulation, error);
          break;
      }
    } catch (err) {
      console.error('Error triggering regulation:', err);
    }
  }

  private static updateMetrics(error: OutfitError): void {
    // Update error counts
    if (!this.metrics.errorCounts[error.code]) {
      this.metrics.errorCounts[error.code] = 0;
    }
    this.metrics.errorCounts[error.code]++;
    
    // Update retry queue metrics
    this.metrics.retryQueue = {
      pending: this.retryQueue.length,
      inProgress: this.isProcessingQueue
    };
    
    // Update circuit breaker metrics
    this.metrics.circuitBreakers = Array.from(this.circuitBreakers.entries()).map(([key, value]) => ({
      key,
      ...value
    }));
    this.metrics.lastTriggered = new Date();
  }

  static getRecentErrors(
    timeWindow?: number,
    errorCode?: string,
    severity?: ErrorSeverity,
    source?: 'client' | 'server' | 'api'
  ): OutfitError[] {
    let errors = [...this.ERROR_HISTORY];
    
    if (timeWindow) {
      const cutoff = new Date(Date.now() - timeWindow * 60 * 1000);
      errors = errors.filter(error => error.timestamp > cutoff);
    }
    
    if (errorCode) {
      errors = errors.filter(error => error.code === errorCode);
    }
    
    if (severity) {
      errors = errors.filter(error => error.severity === severity);
    }
    
    if (source) {
      errors = errors.filter(error => error.source === source);
    }
    
    return errors;
  }
  
  private static handleNotification(regulation: OutfitRegulation, error: OutfitError): void {
    // Implementation for notification handling
    console.log(`Sending notification for regulation: ${regulation.id}`);
  }

  private static handleCircuitBreaker(regulation: OutfitRegulation, error: OutfitError): void {
    const operationKey = `${error.source}:${error.code}`;
    const existing = this.circuitBreakers.get(operationKey) || {
      key: operationKey,
      isOpen: false,
      lastFailure: new Date(0),
      failureCount: 0,
      successCount: 0,
      nextAttempt: new Date()
    };
    
    const updatedState: CircuitBreakerState = {
      key: operationKey,
      isOpen: true,
      lastFailure: new Date(),
      lastError: error,
      failureCount: existing.failureCount + 1,
      successCount: existing.successCount,
      nextAttempt: new Date(Date.now() + 30000) // 30 seconds cooldown
    };
    
    this.circuitBreakers.set(operationKey, updatedState);
  }

  private static handleThrottle(regulation: OutfitRegulation, error: OutfitError): void {
    // Implementation for throttling
    console.log(`Throttling operation due to regulation: ${regulation.id}`);
  }

  private static handleFallback(regulation: OutfitRegulation, error: OutfitError): void {
    // Implementation for fallback behavior
    console.log(`Using fallback for regulation: ${regulation.id}`);
  }

  private static handleDisable(regulation: OutfitRegulation, error: OutfitError): void {
    // Implementation for disabling functionality
    console.log(`Disabling operation due to regulation: ${regulation.id}`);
  }

  private static handleAdjust(regulation: OutfitRegulation, error: OutfitError): void {
    // Implementation for adjusting behavior
    console.log(`Adjusting behavior for regulation: ${regulation.id}`);
  }

  static handleError(error: Error & { code?: string; severity?: ErrorSeverity; source?: 'client' | 'server' | 'api' }, context: ErrorContext = {}): string {
    const errorId = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date();
    
    const outfitError: OutfitError = {
      id: errorId,
      name: error.name || 'Error',
      message: error.message,
      stack: error.stack,
      code: error.name || 'UNKNOWN_ERROR',
      severity: 'high',
      timestamp,
      context,
      resolved: false
    };

    return this.logError(outfitError);
  }

  static logError(error: Omit<OutfitError, 'timestamp' | 'context' | 'id' | 'resolved'> & { context?: ErrorContext; name?: string }): string {
    const errorId = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date();
    const errorWithId: OutfitError = {
      ...error,
      id: errorId,
      timestamp,
      context: error.context || {},
      resolved: false,
      name: error.name || 'OutfitError',
      message: error.message || 'An unknown error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      severity: error.severity || 'error',
      source: error.source || 'server',
      retryCount: error.retryCount || 0
    };

    // Add to error history
    this.ERROR_HISTORY.push(errorWithId);
    if (this.ERROR_HISTORY.length > this.MAX_ERROR_HISTORY) {
      this.ERROR_HISTORY.shift();
    }

    // Check regulations
    this.checkRegulations(errorWithId);

    // Log to external service
    this.logToService(errorWithId);

    // Update metrics
    this.updateMetrics(errorWithId);

    return errorId;
  }

  private static checkRegulations(error: OutfitError): void {
    for (const regulation of this.REGULATIONS) {
      if (regulation.status !== 'active') continue;
      
      const condition = regulation.condition;
      const matchesSeverity = !condition.severity || condition.severity === error.severity;
      const matchesSource = !condition.source || condition.source === error.source;
      const matchesCode = !condition.errorCode || condition.errorCode === error.code;
      
      if (matchesSeverity && matchesSource && matchesCode) {
        this.triggerRegulation(regulation, error);
        
        if (!this.metrics.regulationTriggers[regulation.id]) {
          this.metrics.regulationTriggers[regulation.id] = 0;
        }
        this.metrics.regulationTriggers[regulation.id]++;
      }
      // Error code matching logic is already handled above
      
      // Check error pattern match if provided
      if (condition.errorPattern && !condition.errorPattern.test(error.code)) {
        continue;
      }
      
      // Check severity match
      if (condition.severity) {
        const severities = Array.isArray(condition.severity)
          ? condition.severity
          : [condition.severity];
          
        if (!severities.includes(error.severity)) continue;
      }
      
      // Check source match
      if (condition.source && condition.source !== error.source) {
        continue;
      }
      
      // Get matching recent errors
      const recentErrors = this.getRecentErrors(
        condition.timeWindow, 
        condition.errorCode ? error.code : undefined,
        condition.severity ? error.severity : undefined,
        condition.source
      );
      
      // Check if error threshold is reached
      if (recentErrors.length >= condition.errorCount) {
        this.applyRegulation(regulation, error);
      }
    }
  }
  
  private static isInCooldown(regulation: OutfitRegulation): boolean {
    if (!regulation.lastTriggered || !regulation.cooldown) return false;
    
    const cooldownMs = regulation.cooldown * 60 * 1000;
    return (Date.now() - regulation.lastTriggered.getTime()) < cooldownMs;
  }

  // logToService implementation is now defined above
  
  static markAsResolved(errorId: string, resolution: string = 'Manually resolved'): boolean {
    const error = this.getErrorHistoryItem(errorId);
    if (!error) return false;
    
    error.resolved = true;
    error.resolvedAt = new Date();
    error.resolution = resolution;
    
    return true;
  }
  
  private static getErrorHistoryItem(id: string): ErrorHistoryItem | undefined {
    const item = this.ERROR_HISTORY.find((e) => e.id === id);
    return item ? { ...item, resolved: item.resolved || false } : undefined;
  }
  
  static getErrorById(errorId: string): ErrorHistoryItem | undefined {
    return this.getErrorHistoryItem(errorId);
  }
  
  static clearHistory(): void {
    this.ERROR_HISTORY.length = 0;
  }
  
  private static sendNotification(regulation: OutfitRegulation, error: OutfitError): void {
    // Implement notification logic (e.g., send email, Slack message)
    const notification = {
      regulationId: regulation.id,
      error: {
        code: error.code,
        message: error.message,
        severity: error.severity,
        source: error.source
      },
      timestamp: new Date().toISOString()
    };
    
    console.warn(`[NOTIFICATION] Regulation triggered: ${regulation.name}`, notification);
    
    // Example: Send to external notification service
    if (process.env.NOTIFICATION_SERVICE_URL) {
      fetch(process.env.NOTIFICATION_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error_regulation',
          ...notification
        })
      }).catch(console.error);
    }
  }

  private static applyRegulation(
    regulation: OutfitRegulation,
    triggerError: OutfitError
  ): void {
    try {
      // Update last triggered time
      regulation.lastTriggered = new Date();
      
      // Log the regulation being applied
      const logContext = {
        regulationId: regulation.id,
        regulationName: regulation.name,
        error: {
          code: triggerError.code,
          message: triggerError.message,
          severity: triggerError.severity,
          source: triggerError.source
        },
        action: regulation.action,
        timestamp: new Date().toISOString()
      };
      
      console.warn(`[REGULATION_TRIGGERED] ${regulation.name}`, logContext);
      
      // Apply the regulation action
      switch (regulation.action.type) {
        case 'notify':
          this.sendNotification(regulation, triggerError);
          break;
          
        case 'adjust':
          if (regulation.action.params && 'relaxStyleMatching' in regulation.action.params) {
            console.log('Relaxing style matching constraints');
          }
          if (regulation.action.params && 'expandStyleCompatibility' in regulation.action.params) {
            console.log('Expanding style compatibility rules');
          }
          break;
          
        case 'fallback':
          console.warn(`[FALLBACK] Enabling fallback mode:`, regulation.action.params);
          if (regulation.action.params && 'useBasicRules' in regulation.action.params) {
            console.log('Switching to basic outfit generation rules');
          }
          break;
          
        case 'throttle':
          console.warn(`[THROTTLE] Enabling request throttling:`, regulation.action.params);
          break;
          
        case 'circuit_breaker':
          console.error(`[CIRCUIT_BREAKER] Activating circuit breaker:`, regulation.action.params);
          break;
          
        case 'disable':
          console.error(`[DISABLE] Disabling feature:`, regulation.action.params);
          regulation.status = 'inactive';
          console.warn('Disabled regulation due to repeated issues:', regulation);
          break;
          
        default:
          console.warn(`[UNKNOWN_ACTION] Unknown regulation action: ${(regulation.action as any).type}`);
      }
    } catch (error) {
      console.error('Error applying regulation:', {
        error,
        regulationId: regulation?.id,
        errorCode: triggerError?.code
      });
    }
  }
  
  /**
   * Returns the current status of the error regulator
   */
  static getMetrics(): Metrics {
    return {
      ...this.metrics,
      circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([key, state]) => ({
        key,
        ...state
      })),
      retryQueue: {
        pending: this.retryQueue.length,
        inProgress: this.isProcessingQueue
      }
    };
  }

  static getRegulationStatus() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const errorsLastHour = this.ERROR_HISTORY.filter(
      (e: ErrorHistoryItem) => e.timestamp >= oneHourAgo
    );
    
    const errorsLast24h = this.ERROR_HISTORY.filter(
      (e: ErrorHistoryItem) => e.timestamp >= oneDayAgo
    );
    
    const countBySeverity = (errors: OutfitError[]) => ({
      low: errors.filter((e: OutfitError) => e.severity === 'low').length,
      medium: errors.filter((e: OutfitError) => e.severity === 'medium').length,
      high: errors.filter((e: OutfitError) => e.severity === 'high').length,
    });
    
    return {
      activeRegulations: this.REGULATIONS.filter(r => r.status === 'active').length,
      totalErrors: this.ERROR_HISTORY.length,
      recentErrors: {
        lastHour: errorsLastHour.length,
        last24h: errorsLast24h.length,
      },
      severityBreakdown: {
        lastHour: countBySeverity(errorsLastHour as OutfitError[]),
        last24h: countBySeverity(errorsLast24h as OutfitError[]),
        allTime: countBySeverity(this.ERROR_HISTORY as OutfitError[]),
      },
      lastError: this.ERROR_HISTORY[this.ERROR_HISTORY.length - 1],
      lastRegulationTrigger: this.REGULATIONS
        .filter((r: OutfitRegulation) => r.lastTriggered)
        .sort((a: OutfitRegulation, b: OutfitRegulation) => 
          (b.lastTriggered?.getTime() || 0) - (a.lastTriggered?.getTime() || 0)
        )[0],
    };
  }
  
  /**
   * Get a summary of recent errors for debugging or reporting
   */
  static getErrorSummary() {
    return {
      totalErrors: this.ERROR_HISTORY.length,
      recentErrors: this.ERROR_HISTORY.slice(-10).map((e: ErrorHistoryItem) => ({
        code: e.code,
        message: e.message,
        severity: e.severity,
        timestamp: e.timestamp.toISOString(),
      })),
      errorCounts: this.ERROR_HISTORY.reduce((acc: Record<string, number>, error: ErrorHistoryItem) => {
        acc[error.code] = (acc[error.code] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
