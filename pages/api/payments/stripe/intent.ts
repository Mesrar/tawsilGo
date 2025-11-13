import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received request for payment intent:', req.body);

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
    const { 
      paymentId,
      bookingId,
      amount, 
      currency = 'EUR',
      description = 'Parcel delivery payment',
      metadata = {}
    } = req.body;

    // Basic validation
    if (!bookingId) {
      return res.status(400).json({ error: 'Missing required parameter: bookingId' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const apiUrl = process.env.PAYMENT_API_URL ;
    console.log('Using API URL for payment intent:', apiUrl);
    
    if (!apiUrl) {
      console.error('API URL not configured');
      return res.status(500).json({ error: 'API URL not configured' });
    }

    // Call the Go backend's Stripe intent endpoint
    const response = await fetch(`${apiUrl}/payments/stripe/intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bookingId,
        amount,
        currency,
        method: 'stripe', // Force to stripe for this endpoint
        description,
        metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata)
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error from payment intent API:', errorData);
      return res.status(response.status).json({ 
        error: errorData.message || errorData.error || response.statusText,
        details: errorData
      });
    }

    const intentData = await response.json();
    return res.status(201).json(intentData);

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred while creating payment intent',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}