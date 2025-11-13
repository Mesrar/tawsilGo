import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Define TypeScript interfaces for consistent responses
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  details?: any;
  [key: string]: any;
}

// Define sender/receiver details schema
const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required')
});

// Define parcel schema
const ParcelSchema = z.object({
  departure: z.string().min(1, 'Departure is required'),
  destination: z.string().min(1, 'Destination is required'),
  weight: z.number().positive('Weight must be positive'),
  packagingType: z.string().min(1, 'Packaging type is required'),
  specialRequirements: z.string().optional(),
  senderDetails: ContactSchema,
  receiverDetails: ContactSchema
});

// Define the combined booking creation schema
const BookingCreateSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  parcel: ParcelSchema
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed',
      message: 'Only POST requests are supported for this endpoint'
    });
  }

  try {
    // Get auth token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized', 
        message: 'Authentication required to create a booking'
      });
    }

    // Validate request body with Zod
    const validationResult = BookingCreateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'The provided booking data is invalid',
        details: validationResult.error.format()
      });
    }

    // Get validated data
    const { tripId, parcel } = validationResult.data;
    
    // Get API URL from environment variables
    const apiUrl = process.env.PARCEL_API_URL;
    if (!apiUrl) {
      console.error('PARCEL_API_URL environment variable is not configured');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error',
        message: 'The server is not properly configured to process this request'
      });
    }

    // Call backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      // Call the backend API to create booking with atomic transaction
      const response = await fetch(`${apiUrl}/customer/bookings/create-with-parcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId,
          parcel
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      if (!response.ok) {
        // Handle error response
        let errorData: any = {};
        
        try {
          errorData = await response.json();
        } catch (e) {
          // If JSON parsing fails, get text content
          const textContent = await response.text().catch(() => '');
          errorData = { rawError: textContent || 'No error details available' };
        }
        
        console.error(`API error response (${response.status}):`, errorData);
        
        // Handle specific error status codes
        switch (response.status) {
          case 400:
            return res.status(400).json({
              success: false,
              error: 'Bad request',
              message: errorData.message || 'Invalid booking data',
              details: errorData
            });
          case 401:
            return res.status(401).json({
              success: false,
              error: 'Authentication failed',
              message: 'Your session has expired. Please log in again.'
            });
          case 403:
            return res.status(403).json({
              success: false,
              error: 'Access denied',
              message: 'You don\'t have permission to create this booking'
            });
          case 404:
            return res.status(404).json({
              success: false,
              error: 'Not found',
              message: errorData.message || 'The requested trip was not found',
              details: errorData
            });
          case 409:
            return res.status(409).json({
              success: false,
              error: 'Conflict',
              message: errorData.message || 'The trip is full or no longer available',
              details: errorData
            });
          case 422:
            return res.status(422).json({
              success: false,
              error: 'Validation error',
              message: errorData.message || 'The booking request could not be processed',
              details: errorData
            });
          case 429:
            return res.status(429).json({
              success: false,
              error: 'Too many requests',
              message: 'Please try again later'
            });
          case 500:
          case 502:
          case 503:
          case 504:
            console.error(`Backend service error: ${response.status}`, errorData);
            return res.status(502).json({
              success: false,
              error: 'Service unavailable',
              message: 'The booking service is temporarily unavailable. Please try again later.'
            });
          default:
            return res.status(response.status).json({
              success: false,
              error: 'Request failed',
              message: errorData.message || errorData.error || 'Failed to create booking',
              details: errorData
            });
        }
      }

      // Return success response with booking details
      const bookingData = await response.json();
      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        bookingId: bookingData.id,
        data: bookingData
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle network errors
      if (fetchError instanceof Error) {
        const isTimeout = fetchError.name === 'AbortError';
        const errorMessage = isTimeout
          ? 'Request timed out. The service is taking too long to respond.'
          : 'Unable to connect to the booking service.';
          
        console.error(`Network error while creating booking: ${fetchError.name}`, fetchError);
        
        return res.status(503).json({
          success: false,
          error: 'Service unavailable',
          message: errorMessage
        });
      }
      
      throw fetchError; // Re-throw unexpected errors
    }
  } catch (error) {
    // Log and handle unexpected errors
    console.error('Unhandled error in booking creation API:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while creating your booking',
      details: process.env.NODE_ENV === 'development' 
        ? { message: error instanceof Error ? error.message : String(error) }
        : undefined
    });
  }
}