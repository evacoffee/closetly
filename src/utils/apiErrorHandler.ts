import { NextApiRequest, NextApiResponse } from 'next';
import { OutfitErrorRegulator } from './errorHandler';

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const withErrorHandling = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof ApiError) {
        OutfitErrorRegulator.logError({
          code: error.code,
          message: error.message,
          severity: getSeverityFromStatusCode(error.statusCode),
          context: {
            path: req.url,
            method: req.method,
            details: error.details,
          },
        });

        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && {
              stack: error.stack,
              details: error.details,
            }),
          },
        });
      } else {
        const statusCode = 500;
        const message = 'An unexpected error occurred';
        
        OutfitErrorRegulator.logError({
          code: 'UNEXPECTED_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'high',
          context: {
            path: req.url,
            method: req.method,
            originalError: error,
          },
        });

        res.status(statusCode).json({
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message,
            ...(process.env.NODE_ENV === 'development' && {
              stack: error instanceof Error ? error.stack : undefined,
              originalError: error,
            }),
          },
        });
      }
    }
  };
};

function getSeverityFromStatusCode(statusCode: number): 'low' | 'medium' | 'high' {
  if (statusCode >= 500) return 'high';
  if (statusCode >= 400) return 'medium';
  return 'low';
}

export const notFound = (message: string = 'Resource not found') => {
  return new ApiError(message, 404, 'NOT_FOUND');
};

export const badRequest = (message: string = 'Bad request', details?: any) => {
  return new ApiError(message, 400, 'BAD_REQUEST', details);
};

export const unauthorized = (message: string = 'Unauthorized') => {
  return new ApiError(message, 401, 'UNAUTHORIZED');
};

export const forbidden = (message: string = 'Forbidden') => {
  return new ApiError(message, 403, 'FORBIDDEN');
};

export const validationError = (errors: any[]) => {
  return new ApiError('Validation failed', 422, 'VALIDATION_ERROR', { errors });
};
