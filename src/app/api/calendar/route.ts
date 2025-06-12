import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function handleError(error: unknown, message: string) {
  console.error(`${message}:`, error)
  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}

// Get all calendar events for the logged in user
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Not authorized', { status: 401 })
  }

  try {
    // Get events sorted by date
    const events = await prisma.outfitCalendar.findMany({
      where: { userId: session.user.id },
      include: { outfit: true },
      orderBy: { date: 'asc' }
    })
    
    return NextResponse.json(events)
  } catch (error) {
    return handleError(error, 'Failed to load calendar events')
  }
}

// Add a new calendar event
export async function POST(request: NextRequest) {
  // Check auth first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Not logged in', { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.date || !data.outfitId) {
      return NextResponse.json(
        { error: 'Need both date and outfit ID' },
        { status: 400 }
      )
    }

    // Check if event already exists for this date
    const existingEvent = await prisma.outfitCalendar.findFirst({
      where: {
        userId: session.user.id,
        date: new Date(data.date)
      }
    })

    if (existingEvent) {
      return NextResponse.json(
        { error: 'You already have an outfit planned for this date' },
        { status: 400 }
      )
    }

    // Create the new event
    const event = await prisma.outfitCalendar.create({
      data: {
        date: new Date(data.date),
        notes: data.notes,
        outfitId: data.outfitId,
        userId: session.user.id
      },
      include: { outfit: true }
    })

    return NextResponse.json(event)
  } catch (error) {
    return handleError(error, 'Could not save calendar event')
  }
}

// Update an existing calendar event
export async function PATCH(request: NextRequest) {
  // Verify user is logged in
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Need to be logged in', { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Make sure we have an event ID
    if (!data.id) {
      return NextResponse.json(
        { error: 'Missing event ID' },
        { status: 400 }
      )
    }

    // Check if event exists
    const existingEvent = await prisma.outfitCalendar.findUnique({
      where: { id: data.id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Could not find that event' },
        { status: 404 }
      )
    }

    // Verify user owns this event
    if (existingEvent.userId !== session.user.id) {
      return new NextResponse('Not allowed to update this event', { status: 403 })
    }

    // Update the event with new data
    const updatedEvent = await prisma.outfitCalendar.update({
      where: { id: data.id },
      data: {
        notes: data.notes,
        outfitId: data.outfitId,
        isCompleted: data.isCompleted
      },
      include: { outfit: true }
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    return handleError(error, 'Could not update the calendar event')
  }
}

// Remove a calendar event
export async function DELETE(request: NextRequest) {
  // First check if user is logged in
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Please log in first', { status: 401 })
  }

  // Get the event ID from URL params
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  // Make sure we have an ID to work with
  if (!id) {
    return NextResponse.json(
      { error: 'Need an event ID to delete' },
      { status: 400 }
    )
  }

  try {
    // Check if the event exists
    const existingEvent = await prisma.outfitCalendar.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Couldn't find that event" },
        { status: 404 }
      )
    }

    // Make sure the user owns this event
    if (existingEvent.userId !== session.user.id) {
      return new NextResponse("Can't delete someone else's event", { status: 403 })
    }

    // All good, delete the event
    await prisma.outfitCalendar.delete({
      where: { id }
    })

    // Return success with no content
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return handleError(error, 'Something went wrong deleting the event')
  }
}