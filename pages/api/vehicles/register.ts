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

    // Parse form data from request
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    });

    const [fields, files] = await form.parse(req);

    console.log("[VEHICLE_REGISTER] Fields:", JSON.stringify(Object.keys(fields)));
    console.log("[VEHICLE_REGISTER] Files:", JSON.stringify(Object.keys(files)));

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
        console.log(`[VEHICLE_REGISTER] Field: ${key} = ${value}`);
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
          console.log(`[VEHICLE_REGISTER] File: ${key} = ${file.originalFilename}`);
        }
      }
    }

    // Backend URL - hardcoded to ensure correctness
    const targetUrl = "https://api.tawsilgo.com/api/v1/vehicles/register";
    console.log("[VEHICLE_REGISTER] Target URL:", targetUrl);

    // Submit using form-data's built-in submit method
    const response = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      formData.submit(
        {
          protocol: "https:",
          host: "api.tawsilgo.com",
          port: 443,
          path: "/api/v1/vehicles/register",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        },
        (err, response) => {
          if (err) {
            console.error("[VEHICLE_REGISTER] Submit error:", err);
            reject(err);
            return;
          }

          let body = "";
          response.on("data", (chunk) => (body += chunk));
          response.on("end", () => {
            console.log("[VEHICLE_REGISTER] Response status:", response.statusCode);
            console.log("[VEHICLE_REGISTER] Response body:", body.substring(0, 500));
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
      console.error("[VEHICLE_REGISTER] Backend error:", response.status, data);
      return res.status(response.status).json({
        success: false,
        error: (data as { error?: string; message?: string })?.error ||
               (data as { error?: string; message?: string })?.message ||
               "Failed to register vehicle",
        details: data,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[VEHICLE_REGISTER] Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
