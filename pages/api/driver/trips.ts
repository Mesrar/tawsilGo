import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const stopSchema = z.object({
  location: z.string().min(1, "Location is required"),
  arrivalTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  stopType: z.enum(["pickup", "delivery", "both"]),
  order: z.number().int().positive("Order must be a positive integer"),
});

const tripSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  capacity: z.number().min(0.1, "Capacity must be greater than 0"),
  price: z.number().min(0.1, "Price must be greater than 0"),
  stops: z.array(stopSchema).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get JWT token from NextAuth session
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    const parcelApiUrl = process.env.PARCEL_API_URL;
    const response = await fetch(`${parcelApiUrl}/driver/trips`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Failed to fetch trips",
        response.status,
        errorText
      );
      return res.status(response.status).json({
        success: false,
        error: "Failed to fetch trips from backend",
        details: errorText
      });
    }

    // Assuming the backend returns a JSON array of trips
    const tripsData = await response.json();

    return res.status(200).json({
      success: true,
      trips: tripsData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors
      });
    }
    console.error("Driver trips API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
