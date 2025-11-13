import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/driver/apply
 * Apply for driver role - Step 1 of driver registration
 * Requires authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    // Get driver service URL from environment
    const driverApiUrl =
      process.env.DRIVER_API_URL || "http://localhost:8084";

    // Forward request to driver-service
    const response = await fetch(`${driverApiUrl}/api/v1/drivers/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error || data.message || "Failed to apply for driver role",
      });
    }

    // Return success response
    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Driver apply error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
