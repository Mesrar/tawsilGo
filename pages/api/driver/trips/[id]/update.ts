import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * PUT /api/driver/trips/[id]/update
 * Update a trip
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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

    console.log("[UPDATE_TRIP] Request body:", JSON.stringify(req.body));

    const backendUrl = `https://api.tawsilgo.com/api/v1/driver/trips/${id}`;
    console.log("[UPDATE_TRIP] Updating:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    console.log("[UPDATE_TRIP] Response status:", response.status);
    console.log("[UPDATE_TRIP] Response:", text.substring(0, 500));

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("[UPDATE_TRIP] Backend error:", data);
      return res.status(response.status).json({
        success: false,
        error:
          (data as { error?: string; message?: string })?.error ||
          (data as { error?: string; message?: string })?.message ||
          "Failed to update trip",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data,
    });
  } catch (error) {
    console.error("[UPDATE_TRIP] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
