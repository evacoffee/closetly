'use client'

import { useState, useCallback, useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOutfitCalendar } from '@/hooks/useOutfitCalendar'
import { OutfitCalendarEvent, Outfit } from '@/types/outfit'
import { EventModal } from './EventModal'
import { useOutfits } from '@/hooks/useOutfits'

interface OutfitCalendarProps {
  onSelectEvent?: (event: OutfitCalendarEvent) => void
  initialDate?: Date
}

export function OutfitCalendar({ 
  onSelectEvent, 
  initialDate = new Date() 
}: OutfitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<OutfitCalendarEvent | null>(null)
  
  const { 
    events, 
    isLoading, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useOutfitCalendar()
  
  const { outfits, isLoading: isLoadingOutfits } = useOutfits()
  const [isSaving, setIsSaving] = useState(false)

  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate])

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(weekStart, index)
      return {
        date,
        formattedDate: format(date, 'd'),
        dayName: format(date, 'EEE'),
        isToday: isSameDay(date, new Date()),
      }
    })
  }, [weekStart])

  const handleDateClick = useCallback((date: Date) => {
    const event = events.find(e => isSameDay(new Date(e.date), date))
    if (event) {
      setSelectedEvent(event)
    } else {
      setSelectedEvent(null)
      setSelectedDate(date)
    }
  }, [events])

  const handleSaveEvent = useCallback(async (data: { outfitId: string; notes: string }) => {
    if (!selectedDate) return
    
    try {
      setIsSaving(true)
      if (selectedEvent) {
        await updateEvent({
          id: selectedEvent.id,
          ...data
        })
      } else {
        await createEvent({
          date: selectedDate.toISOString(),
          ...data
        })
      }
      setSelectedDate(null)
      setSelectedEvent(null)
    } finally {
      setIsSaving(false)
    }
  }, [selectedDate, selectedEvent, createEvent, updateEvent])

  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent) return
    
    try {
      setIsSaving(true)
      await deleteEvent(selectedEvent.id)
      setSelectedEvent(null)
    } finally {
      setIsSaving(false)
    }
  }, [selectedEvent, deleteEvent])

  if (isLoading || isLoadingOutfits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading calendar...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Outfit Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentDate(prev => addDays(prev, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentDate(prev => addDays(prev, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(({ dayName }, i) => (
            <div key={i} className="text-center text-sm font-medium text-gray-500">
              {dayName}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, formattedDate, isToday }) => {
            const dayEvents = events.filter(e => isSameDay(new Date(e.date), date))
            
            return (
              <div
                key={date.toString()}
                className={`
                  border rounded-md p-2 min-h-24 cursor-pointer
                  ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                  ${selectedDate && isSameDay(selectedDate, date) ? 'ring-2 ring-blue-500' : ''}
                  hover:bg-gray-50 transition-colors
                `}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`
                    text-sm font-medium
                    ${isToday ? 'text-blue-600' : 'text-gray-900'}
                  `}>
                    {formattedDate}
                  </span>
                  <button
                    className="text-gray-400 hover:text-blue-500 p-1 -mr-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDate(date)
                      setSelectedEvent(null)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="
                        text-xs p-1 bg-blue-100 text-blue-800 
                        rounded truncate hover:bg-blue-200
                      "
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                        onSelectEvent?.(event)
                      }}
                    >
                      {event.outfit?.name || 'Outfit'}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <EventModal
        isOpen={!!selectedDate || !!selectedEvent}
        date={selectedDate || (selectedEvent ? new Date(selectedEvent.date) : new Date())}
        event={selectedEvent || undefined}
        outfits={outfits}
        onSave={handleSaveEvent}
        onCancel={() => {
          setSelectedDate(null)
          setSelectedEvent(null)
        }}
        isSaving={isSaving}
      />
    </Card>
  )
}