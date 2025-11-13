import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/driver/me
 * Get current authenticated user's driver profile
 * Returns null if user is not a driver
 * Requires authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const response = await fetch(`${driverApiUrl}/api/v1/drivers/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    // If not found (user is not a driver), return null
    if (response.status === 404) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error || "Failed to fetch driver profile",
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get driver profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
