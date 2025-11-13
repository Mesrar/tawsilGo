import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('========================================');
  console.log('PAYMENT CREATE API CALLED');
  console.log('Method:', req.method);
  console.log('Cookies:', Object.keys(req.cookies));
  console.log('========================================');

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get JWT token from NextAuth session
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  console.log('=== TOKEN EXTRACTION DEBUG ===');
  console.log('Session token object exists:', !!sessionToken);
  console.log('Session token keys:', sessionToken ? Object.keys(sessionToken) : 'N/A');
  console.log('Has accessToken property:', sessionToken?.accessToken !== undefined);
  console.log('accessToken type:', typeof sessionToken?.accessToken);

  if (!sessionToken || !sessionToken.accessToken) {
    console.error('No valid session or access token found');
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required to create a payment'
    });
  }

  const token = sessionToken.accessToken as string;
  console.log('Token length:', token.length);
  console.log('Token value type:', typeof token);
  console.log('Token (first 60 chars):', token.substring(0, 60) + '...');
  console.log('Token (last 30 chars):', '...' + token.substring(token.length - 30));
  console.log('Full token:', token);
  console.log('=== END TOKEN DEBUG ===');

  try {
    // Extract required fields
    const { 
      bookingId,
      amount, 
      currency = 'EUR',
      description = 'Parcel delivery payment',
      method = 'stripe', 
      metadata = {}
    } = req.body;

    // Basic validation
    if (!bookingId) {
      return res.status(400).json({ error: 'Missing required parameter: bookingId' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const apiUrl = process.env.PAYMENT_API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.PARCEL_API_URL;
    console.log('Using API URL:', apiUrl);
    
    if (!apiUrl) {
      console.error('API URL not configured');
      // Fall back to mock if API URL is missing
      return res.status(201).json({
        success: true,
        paymentId: `payment-${Date.now()}`,
        payment: {
          id: `payment-${Date.now()}`,
          bookingId,
          amount,
          currency,
          status: 'created',
          createdAt: new Date().toISOString()
        }
      });
    }

    // Call your backend API with real data using native fetch instead of apiClient
    // This is a standard fetch call, not your custom apiClient
    // Use /payments/stripe/intent endpoint as specified by backend team
    const backendUrl = `${apiUrl}/payments/stripe/intent`;
    console.log('Calling backend URL:', backendUrl);

    // Backend expects only these fields (no metadata or tripId at root level)
    const requestBody = {
      bookingId,
      amount,
      currency,
      method,
      description
    };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error from payment API:', errorData);
      console.error('Full error response:', JSON.stringify(errorData, null, 2));
      return res.status(response.status).json({
        error: errorData.message || errorData.error || response.statusText,
        details: errorData
      });
    }

    const paymentData = await response.json();
    console.log('Payment created successfully:', paymentData);

    // Backend returns: { paymentId, clientSecret, paymentIntentId }
    return res.status(201).json({
      success: true,
      paymentId: paymentData.paymentId,
      clientSecret: paymentData.clientSecret,
      paymentIntentId: paymentData.paymentIntentId,
      data: paymentData
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred while creating payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}