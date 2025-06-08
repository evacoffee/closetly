'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { processPayment } from '@/lib/payment';

interface PaymentProps {
  amount: number;
  listingId: string;
}

export default function PaymentPage({ params }: { params: { listingId: string } }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const listingId = params.listingId;
  const amount = 49.99;

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const paymentRequest = {
        listingId,
        amount
      };

      const result = await processPayment(paymentRequest);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during payment processing');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Listing ID:</span>
            <span className="font-mono">{listingId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Amount:</span>
            <span className="font-bold">{formatCurrency(49.99)}</span>
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
