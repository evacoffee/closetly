import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartOutfitRecommender } from '../SmartOutfitRecommendations';

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SmartOutfitRecommender', () => {
  const mockOutfits = [
    {
      id: '1',
      name: 'Test Outfit',
      items: [
        { id: '1', name: 'T-Shirt', type: 'Top', color: 'blue', imageUrl: '/test.jpg' },
      ],
      colors: ['blue'],
      categories: ['casual'],
      reason: 'Great for testing',
      confidence: 0.9,
      weatherCheck: { condition: 'Sunny', temp: 22 },
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockOutfits),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<SmartOutfitRecommender />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays outfit cards after loading', async () => {
    render(<SmartOutfitRecommender />);
    await waitFor(() => {
      expect(screen.getByText('Test Outfit')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    render(<SmartOutfitRecommender />);
    const refreshButton = await screen.findByText('Refresh');
    fireEvent.click(refreshButton);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles like button click', async () => {
    render(<SmartOutfitRecommender />);
    const likeButton = await screen.findByLabelText('Like outfit');
    fireEvent.click(likeButton);
    // Add assertion for like functionality
  });

  it('handles save button click', async () => {
    render(<SmartOutfitRecommender />);
    const saveButton = await screen.findByLabelText('Save outfit');
    fireEvent.click(saveButton);
    // Add assertion for save functionality
  });

  it('filters outfits based on preferences', async () => {
    render(<SmartOutfitRecommender showPrefsForm={true} />);
    const occasionSelect = await screen.findByLabelText('Occasion');
    fireEvent.change(occasionSelect, { target: { value: 'work' } });
    // Add assertion for filtering
  });
});