import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PriceEstimateResponse, BatchPriceEstimateResponse } from '@/types/booking';

interface UsePriceEstimateParams {
  tripId: string | null | undefined;
  weight?: number;
  enabled?: boolean;
}

interface UseBatchPriceEstimateParams {
  tripId: string | null | undefined;
  weights?: number[];
  enabled?: boolean;
}

/**
 * Hook for fetching real-time price estimates for a trip + weight combination
 * Used for displaying price estimates on trip cards and in booking forms
 */
export function usePriceEstimate({
  tripId,
  weight = 5, // Default 5kg for estimates
  enabled = true,
}: UsePriceEstimateParams) {
  return useQuery<PriceEstimateResponse>({
    queryKey: ['priceEstimate', tripId, weight],
    queryFn: async () => {
      if (!tripId) {
        throw new Error('Trip ID is required');
      }

      const params = new URLSearchParams({
        tripId,
        weight: weight.toString(),
      });

      const response = await fetch(`/api/booking/price-estimate?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch price estimate');
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!tripId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching batch price estimates for multiple weights
 * Useful for showing price ranges (e.g., "€35-€60") on trip cards
 */
export function useBatchPriceEstimate({
  tripId,
  weights = [2, 5, 10, 20],
  enabled = true,
}: UseBatchPriceEstimateParams) {
  return useQuery<BatchPriceEstimateResponse>({
    queryKey: ['batchPriceEstimate', tripId, weights],
    queryFn: async () => {
      if (!tripId) {
        throw new Error('Trip ID is required');
      }

      const response = await fetch('/api/booking/price-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId,
          weights,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch batch price estimate');
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!tripId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for getting a debounced price estimate (useful for real-time updates as user changes weight)
 */
export function useDebouncedPriceEstimate({
  tripId,
  weight,
  debounceMs = 300,
  enabled = true,
}: UsePriceEstimateParams & { debounceMs?: number }) {
  const debouncedWeight = useDebounceValue(weight, debounceMs);

  return usePriceEstimate({
    tripId,
    weight: debouncedWeight,
    enabled,
  });
}

/**
 * Utility hook for debouncing values (used by useDebouncedPriceEstimate)
 */
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Import these at the top of the file
import { useState, useEffect } from 'react';

/**
 * Hook for prefetching price estimates (performance optimization)
 * Call this when user hovers over or focuses on a trip card
 */
export function usePrefetchPriceEstimate() {
  const queryClient = useQueryClient();

  return (tripId: string, weight = 5) => {
    queryClient.prefetchQuery({
      queryKey: ['priceEstimate', tripId, weight],
      queryFn: async () => {
        const params = new URLSearchParams({
          tripId,
          weight: weight.toString(),
        });

        const response = await fetch(`/api/booking/price-estimate?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to prefetch price estimate');
        }

        return response.json();
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

// Import this at the top of the file
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for calculating price client-side (fallback when API is unavailable)
 */
export function useClientSidePriceCalculation(trip: any, weight: number) {
  return useQuery({
    queryKey: ['clientSidePrice', trip?.id, weight],
    queryFn: () => {
      if (!trip) {
        throw new Error('Trip data is required');
      }

      // Use the existing calculatePaymentAmount utility
      const { calculatePaymentAmount } = require('@/lib/utils');
      const priceDetails = calculatePaymentAmount(trip, weight);

      return {
        success: true,
        data: {
          tripId: trip.id,
          weight,
          currency: trip.price.currency || 'EUR',
          priceBreakdown: priceDetails,
          formattedPrice: `€${priceDetails.total.toFixed(2)}`,
        }
      };
    },
    enabled: !!trip && weight > 0,
    staleTime: 0, // Always calculate fresh since it's client-side
  });
}