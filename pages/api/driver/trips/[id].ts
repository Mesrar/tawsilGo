import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/driver/trips/[id]
 * Fetch trip details from backend parcel service
 */
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
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Trip ID is required",
      });
    }

    // Backend URL - driver trips endpoint
    const backendUrl = `https://api.tawsilgo.com/api/v1/driver/trips/${id}`;
    console.log("[TRIP_DETAILS] Fetching from:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    console.log("[TRIP_DETAILS] Response status:", response.status);

    if (!response.ok) {
      console.error("[TRIP_DETAILS] Backend error:", text);
      return res.status(response.status).json({
        success: false,
        error: "Failed to fetch trip details",
        details: text,
      });
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        success: false,
        error: "Invalid response from backend",
      });
    }

    return res.status(200).json({
      success: true,
      trip: data,
    });
  } catch (error) {
    console.error("[TRIP_DETAILS] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
