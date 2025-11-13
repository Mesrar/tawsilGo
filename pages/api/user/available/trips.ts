import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// Define a schema for query parameters
const querySchema = z.object({
  departureCountry: z.string().optional(),
  destinationCountry: z.string().optional(),
  departureCity: z.string().optional(),
  destinationCity: z.string().optional(),
  date: z.string().optional(),
  timeRange: z.string().optional(),
  minCapacity: z.string().optional(),
  page: z.string().default("1"),
  limit: z.string().default("10"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET method
  if (req.method !== "GET") {
    return res.status(405).json({ 
      error: "Method not allowed",
      message: "Only GET requests are accepted for this endpoint" 
    });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        error: "Unauthorized", 
        message: "You must be logged in to access this resource"
      });
    }

    // Validate query parameters
    const validationResult = querySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid parameters",
        details: validationResult.error.errors 
      });
    }

    const {
      departureCountry,
      destinationCountry,
      departureCity,
      destinationCity,
      date,
      timeRange,
      minCapacity,
      page,
      limit,
    } = validationResult.data;

    // Build query string for backend API
    const queryParams = new URLSearchParams();

    if (departureCity)
      queryParams.append("departureCity", departureCity);
    if (destinationCity)
      queryParams.append("destinationCity", destinationCity);
    if (date) queryParams.append("minDepartureTime", date);
    if (minCapacity) queryParams.append("minCapacity", minCapacity);
    if (page) queryParams.append("page", page);
    if (timeRange) queryParams.append("timeRange", timeRange); // Fixed: was using limit instead of timeRange
    if (departureCountry)
      queryParams.append("departureCountry", departureCountry);
    if (destinationCountry)
      queryParams.append("destinationCountry", destinationCountry);
    if (limit) queryParams.append("limit", limit);

    // Check if the API URL is configured
    const parcelApiUrl = process.env.PARCEL_API_URL;
    if (!parcelApiUrl) {
      console.error("PARCEL_API_URL is not configured");
      return res.status(500).json({ 
        error: "Server configuration error",
        message: "The server is not properly configured" 
      });
    }

    // Prepare API URL with query parameters
    const apiUrl = `${parcelApiUrl}/trips/search${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Handle specific HTTP error codes
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          // Try to parse the error as JSON
          errorData = JSON.parse(errorText);
        } catch (e) {
          // If parsing fails, use the raw text
          errorData = { message: errorText };
        }

        // Map status codes to appropriate error messages
        switch (response.status) {
          case 400:
            return res.status(400).json({ 
              error: "Bad request", 
              message: errorData.message || "Invalid request parameters",
              details: errorData.details || errorData
            });
          case 401:
            return res.status(401).json({ 
              error: "Authentication error", 
              message: "Your session has expired. Please log in again."
            });
          case 403:
            return res.status(403).json({ 
              error: "Access denied", 
              message: "You don't have permission to access this resource"
            });
          case 404:
            return res.status(404).json({ 
              error: "Not found", 
              message: "No trips found matching your criteria"
            });
          case 429:
            return res.status(429).json({ 
              error: "Too many requests", 
              message: "Please try again later"
            });
          case 500:
          case 502:
          case 503:
          case 504:
            return res.status(502).json({ 
              error: "Service unavailable", 
              message: "The trips service is temporarily unavailable. Please try again later."
            });
          default:
            console.error(
              `Failed to fetch trips: Status ${response.status}`, 
              errorData
            );
            return res.status(500).json({ 
              error: "Failed to fetch trips", 
              message: "An unexpected error occurred while fetching trips"
            });
        }
      }

      // Parse the response
      const tripsData = await response.json();

      // Check if the response data has the expected structure
      if (!Array.isArray(tripsData) && !tripsData.trips) {
        console.error("Unexpected response format:", tripsData);
        return res.status(500).json({ 
          error: "Invalid response", 
          message: "The server returned an unexpected response format"
        });
      }

      return res.status(200).json({ 
        trips: Array.isArray(tripsData) ? tripsData : tripsData.trips,
        success: true
      });
      
    } catch (fetchError) {
      // Handle network errors
      console.error("Network error while fetching trips:", fetchError);
      return res.status(503).json({ 
        error: "Service unavailable", 
        message: "Unable to connect to the trips service. Please try again later."
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation error", 
        details: error.errors 
      });
    }
    
    console.error("Unhandled error in trips API:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: "An unexpected error occurred. Our team has been notified."
    });
  }
}
