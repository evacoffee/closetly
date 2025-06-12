import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Outfit, OutfitCalendarEvent } from '@/types/outfit';

interface EventModalProps {
  isOpen: boolean;
  date: Date;
  event?: OutfitCalendarEvent;
  outfits: Outfit[];
  onSave: (data: { outfitId: string; notes: string }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function EventModal({ isOpen, date, event, outfits, onSave, onCancel, isSaving }: EventModalProps) {
  const [notes, setNotes] = React.useState(event?.notes || '');
  const [outfitId, setOutfitId] = React.useState(event?.outfitId || '');

  React.useEffect(() => {
    if (event) {
      setNotes(event.notes || '');
      setOutfitId(event.outfitId);
    } else {
      setNotes('');
      setOutfitId('');
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ outfitId, notes });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {event ? 'Edit Event' : 'Add Event'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input 
              type="text" 
              value={format(date, 'PPP')} 
              disabled 
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="outfit" className="block text-sm font-medium mb-1">
              Outfit
            </label>
            <select
              id="outfit"
              value={outfitId}
              onChange={(e) => setOutfitId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select an outfit</option>
              {outfits.map((outfit) => (
                <option key={outfit.id} value={outfit.id}>
                  {outfit.name || `Outfit ${outfit.id.slice(0, 6)}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes about this event..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !outfitId}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}