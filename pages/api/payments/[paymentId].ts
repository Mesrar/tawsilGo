import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId } = req.query;

  if (!paymentId || Array.isArray(paymentId)) {
    return res.status(400).json({ error: 'Invalid payment ID' });
  }

  try {
    // Get JWT token from NextAuth session
    const sessionToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!sessionToken || !sessionToken.accessToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const token = sessionToken.accessToken as string;

    // Fetch payment details from payment service
    const paymentApiUrl = process.env.PAYMENT_API_URL;
    const response = await fetch(`${paymentApiUrl}/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle different error responses
    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage;
      
      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.message || errorJson.error || 'Failed to fetch payment details';
      } catch (e) {
        errorMessage = errorBody || `Error: ${response.status}`;
      }

      // Forward the appropriate status code
      return res.status(response.status).json({ 
        error: errorMessage,
        code: response.status 
      });
    }

    // Return the payment details
    const paymentData = await response.json();
    return res.status(200).json(paymentData);
    
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}