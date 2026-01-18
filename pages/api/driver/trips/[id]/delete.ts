import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * DELETE /api/driver/trips/[id]/delete
 * Delete a trip
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
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

    const backendUrl = `https://api.tawsilgo.com/api/v1/driver/trips/${id}`;
    console.log("[DELETE_TRIP] Deleting:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    console.log("[DELETE_TRIP] Response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Failed to delete trip";
      try {
        const data = JSON.parse(text);
        errorMessage = data.error || data.message || errorMessage;
      } catch {
        // Use default error message
      }
      console.error("[DELETE_TRIP] Backend error:", text);
      return res.status(response.status).json({
        success: false,
        error: errorMessage,
        details: text,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE_TRIP] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
