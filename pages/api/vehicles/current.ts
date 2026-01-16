import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/vehicles/current
 * Get current user's vehicles
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

    // Backend URL - hardcoded to ensure correctness
    const targetUrl = "https://api.tawsilgo.com/api/v1/vehicles/current";
    console.log("[VEHICLES_CURRENT] Fetching from:", targetUrl);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const text = await response.text();
    console.log("[VEHICLES_CURRENT] Response status:", response.status);
    console.log("[VEHICLES_CURRENT] Response body:", text.substring(0, 500));

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: (data as { error?: string; message?: string })?.error ||
               (data as { error?: string; message?: string })?.message ||
               "Failed to fetch vehicles",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[VEHICLES_CURRENT] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
