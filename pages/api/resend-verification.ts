import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      const verifyApiUrl = process.env.VERIFY_API_URL;

      if (!verifyApiUrl) {
        return res.status(500).json({
          success: false,
          error: { message: 'Server configuration error' }
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email is required' }
        });
      }

      // Call the backend resend endpoint - only send email as per API spec
      const response = await fetch(`${verifyApiUrl}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const body = await response.json();
      console.log("Resend Verification Response --->", body);

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: {
            message: body.error || body.message || 'Failed to resend verification code',
            status: response.status
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          success: true,
          message: body.message || 'Verification code has been resent'
        }
      });
    } catch (error) {
      console.error("Resend Verification Error --->", error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal Server Error' }
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
