import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Define schema for query parameters validation
const querySchema = z.object({
  status: z.string().optional(),
  page: z.string().default('1'),
  limit: z.string().default('10')
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only GET requests are supported for this endpoint'
    });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication required to access booking information'
    });
  }

  try {
    // Validate query parameters
    const validationResult = querySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid parameters',
        message: 'The provided query parameters are invalid',
        details: validationResult.error.errors
      });
    }

    // Extract validated query parameters
    const { status, page, limit } = validationResult.data;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    const apiUrl = process.env.PARCEL_API_URL;
    if (!apiUrl) {
      console.error('PARCEL_API_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'The server is not properly configured to process this request'
      });
    }

    // Call the Go backend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiUrl}/customer/bookings?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse error response
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { rawError: errorText };
        }

        // Handle specific status codes with appropriate messages
        switch (response.status) {
          case 400:
            return res.status(400).json({
              error: 'Bad request',
              message: errorData.message || 'Invalid request parameters',
              details: errorData
            });
          case 401:
            return res.status(401).json({
              error: 'Authentication error',
              message: 'Your session has expired. Please log in again.'
            });
          case 403:
            return res.status(403).json({
              error: 'Access denied',
              message: 'You don\'t have permission to access these bookings'
            });
          case 404:
            return res.status(404).json({
              error: 'Not found',
              message: 'No bookings found matching your criteria'
            });
          case 429:
            return res.status(429).json({
              error: 'Too many requests',
              message: 'Please try again later'
            });
          case 500:
          case 502:
          case 503:
          case 504:
            console.error(`Backend service error: ${response.status}`, errorData);
            return res.status(502).json({
              error: 'Service unavailable',
              message: 'The booking service is temporarily unavailable. Please try again later.'
            });
          default:
            console.error(`Unexpected error from backend: Status ${response.status}`, errorData);
            return res.status(response.status).json({
              error: 'Request failed',
              message: errorData.message || 'Failed to retrieve booking information',
              details: errorData
            });
        }
      }

      const bookingsData = await response.json();
      
      // Validate response data structure
      if (!bookingsData || (Array.isArray(bookingsData) && bookingsData.length === 0)) {
        return res.status(200).json({ 
          bookings: [],
          pagination: { page: Number(page), limit: Number(limit), total: 0 },
          message: 'No bookings found'
        });
      }

      return res.status(200).json({
        ...bookingsData,
        success: true
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle network-level errors
      if (fetchError instanceof Error) {
        const errorMessage = fetchError.name === 'AbortError' 
          ? 'Request timed out. The service is taking too long to respond.'
          : 'Unable to connect to the bookings service.';
          
        console.error('Network error while fetching bookings:', fetchError);
        return res.status(503).json({
          error: 'Service unavailable',
          message: errorMessage
        });
      }
      
      throw fetchError; // Re-throw if it's not a standard error
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unhandled error in bookings API:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' 
        ? { message: error instanceof Error ? error.message : String(error) }
        : undefined
    });
  }
}