import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     description: Retrieves details for a specific booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID (UUID format)
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *       400:
 *         description: Invalid booking ID format
 *       401:
 *         description: Unauthorized - User not authenticated
 *       403:
 *         description: Forbidden - not authorized to view this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 *     security:
 *       - BearerAuth: []
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  // Only allow GET requests for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get authentication token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized', 
        message: 'Authentication required to view booking details'
      });
    }

    // Validate booking ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Get API base URL from environment variable or use a default
    const API_BASE_URL = process.env.PARCEL_API_URL || 'http://localhost:8080';
    
    // Log that we're making the request (for debugging)
    console.log(`Fetching booking details for ID: ${id} from ${API_BASE_URL}/customer/bookings/${id}`);

    try {
      // Make a direct fetch request to the Go backend
      const response = await fetch(`${API_BASE_URL}/customer/bookings/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Parse the response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }
      
      // Handle error responses
      if (!response.ok) {
        console.error('Backend API error:', data);
        
        if (response.status === 404) {
          return res.status(404).json({ message: 'Booking not found' });
        } else if (response.status === 400) {
          return res.status(400).json({ message: 'Invalid booking ID format' });
        } else if (response.status === 403) {
          return res.status(403).json({ message: 'You are not authorized to view this booking' });
        }
        
        return res.status(response.status || 500).json({ 
          message: data.message || 'An error occurred fetching booking details' 
        });
      }
      
      // Return the booking details
      return res.status(200).json(data);
    } catch (apiError) {
      console.error('API fetch error:', apiError);
      return res.status(500).json({ 
        message: 'Failed to communicate with booking service',
        error: apiError instanceof Error ? apiError.message : 'Unknown error'
      });
    }
    
  } catch (error) {
    console.error('Unhandled error in booking API route:', error);
    return res.status(500).json({ 
      message: 'An error occurred while processing your request',
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}