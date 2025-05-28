import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add any additional health checks here (e.g., database connection)
    return NextResponse.json(
      { status: 'ok', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'error', error: 'Service Unavailable' },
      { status: 503 }
    );
  }
}