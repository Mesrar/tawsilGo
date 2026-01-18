import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

// Backend trip response type
interface BackendTrip {
  id: string;
  status: string;
  departureTime: string;
  arrivalTime?: string;
  origin: string;
  destination: string;
  departureAddress?: string;
  destinationAddress?: string;
  capacity: number;
  remainingCapacity: number;
  vehicleId?: string;
  createdByUserId?: string;
  price?: number;
  stops?: unknown[];
}

// Transform backend trip to frontend format
function transformTrip(trip: BackendTrip) {
  return {
    id: trip.id,
    origin: trip.origin,
    destination: trip.destination,
    departure_time: trip.departureTime,
    arrival_time: trip.arrivalTime,
    status: trip.status,
    price: trip.price || 0,
    stops: trip.stops || [],
    departure_address: trip.departureAddress || trip.origin,
    destination_address: trip.destinationAddress || trip.destination,
    total_capacity: trip.capacity,
    remaining_capacity: trip.remainingCapacity,
    vehicle_id: trip.vehicleId,
  };
}

/**
 * GET /api/driver/trips
 * Fetch driver's trips from backend parcel service
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

    // Build query params
    const { status, page = "1", limit = "10" } = req.query;
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status && typeof status === "string") {
      queryParams.append("status", status);
    }

    // Backend URL - driver trips endpoint
    const backendUrl = `https://api.tawsilgo.com/api/v1/driver/trips?${queryParams.toString()}`;
    console.log("[DRIVER_TRIPS] Fetching from:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    console.log("[DRIVER_TRIPS] Response status:", response.status);

    if (!response.ok) {
      console.error("[DRIVER_TRIPS] Backend error:", text);
      return res.status(response.status).json({
        success: false,
        error: "Failed to fetch trips from backend",
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

    // Backend returns { pagination: {...}, trips: [...] }
    const backendData = data as {
      pagination?: {
        page?: number;
        totalItems?: number;
        totalPages?: number;
      };
      trips?: BackendTrip[];
    };

    const trips = backendData.trips || [];
    const transformedTrips = trips.map(transformTrip);

    return res.status(200).json({
      success: true,
      trips: transformedTrips,
      page: backendData.pagination?.page || 1,
      limit: parseInt(String(limit)),
      total: backendData.pagination?.totalItems || trips.length,
    });
  } catch (error) {
    console.error("[DRIVER_TRIPS] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
