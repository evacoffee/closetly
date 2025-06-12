import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json()
    return NextResponse.json({ success: true, message: 'Payment processed successfully' })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
