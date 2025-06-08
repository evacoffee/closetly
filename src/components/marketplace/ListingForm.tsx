import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';

interface ListingFormProps {
  onSubmit: (listing: ListingFormData) => void;
}

interface ListingFormData {
  name: string;
  price: number;
  condition: string;
  size: string;
  description: string;
  imageUrl: string;
}

export function ListingForm({ onSubmit }: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>({
    name: '',
    price: 0,
    condition: 'Excellent',
    size: 'M',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Item Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Price</Label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Current price: {formatCurrency(formData.price)}
        </p>
      </div>

      <div>
        <Label>Condition</Label>
        <Select
          value={formData.condition}
          onChange={(value) => setFormData({ ...formData, condition: value })}
          options={['New', 'Like New', 'Excellent', 'Good', 'Fair']}
        />
      </div>

      <div>
        <Label>Size</Label>
        <Select
          value={formData.size}
          onChange={(value) => setFormData({ ...formData, size: value })}
          options={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your item..."
        />
      </div>

      <div>
        <Label>Image URL</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="Enter image URL"
        />
      </div>

      <Button type="submit" className="w-full">
        List Item
      </Button>
    </form>
  );
}
