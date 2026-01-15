import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import https from "https";
import http from "http";

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

    console.log("[VEHICLE_REGISTER] Parsed fields:", Object.keys(fields));
    console.log("[VEHICLE_REGISTER] Parsed files:", Object.keys(files));

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

    // Use base API URL
    const backendUrl = process.env.VERIFY_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8084";
    const targetUrl = `${backendUrl}/api/v1/vehicles/register`;

    console.log("[VEHICLE_REGISTER] Forwarding to:", targetUrl);

    // Use form-data's submit method which properly handles streams
    const result = await new Promise<{ statusCode: number; data: unknown }>((resolve, reject) => {
      const url = new URL(targetUrl);
      const isHttps = url.protocol === "https:";
      const client = isHttps ? https : http;

      const requestOptions = {
        method: "POST",
        host: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token.accessToken}`,
        },
      };

      const request = client.request(requestOptions, (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            const data = JSON.parse(body);
            resolve({ statusCode: response.statusCode || 500, data });
          } catch {
            resolve({ statusCode: response.statusCode || 500, data: { message: body } });
          }
        });
      });

      request.on("error", (error) => {
        console.error("[VEHICLE_REGISTER] Request error:", error);
        reject(error);
      });

      formData.pipe(request);
    });

    // Cleanup temp files
    Object.values(files).forEach((fileArray) => {
      fileArray?.forEach((file) => {
        if (file.filepath) {
          fs.unlink(file.filepath, () => {});
        }
      });
    });

    if (result.statusCode >= 400) {
      console.error("[VEHICLE_REGISTER] Backend error:", result.statusCode, result.data);
      return res.status(result.statusCode).json({
        success: false,
        error: (result.data as { error?: string; message?: string })?.error ||
               (result.data as { error?: string; message?: string })?.message ||
               "Failed to register vehicle",
        details: result.data,
      });
    }

    return res.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("[VEHICLE_REGISTER] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
