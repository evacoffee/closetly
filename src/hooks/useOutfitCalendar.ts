import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { OutfitCalendarEvent, CreateCalendarEventInput, UpdateCalendarEventInput } from '@/types/outfit';

interface UseOutfitCalendarReturn {
  events: OutfitCalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (data: CreateCalendarEventInput) => Promise<OutfitCalendarEvent | null>;
  updateEvent: (data: UpdateCalendarEventInput) => Promise<OutfitCalendarEvent | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useOutfitCalendar(): UseOutfitCalendarReturn {
  const [events, setEvents] = React.useState<OutfitCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const clearError = React.useCallback(() => setError(null), []);

  const fetchEvents = React.useCallback(async () => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await fetch('/api/calendar');
      if (!response.ok) throw new Error('Failed to fetch calendar events');
      setEvents(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [session, router, clearError]);

  const createEvent = React.useCallback(async (data: CreateCalendarEventInput): Promise<OutfitCalendarEvent | null> => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return null;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create calendar event');
      }

      const newEvent = await response.json();
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create calendar event');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session, router, clearError]);

  const updateEvent = React.useCallback(async (data: UpdateCalendarEventInput): Promise<OutfitCalendarEvent | null> => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return null;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await fetch('/api/calendar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update calendar event');
      }

      const updatedEvent = await response.json();
      setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update calendar event');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session, router, clearError]);

  const deleteEvent = React.useCallback(async (id: string): Promise<boolean> => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/calendar?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete calendar event');
      }
      setEvents(prev => prev.filter(event => event.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete calendar event');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, router, clearError]);

  return { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent, clearError };
}
