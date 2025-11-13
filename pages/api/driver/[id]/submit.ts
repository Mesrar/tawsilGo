import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/driver/[id]/submit
 * Submit driver profile for admin verification - Step 4 of driver registration
 * Validates that all required documents and vehicle info are present
 * Requires authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: driverId } = req.query;

  if (!driverId || typeof driverId !== "string") {
    return res.status(400).json({ error: "Driver ID is required" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get JWT token from session
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const driverApiUrl =
      process.env.DRIVER_API_URL || "http://localhost:8084";

    // Forward request to driver-service
    const response = await fetch(
      `${driverApiUrl}/api/v1/drivers/${driverId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error || data.message || "Failed to submit for verification",
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
