import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/vehicles/[vehicleId] - Get vehicle details
 * PUT /api/vehicles/[vehicleId] - Update vehicle (JSON)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { vehicleId } = req.query;

  if (!vehicleId || typeof vehicleId !== "string") {
    return res.status(400).json({ error: "Vehicle ID is required" });
  }

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

  if (req.method === "GET") {
    return handleGet(res, backendUrl, token.accessToken as string);
  } else if (req.method === "PUT") {
    return handlePut(req, res, backendUrl, token.accessToken as string);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGet(
  res: NextApiResponse,
  backendUrl: string,
  accessToken: string
) {
  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const text = await response.text();
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
               "Failed to fetch vehicle",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[VEHICLE_GET] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse,
  backendUrl: string,
  accessToken: string
) {
  try {
    console.log("[VEHICLE_UPDATE] Updating:", backendUrl);
    console.log("[VEHICLE_UPDATE] Body:", JSON.stringify(req.body));

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    console.log("[VEHICLE_UPDATE] Response status:", response.status);
    console.log("[VEHICLE_UPDATE] Response:", text.substring(0, 500));

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("[VEHICLE_UPDATE] Backend error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        error: (data as { error?: string; message?: string })?.error ||
               (data as { error?: string; message?: string })?.message ||
               "Failed to update vehicle",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[VEHICLE_UPDATE] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
