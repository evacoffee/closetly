export interface PaymentRequest {
  listingId: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  
  return {
    success: true,
    message: 'Payment processed successfully'
  };
}
