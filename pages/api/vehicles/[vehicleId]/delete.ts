import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/vehicles/[vehicleId]/delete
 * Delete a vehicle
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { vehicleId } = req.query;

  if (!vehicleId || typeof vehicleId !== "string") {
    return res.status(400).json({ error: "Vehicle ID is required" });
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

    const backendUrl = `https://api.tawsilgo.com/api/v1/vehicles/${vehicleId}`;
    console.log("[VEHICLE_DELETE] Deleting:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({ reason: req.body?.reason || "User requested deletion" }),
    });

    const text = await response.text();
    console.log("[VEHICLE_DELETE] Response status:", response.status);

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("[VEHICLE_DELETE] Backend error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        error: (data as { error?: string; message?: string })?.error ||
               (data as { error?: string; message?: string })?.message ||
               "Failed to delete vehicle",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data,
    });
  } catch (error) {
    console.error("[VEHICLE_DELETE] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
