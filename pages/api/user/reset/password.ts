import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    console.log(req.body)
    try {
      const verifyApiUrl = process.env.VERIFY_API_URL;
      const response = await fetch(`${verifyApiUrl}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          message: data.details || 'Password reseted'
        });
      }

      // Return success response with driver ID
      res.status(200).json({
        success: true,
        data: {
          id: data.id // Make sure your Gin API returns the created driver ID
        }
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  }
}