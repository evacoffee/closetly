'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface ListItem {
  id: string;
  name: string;
  price: number;
  condition: string;
  imageUrl: string;
  seller: string;
  size: string;
}

const initialListings: ListItem[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    price: 49.99,
    condition: 'Excellent',
    imageUrl: '/images/listings/denim-jacket.jpg',
    seller: 'Fashionista123',
    size: 'M'
  },
  {
    id: '2',
    name: 'Leather Boots',
    price: 79.99,
    condition: 'Like New',
    imageUrl: '/images/listings/boots.jpg',
    seller: 'BohoChic',
    size: '9'
  }
];

export default function MarketplacePage() {
  const [listings, setListings] = useState(initialListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = selectedCondition === 'All' || listing.condition === selectedCondition;
    const matchesSize = selectedSize === 'All' || listing.size === selectedSize;
    return matchesSearch && matchesCondition && matchesSize;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Link 
          href="/marketplace/listing"
          className="w-full"
        >
          <Button className="w-full">
            List Item
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <Label>Search</Label>
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Label>Condition</Label>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {['All', 'New', 'Like New', 'Excellent', 'Good', 'Fair'].map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Label>Size</Label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="p-4">
            <div className="relative aspect-square">
              <img
                src={listing.imageUrl}
                alt={listing.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">{listing.name}</h3>
              <p className="text-sm text-muted-foreground">
                Size: {listing.size} • Condition: {listing.condition}
              </p>
              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(listing.price)}
              </p>
              <p className="text-sm text-muted-foreground">Seller: {listing.seller}</p>
              <Link 
                href={`/marketplace/payment/${listing.id}`}
                className="w-full"
              >
                <Button className="w-full">
                  Buy Now
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
