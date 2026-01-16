import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

// Backend vehicle type
interface BackendVehicle {
  ID: string;
  Name: string;
  Type: string;
  PlateNumber: string;
  Capacity: {
    MaxWeight: number;
    MaxVolume: number;
    MaxPackages: number;
  };
  ManufactureYear: number;
  Model: string;
  Color: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  OwnerType?: string;
  OrganizationID?: string | null;
  CurrentDriverID?: string | null;
}

// Transform backend vehicle to frontend format
function transformVehicle(v: BackendVehicle) {
  // Extract brand from Name (Name is "brand model" combined)
  const nameParts = v.Name?.split(' ') || [];
  const brand = nameParts[0] || v.Model || 'Unknown';

  // Map status - backend uses "verification_pending", frontend expects separate verificationStatus
  const isVerificationPending = v.Status === 'verification_pending';
  const status = isVerificationPending ? 'active' : v.Status?.toLowerCase() || 'active';
  const verificationStatus = isVerificationPending ? 'pending' :
                             v.Status === 'verification_rejected' ? 'rejected' : 'verified';

  return {
    id: v.ID,
    type: v.Type?.toLowerCase() || 'car',
    brand: brand,
    model: v.Model || '',
    licensePlate: v.PlateNumber || '',
    year: v.ManufactureYear || new Date().getFullYear(),
    color: v.Color || '',
    photos: [],
    capacity: {
      weight: { min: 0, max: v.Capacity?.MaxWeight || 0 },
      volume: { min: 0, max: v.Capacity?.MaxVolume || 0 },
      dimensions: { length: 0, width: 0, height: 0 },
    },
    features: [],
    status: status,
    verificationStatus: verificationStatus,
    isAvailable: v.Status === 'available',
    documents: [],
    createdAt: v.CreatedAt || new Date().toISOString(),
    updatedAt: v.UpdatedAt || new Date().toISOString(),
    ownerId: v.OrganizationID || '',
    ownerType: v.OwnerType || 'driver',
    currentDriverId: v.CurrentDriverID || undefined,
  };
}

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

    // Backend URL
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
      });
    }

    // Backend returns { data: { vehicles, total }, success }
    const backendData = data as {
      data?: { vehicles?: BackendVehicle[]; total?: number };
      success?: boolean
    };

    const backendVehicles = backendData.data?.vehicles || [];
    const transformedVehicles = backendVehicles.map(transformVehicle);

    return res.status(200).json({
      success: true,
      data: {
        vehicles: transformedVehicles,
        total: backendData.data?.total || transformedVehicles.length,
      },
    });
  } catch (error) {
    console.error("[VEHICLES_CURRENT] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
