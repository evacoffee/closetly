import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
};

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

export function errorResponse(
  message: string,
  code?: string,
  details?: any
): ApiResponse<null> {
  return {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details && { details }),
    },
  };
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return NextResponse.json(
      errorResponse(error.message, 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    errorResponse('An unknown error occurred', 'UNKNOWN_ERROR'),
    { status: 500 }
  );
}