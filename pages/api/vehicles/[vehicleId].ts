import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

// Disable body parser to handle FormData for PUT
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * GET /api/vehicles/[vehicleId] - Get vehicle details
 * PUT /api/vehicles/[vehicleId] - Update vehicle
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
    return handleGet(req, res, backendUrl, token.accessToken as string);
  } else if (req.method === "PUT") {
    return handlePut(req, res, backendUrl, token.accessToken as string);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGet(
  req: NextApiRequest,
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
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 10,
    });

    const [fields, files] = await form.parse(req);

    console.log("[VEHICLE_UPDATE] Fields:", Object.keys(fields));
    console.log("[VEHICLE_UPDATE] Files:", Object.keys(files));

    // Build FormData for backend
    const formData = new FormData();

    // Add text fields
    for (const [key, values] of Object.entries(fields)) {
      if (values && values[0]) {
        let value = values[0];
        // Backend expects uppercase vehicle type
        if (key === "type") {
          value = value.toUpperCase();
        }
        formData.append(key, value);
      }
    }

    // Add files
    for (const [key, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        for (const file of fileArray) {
          formData.append(key, fs.createReadStream(file.filepath), {
            filename: file.originalFilename || "file",
            contentType: file.mimetype || "application/octet-stream",
          });
        }
      }
    }

    // Submit using form-data's built-in submit method
    const response = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      formData.submit(
        {
          protocol: "https:",
          host: "api.tawsilgo.com",
          port: 443,
          path: `/api/v1/vehicles/${req.query.vehicleId}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        (err, response) => {
          if (err) {
            console.error("[VEHICLE_UPDATE] Submit error:", err);
            reject(err);
            return;
          }

          let body = "";
          response.on("data", (chunk) => (body += chunk));
          response.on("end", () => {
            console.log("[VEHICLE_UPDATE] Response status:", response.statusCode);
            resolve({ status: response.statusCode || 500, body });
          });
          response.on("error", reject);
        }
      );
    });

    // Cleanup temp files
    for (const fileArray of Object.values(files)) {
      for (const file of fileArray || []) {
        if (file.filepath) {
          fs.unlink(file.filepath, () => {});
        }
      }
    }

    // Parse response
    let data: unknown;
    try {
      data = JSON.parse(response.body);
    } catch {
      data = { message: response.body };
    }

    if (response.status >= 400) {
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
