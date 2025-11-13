import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/tracking/{id}:
 *   get:
 *     description: Retrieves tracking information for a specific booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID or tracking number
 *     responses:
 *       200:
 *         description: Tracking information retrieved successfully
 *       400:
 *         description: Invalid tracking ID format
 *       404:
 *         description: Tracking information not found
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
    // Get authentication token from cookies (optional for tracking - public feature)
    const token = req.cookies.token;

    // Validate tracking ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid tracking ID' });
    }

    // Get API base URL from environment variable or use a default
    const API_BASE_URL = process.env.PARCEL_API_URL || 'http://localhost:8080';

    // Log that we're making the request (for debugging)
    console.log(`Fetching tracking info for ID: ${id} from ${API_BASE_URL}/tracking/${id}`);

    try {
      // Make a direct fetch request to the Go backend
      // Include token if available for enhanced tracking data
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/tracking/${id}`, {
        method: 'GET',
        headers
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
          return res.status(404).json({
            message: 'Tracking information not found for this ID'
          });
        } else if (response.status === 400) {
          return res.status(400).json({
            message: 'Invalid tracking ID format'
          });
        }

        return res.status(response.status || 500).json({
          message: data.message || 'An error occurred fetching tracking information'
        });
      }

      // Return the tracking information
      return res.status(200).json(data);
    } catch (apiError) {
      console.error('API fetch error:', apiError);

      // For development: return mock data when backend is unavailable
      if (process.env.NODE_ENV === 'development') {
        console.log('Backend unavailable, returning mock tracking data');
        return res.status(200).json({
          booking: {
            id: id as string,
            trackingNumber: `TR-${String(id).slice(0, 8)}`,
            status: 'in_transit',
            pickupLocation: 'Paris, France',
            deliveryLocation: 'Casablanca, Morocco',
            estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          currentStatus: 'in_transit',
          statusHistory: [
            {
              status: 'pending',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              location: 'Paris, France'
            },
            {
              status: 'picked_up',
              timestamp: new Date(Date.now() - 43200000).toISOString(),
              location: 'Paris Sorting Center'
            },
            {
              status: 'in_transit',
              timestamp: new Date(Date.now() - 21600000).toISOString(),
              location: 'En route to Morocco'
            }
          ]
        });
      }

      return res.status(500).json({
        message: 'Failed to communicate with tracking service',
        error: apiError instanceof Error ? apiError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Unhandled error in tracking API route:', error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
