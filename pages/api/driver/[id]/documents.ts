import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import formidable, { File } from "formidable";
import fs from "fs";

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST /api/driver/[id]/documents
 * Upload driver document - Step 2 of driver registration
 *
 * GET /api/driver/[id]/documents
 * Get all documents for a driver
 *
 * Requires authentication
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: driverId } = req.query;

  if (!driverId || typeof driverId !== "string") {
    return res.status(400).json({ error: "Driver ID is required" });
  }

  try {
    // Get JWT token from session
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.accessToken) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const driverApiUrl =
      process.env.DRIVER_API_URL || "http://localhost:8084";

    // Handle GET request - retrieve documents
    if (req.method === "GET") {
      const response = await fetch(
        `${driverApiUrl}/api/v1/drivers/${driverId}/documents`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: data.error || "Failed to fetch documents",
        });
      }

      return res.status(200).json({
        success: true,
        data: data,
      });
    }

    // Handle POST request - upload document
    if (req.method === "POST") {
      // Parse multipart form data
      const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });

      const [fields, files] = await form.parse(req);

      // Debug logging
      console.log("=== Document Upload Debug ===");
      console.log("Fields received:", Object.keys(fields));
      console.log("Files received:", Object.keys(files));
      console.log("Type field:", fields.type?.[0]);
      console.log("Document in fields:", typeof fields.document, fields.document?.[0]?.substring?.(0, 50));
      console.log("Document field exists in files:", !!files.document);
      console.log("All files keys:", Object.keys(files));
      console.log("=== End Debug ===");

      const documentType = fields.type?.[0];

      // Try to find the file in any field
      const fileKeys = Object.keys(files);
      let uploadedFile: File | undefined;

      if (fileKeys.length > 0) {
        // Get the first file from any field
        uploadedFile = files[fileKeys[0]]?.[0] as File;
      }

      if (!documentType || !uploadedFile) {
        console.error("Missing required fields - type:", !!documentType, "file:", !!uploadedFile);
        console.error("Available file fields:", fileKeys);
        return res.status(400).json({
          success: false,
          error: "Document type and file are required",
        });
      }

      console.log("Found file in field:", fileKeys[0]);

      // Read file into buffer for reliable forwarding
      const fileBuffer = fs.readFileSync(uploadedFile.filepath);
      const fileBlob = new Blob([fileBuffer], {
        type: uploadedFile.mimetype || "application/octet-stream",
      });

      // Create FormData to forward to backend
      const formData = new FormData();
      formData.append("type", documentType);
      formData.append(
        "document", // Backend expects 'document' not 'file'
        fileBlob,
        uploadedFile.originalFilename || "document"
      );

      // Forward to driver-service
      const response = await fetch(
        `${driverApiUrl}/api/v1/drivers/${driverId}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            // Don't set Content-Type - let fetch set it with boundary
          },
          body: formData,
        }
      );

      // Clean up temporary file
      fs.unlinkSync(uploadedFile.filepath);

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: data.error || "Failed to upload document",
        });
      }

      return res.status(201).json({
        success: true,
        data: data,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Document operation error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
