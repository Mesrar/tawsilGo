import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/driver/[id]/vehicle
 * Add vehicle information - Step 3 of driver registration
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

    // Debug logging
    console.log("=== Vehicle API Debug ===");
    console.log("Token exists:", !!token);
    console.log("Has accessToken:", !!(token?.accessToken));
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);

    if (!token || !token.accessToken) {
      console.error("Authentication failed - token or accessToken missing");
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    console.log("Authentication successful");
    console.log("=== End Debug ===");

    const driverApiUrl =
      process.env.DRIVER_API_URL || "http://localhost:8084";

    // Forward request to driver-service
    const response = await fetch(
      `${driverApiUrl}/api/v1/drivers/${driverId}/vehicle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error || data.message || "Failed to add vehicle",
      });
    }

    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Vehicle creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
