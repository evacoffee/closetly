import { Types } from 'mongoose';

export interface OutfitError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface OutfitRegulation {
  condition: RegulationCondition;
  action: RegulationAction;
  status: 'active' | 'inactive';
  lastTriggered?: Date;
}

interface RegulationCondition {
  errorCode?: string;
  errorCount?: number;
  timeWindow?: number; // in minutes
  severity?: 'low' | 'medium' | 'high';
}

interface RegulationAction {
  type: 'notify' | 'adjust' | 'disable' | 'fallback';
  params?: Record<string, unknown>;
}

export class OutfitErrorRegulator {
  private static readonly ERROR_HISTORY: OutfitError[] = [];
  private static readonly REGULATIONS: OutfitRegulation[] = [
    {
      condition: {
        errorCode: 'NO_SUITABLE_ITEMS',
        errorCount: 3,
        timeWindow: 5,
        severity: 'medium'
      },
      action: {
        type: 'adjust',
        params: { relaxStyleMatching: true }
      },
      status: 'active'
    },
    {
      condition: {
        errorCode: 'INCOMPLETE_OUTFIT',
        errorCount: 5,
        timeWindow: 10,
        severity: 'high'
      },
      action: {
        type: 'fallback',
        params: { useBasicRules: true }
      },
      status: 'active'
    },
    {
      condition: {
        errorCode: 'STYLE_MISMATCH',
        errorCount: 10,
        timeWindow: 30,
        severity: 'low'
      },
      action: {
        type: 'adjust',
        params: { expandStyleCompatibility: true }
      },
      status: 'active'
    }
  ];

  static logError(error: Omit<OutfitError, 'timestamp'>): void {
    const fullError = {
      ...error,
      timestamp: new Date()
    };

    this.ERROR_HISTORY.push(fullError);
    this.checkRegulations(fullError);

    // Cleanup old errors (keep last 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    while (
      this.ERROR_HISTORY.length > 0 && 
      this.ERROR_HISTORY[0].timestamp < dayAgo
    ) {
      this.ERROR_HISTORY.shift();
    }
  }

  static getRecentErrors(
    timeWindow: number = 60, // minutes
    errorCode?: string
  ): OutfitError[] {
    const cutoff = new Date(Date.now() - timeWindow * 60 * 1000);
    return this.ERROR_HISTORY.filter(error => 
      error.timestamp >= cutoff &&
      (!errorCode || error.code === errorCode)
    );
  }

  private static checkRegulations(error: OutfitError): void {
    for (const regulation of this.REGULATIONS) {
      if (regulation.status !== 'active') continue;

      const {
        errorCode,
        errorCount = 1,
        timeWindow = 60,
        severity
      } = regulation.condition;

      // Check if regulation conditions are met
      if (
        (errorCode && error.code !== errorCode) ||
        (severity && error.severity !== severity)
      ) {
        continue;
      }

      const recentErrors = this.getRecentErrors(timeWindow, errorCode);
      if (recentErrors.length >= errorCount) {
        this.applyRegulation(regulation, error);
      }
    }
  }

  private static applyRegulation(
    regulation: OutfitRegulation,
    triggerError: OutfitError
  ): void {
    regulation.lastTriggered = new Date();

    switch (regulation.action.type) {
      case 'notify':
        // In a real implementation, this would integrate with your notification system
        console.error('Outfit generation regulation triggered:', {
          regulation,
          triggerError
        });
        break;

      case 'adjust':
        // Adjust outfit generation parameters
        if (regulation.action.params?.relaxStyleMatching) {
          // Implement style matching relaxation
          console.log('Relaxing style matching constraints');
        }
        if (regulation.action.params?.expandStyleCompatibility) {
          // Implement style compatibility expansion
          console.log('Expanding style compatibility rules');
        }
        break;

      case 'disable':
        // Disable problematic features
        regulation.status = 'inactive';
        console.warn('Disabled regulation due to repeated issues:', regulation);
        break;

      case 'fallback':
        // Switch to fallback mode
        if (regulation.action.params?.useBasicRules) {
          console.log('Switching to basic outfit generation rules');
        }
        break;
    }
  }

  static getRegulationStatus(): {
    activeRegulations: number;
    totalErrors24h: number;
    highSeverityErrors24h: number;
  } {
    return {
      activeRegulations: this.REGULATIONS.filter(r => r.status === 'active').length,
      totalErrors24h: this.ERROR_HISTORY.length,
      highSeverityErrors24h: this.ERROR_HISTORY.filter(
        e => e.severity === 'high'
      ).length
    };
  }
}
