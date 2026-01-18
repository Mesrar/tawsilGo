import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/driver/trips/add
 * Create a new trip via backend parcel service
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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

    console.log("[CREATE_TRIP] Request body:", JSON.stringify(req.body));

    // Backend URL - driver trips endpoint
    const backendUrl = "https://api.tawsilgo.com/api/v1/driver/trips";
    console.log("[CREATE_TRIP] Posting to:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    console.log("[CREATE_TRIP] Response status:", response.status);
    console.log("[CREATE_TRIP] Response:", text.substring(0, 500));

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("[CREATE_TRIP] Backend error:", data);
      return res.status(response.status).json({
        success: false,
        error: (data as { error?: string; message?: string })?.error ||
               (data as { error?: string; message?: string })?.message ||
               "Trip creation failed",
        details: data,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[CREATE_TRIP] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
