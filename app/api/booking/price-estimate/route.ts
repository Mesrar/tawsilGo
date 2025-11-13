import { NextRequest, NextResponse } from 'next/server';
import { calculatePaymentAmount } from '@/lib/utils';
import { tripService } from '@/app/services/tripService';

/**
 * API endpoint to get price estimates for a trip + weight combination
 * Used for displaying price estimates on trip cards before selection
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');
    const weight = Number(searchParams.get('weight')) || 5; // Default 5kg for estimates

    // Validate required parameters
    if (!tripId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Trip ID is required'
          }
        },
        { status: 400 }
      );
    }

    if (weight < 0.1 || weight > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Weight must be between 0.1kg and 100kg'
          }
        },
        { status: 400 }
      );
    }

    // Fetch trip details
    const tripResponse = await tripService.getTripById(tripId);

    if (!tripResponse.success || !tripResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Trip not found'
          }
        },
        { status: 404 }
      );
    }

    const trip = tripResponse.data.trip;

    // Calculate price estimate
    const priceDetails = calculatePaymentAmount(trip, weight);

    // Calculate MAD equivalent (using fixed rate for now)
    const madRate = 10.5; // EUR to MAD conversion rate
    const madTotal = priceDetails.total * madRate;

    // Return comprehensive price estimate
    return NextResponse.json({
      success: true,
      data: {
        tripId,
        weight,
        currency: trip.price.currency || 'EUR',
        priceBreakdown: {
          basePrice: priceDetails.base,
          weightCost: priceDetails.weightCost,
          insurance: priceDetails.insurance,
          tax: priceDetails.tax,
          total: priceDetails.total,
        },
        madEquivalent: {
          total: parseFloat(madTotal.toFixed(2)),
          rate: madRate,
        },
        formattedPrice: {
          eur: `€${priceDetails.total.toFixed(2)}`,
          mad: `${madTotal.toFixed(0)} MAD`,
        },
        // Additional context for UI
        displayText: weight === 5
          ? `From €${priceDetails.total.toFixed(2)} for 5kg`
          : `€${priceDetails.total.toFixed(2)} for ${weight}kg`,
        // Minimum price for the trip (useful for anchoring)
        minimumPrice: trip.price.minimumPrice,
        pricePerKg: trip.price.pricePerKg,
        weightThreshold: trip.price.weightThreshold,
      },
      meta: {
        calculatedAt: new Date().toISOString(),
        weightUsed: weight,
      }
    });

  } catch (error) {
    console.error('Price estimate error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to calculate price estimate',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for batch price estimates (multiple weights)
 * Useful for showing price ranges on trip cards
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, weights = [2, 5, 10, 20] } = body;

    if (!tripId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Trip ID is required'
          }
        },
        { status: 400 }
      );
    }

    // Fetch trip details once
    const tripResponse = await tripService.getTripById(tripId);

    if (!tripResponse.success || !tripResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Trip not found'
          }
        },
        { status: 404 }
      );
    }

    const trip = tripResponse.data.trip;

    // Calculate estimates for all requested weights
    const estimates = weights.map(weight => {
      const priceDetails = calculatePaymentAmount(trip, weight);
      const madRate = 10.5;
      const madTotal = priceDetails.total * madRate;

      return {
        weight,
        priceBreakdown: priceDetails,
        madEquivalent: parseFloat(madTotal.toFixed(2)),
        formattedPrice: `€${priceDetails.total.toFixed(2)}`,
        displayText: `${weight}kg: €${priceDetails.total.toFixed(2)}`,
      };
    });

    // Find minimum and maximum for range display
    const prices = estimates.map(e => e.priceBreakdown.total);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return NextResponse.json({
      success: true,
      data: {
        tripId,
        estimates,
        priceRange: {
          minimum: minPrice,
          maximum: maxPrice,
          displayText: prices.length === 1
            ? `€${minPrice.toFixed(2)}`
            : `€${minPrice.toFixed(2)} - €${maxPrice.toFixed(2)}`,
        },
        defaultEstimate: estimates.find(e => e.weight === 5) || estimates[0],
      },
      meta: {
        calculatedAt: new Date().toISOString(),
        weightsCalculated: weights,
      }
    });

  } catch (error) {
    console.error('Batch price estimate error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to calculate batch price estimates',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}