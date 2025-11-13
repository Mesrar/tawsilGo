import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {


    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    console.log(JSON.stringify(req.body))
    try {
      const parcelApiUrl = process.env.PARCEL_API_URL;
      const response = await fetch(`${parcelApiUrl}/driver/trips`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify(req.body),
      });


      const data = await response.json();

      console.log(data)
      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          message: data.message || 'Trip creation failed'
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