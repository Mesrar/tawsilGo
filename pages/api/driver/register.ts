import { withApiErrorHandling } from "@/lib/api/error-handling";
import { sanitizeRequest } from "@/lib/api/sanitize";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// Define validation schema for legacy driver registration
// Note: This is a legacy endpoint. New driver registration uses the multi-step flow at /drivers/register
export const DriverRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  licenseNumber: z.string().min(5, "License number is required").optional(),
  vehicleType: z.enum(['car', 'van', 'truck', 'motorcycle']).optional(),
  vehicleRegistration: z.string().min(3, "Vehicle registration required").optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

export type DriverRegistrationRequest = z.infer<typeof DriverRegistrationSchema>;

// RFC 7807 Problem Details format
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

// Response type for success
interface RegistrationResponse {
  success: boolean;
  data: {
    id: string;
  };
}

// Handler with proper error handling
async function driverRegisterHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegistrationResponse | ProblemDetails>
) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({
      type: "https://example.com/errors/method-not-allowed",
      title: "Method Not Allowed",
      status: 405,
      detail: "This endpoint only supports POST requests"
    });
  }

  // 2. Log registration attempts for monitoring
  console.log('[DRIVER_REGISTER_API]', {
    method: req.method,
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'same-origin'
  });

  try {
    // 3. Validate request body with Zod
    const validationResult = DriverRegistrationSchema.safeParse(req.body);

    if (!validationResult.success) {
      const formattedErrors: Record<string, string[]> = {};

      // Format validation errors for client consumption
      validationResult.error.errors.forEach(error => {
        const path = error.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(error.message);
      });

      return res.status(400).json({
        type: "https://example.com/errors/validation-error",
        title: "Validation Error",
        status: 400,
        detail: "The request payload contains validation errors",
        errors: formattedErrors
      });
    }

    const driverData = validationResult.data;

    // 4. Send validated data to external API
    const verifyApiUrl = process.env.VERIFY_API_URL;
    if (!verifyApiUrl) {
      throw new Error("VERIFY_API_URL environment variable is not set");
    }

    const response = await fetch(`${verifyApiUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': req.headers['x-request-id'] as string || crypto.randomUUID()
      },
      body: JSON.stringify(driverData),
    });

    const data = await response.json();

    // 5. Handle API response with proper status code mapping
    if (!response.ok) {
      // Map specific error cases
      switch (response.status) {
        case 409:
          return res.status(409).json({
            type: "https://example.com/errors/conflict",
            title: "Resource Conflict",
            status: 409,
            detail: data.message || data.details || "Driver with this email or license already exists",
            instance: req.url
          });
        case 422:
          return res.status(422).json({
            type: "https://example.com/errors/unprocessable-entity",
            title: "Unprocessable Entity",
            status: 422,
            detail: data.message || data.details || "The server understood the request, but cannot process it",
            instance: req.url
          });
        default:
          return res.status(response.status).json({
            type: "https://example.com/errors/api-error",
            title: "Registration Failed",
            status: response.status,
            detail: data.message || data.details || "An error occurred during driver registration",
            instance: req.url
          });
      }
    }

    // 6. Success response
    return res.status(201).json({
      success: true,
      data: {
        id: data.id
      }
    });

  } catch (error) {
    console.error('[DRIVER_REGISTER_API_ERROR]', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Differentiate between network errors and other exceptions
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return res.status(503).json({
        type: "https://example.com/errors/service-unavailable",
        title: "Service Unavailable",
        status: 503,
        detail: "Unable to reach the authentication service",
        instance: req.url
      });
    }

    return res.status(500).json({
      type: "https://example.com/errors/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      detail: "An unexpected error occurred",
      instance: req.url
    });
  }
}

// Create middleware chain with sanitization and error handling
export default sanitizeRequest(
  withApiErrorHandling(driverRegisterHandler)
);
