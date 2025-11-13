import { z } from "zod";

/**
 * Validation schemas for driver registration flow
 * Using Zod for runtime type checking and form validation
 */

// IANA timezones - common ones for validation
const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Nairobi",
  "Africa/Casablanca",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

// Step 1: Driver Application Schema
export const driverApplicationSchema = z.object({
  license_number: z
    .string()
    .min(5, "License number must be at least 5 characters")
    .max(50, "License number is too long"),

  timezone: z.string({
    required_error: "Timezone is required",
  }).refine(
    (tz) => {
      // Allow any string that looks like a timezone (e.g., "America/New_York")
      return /^[A-Za-z]+\/[A-Za-z_]+$/.test(tz);
    },
    { message: "Invalid timezone format" }
  ),

  phone_number: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in international format (e.g., +1234567890)"),

  experience_years: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(70, "Experience seems too high")
    .optional(),
});

export type DriverApplicationFormData = z.infer<typeof driverApplicationSchema>;

// Step 2: Document Upload Schema
export const documentUploadSchema = z.object({
  license: z
    .instanceof(File, { message: "Driver's license document is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type),
      "Only JPG, PNG, and PDF files are accepted"
    ),

  identity: z
    .instanceof(File, { message: "Identity document is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type),
      "Only JPG, PNG, and PDF files are accepted"
    ),

  insurance: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type),
      "Only JPG, PNG, and PDF files are accepted"
    )
    .optional(),

  vehicle_registration: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type),
      "Only JPG, PNG, and PDF files are accepted"
    )
    .optional(),
});

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

// Step 3: Vehicle Information Schema
export const vehicleSchema = z.object({
  name: z
    .string()
    .min(1, "Vehicle name is required")
    .max(100, "Vehicle name is too long"),

  type: z.enum(["sedan", "suv", "van", "truck", "motorcycle"], {
    required_error: "Vehicle type is required",
  }),

  plate_number: z
    .string()
    .min(1, "Plate number is required")
    .max(20, "Plate number is too long"),

  manufacture_year: z
    .number()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future")
    .optional(),

  model: z
    .string()
    .max(50, "Model name is too long")
    .optional(),

  color: z
    .string()
    .max(30, "Color name is too long")
    .optional(),

  max_weight: z
    .number()
    .min(0.1, "Max weight must be greater than 0")
    .max(50000, "Max weight seems too high"),

  max_volume: z
    .number()
    .min(0.1, "Max volume must be greater than 0")
    .max(1000, "Max volume seems too high"),

  max_packages: z
    .number()
    .int("Max packages must be a whole number")
    .min(1, "Must be able to carry at least 1 package")
    .max(1000, "Max packages seems too high"),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

// Helper function to validate file size before upload
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

// Helper function to validate file type
export function validateFileType(file: File): boolean {
  const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  return acceptedTypes.includes(file.type);
}

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

// Common timezone options for select dropdown
export const timezoneOptions = COMMON_TIMEZONES.map((tz) => ({
  value: tz,
  label: tz.replace(/_/g, " "),
}));

// Vehicle type options for select dropdown
export const vehicleTypeOptions = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "motorcycle", label: "Motorcycle" },
] as const;
