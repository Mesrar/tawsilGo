
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
     // Extract the trip ID from the request parameters
     const { id } = req.query;
    const parcelApiUrl = process.env.PARCEL_API_URL;
    const response = await fetch(`${parcelApiUrl}/driver/trips/${id}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        "Falied to fetch trips",
        response.status,
        await response.text()
      );
      throw new Error("Failed to fetch trips");
    }

    // Assuming the backend returns a JSON array of trips like the example provided.
    const tripsData = await response.json();

    res
      .status(201)
      .json({ trip: tripsData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
