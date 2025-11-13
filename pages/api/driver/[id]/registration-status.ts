import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/driver/[id]/registration-status
 * Get registration status for a driver - Step 5 tracking
 * Shows progress, completed steps, and missing items
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

  if (req.method !== "GET") {
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
      `${driverApiUrl}/api/v1/drivers/${driverId}/registration-status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error || "Failed to fetch registration status",
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Registration status error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
