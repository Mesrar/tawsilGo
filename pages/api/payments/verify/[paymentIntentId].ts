import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  try {
    // Get the payment intent ID from the URL parameter
    const { paymentIntentId } = req.query;

    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return res.status(400).json({ error: 'Missing payment intent ID' });
    }

    const apiUrl = process.env.PAYMENT_API_URL;
    if (!apiUrl) {
      return res.status(500).json({ error: 'API URL not configured' });
    }

    // Call the Go backend's verify endpoint
    // Note: Backend expects payment_intent parameter, not paymentId
    
    const response = await fetch(`${apiUrl}/payments/stripe/verify?payment_intent=${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.message || errorData.error || response.statusText,
        details: errorData
      });
    }

    const verificationData = await response.json();
    return res.status(200).json(verificationData);

  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred while verifying the payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}