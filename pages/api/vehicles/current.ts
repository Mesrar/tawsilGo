import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/vehicles/current
 * Get current user's vehicles
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
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Use base API URL
    const backendUrl = process.env.VERIFY_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8084";

    // Forward query params
    const queryString = new URL(req.url || "", `http://${req.headers.host}`).search;
    const targetUrl = `${backendUrl}/api/v1/vehicles/current${queryString}`;

    console.log("[VEHICLES_CURRENT] Fetching from:", targetUrl);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[VEHICLES_CURRENT] Backend error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        error: data.error || data.message || "Failed to fetch vehicles",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("[VEHICLES_CURRENT] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
