// pages/api/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const verifyApiUrl = process.env.VERIFY_API_URL;

      console.log("=== VERIFY EMAIL DEBUG ===");
      console.log("Request body:", req.body);
      console.log("Backend URL:", `${verifyApiUrl}/verify-email`);

      const response = await fetch(`${verifyApiUrl}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });

      const body = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Body:", body);
      console.log("=========================");

      if (!response.ok) {
        res.status(response.status).json({ error: body.error || 'Verification failed' });
      } else {
        res.status(200).json(
          { 
            message: 'Email verified successfully',
            ok: true,
            success: true 
          }
        );
      }
    } catch (error) {
      console.error("Error --->", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}