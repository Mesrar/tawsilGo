import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

// Disable body parser to handle FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST /api/vehicles/register
 * Register a new vehicle for the authenticated driver
 * Requires authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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

    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    });

    const [fields, files] = await form.parse(req);

    // Build FormData for backend
    const formData = new FormData();

    // Add text fields with transformations
    Object.entries(fields).forEach(([key, value]) => {
      if (value && value[0]) {
        let fieldValue = value[0];

        // Backend expects uppercase vehicle type: CAR, VAN, TRUCK, BUS, MOTORCYCLE
        if (key === "type") {
          fieldValue = fieldValue.toUpperCase();
        }

        formData.append(key, fieldValue);
      }
    });

    // Add files (handle multiple files for photos array)
    Object.entries(files).forEach(([key, fileArray]) => {
      if (fileArray && fileArray.length > 0) {
        fileArray.forEach((file) => {
          formData.append(key, fs.createReadStream(file.filepath), {
            filename: file.originalFilename || "file",
            contentType: file.mimetype || "application/octet-stream",
          });
        });
      }
    });

    // Use base API URL (VERIFY_API_URL or NEXT_PUBLIC_API_BASE_URL is the base without path)
    const backendUrl = process.env.VERIFY_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8084";
    const targetUrl = `${backendUrl}/api/v1/vehicles/register`;

    console.log("[VEHICLE_REGISTER] Forwarding to:", targetUrl);

    // Forward request to backend vehicle service
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: formData as unknown as BodyInit,
    });

    const data = await response.json();

    // Cleanup temp files
    Object.values(files).forEach((fileArray) => {
      fileArray?.forEach((file) => {
        if (file.filepath) {
          fs.unlink(file.filepath, () => {});
        }
      });
    });

    if (!response.ok) {
      console.error("[VEHICLE_REGISTER] Backend error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        error: data.error || data.message || "Failed to register vehicle",
        details: data,
      });
    }

    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Vehicle registration error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
