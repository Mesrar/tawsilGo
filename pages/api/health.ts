import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Health check endpoint for debugging environment configuration
 *
 * This endpoint helps verify that environment variables are correctly loaded
 * in production. It should be removed or secured after debugging.
 *
 * Usage: GET /api/health
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    env: {
      verifyApiUrl: process.env.VERIFY_API_URL || 'NOT SET',
      parcelApiUrl: process.env.PARCEL_API_URL || 'NOT SET',
      paymentApiUrl: process.env.PAYMENT_API_URL || 'NOT SET',
      driverApiUrl: process.env.DRIVER_API_URL || 'NOT SET',
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
    }
  });
}
