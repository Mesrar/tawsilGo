import { z } from "zod";

export const countryCodeMap: Record<string, string> = {
  "United States": "US",
  "France": "FR",
  "Germany": "DE",
  "United Kingdom": "GB",
  "Spain": "ES",
  "Italy": "IT",
  "Morocco": "MA",
  // Add more country mappings here...
};

export const countries = ["France", "Spain", "Morocco", "Italy"] as const;

export const parcelFormSchema = z.object({
  departure: z.enum(countries, {
    required_error: "Departure country is required.",
    invalid_type_error: "Invalid country selected for departure.",
  }),
  destination: z.enum(countries, {
    required_error: "Destination country is required.",
    invalid_type_error: "Invalid country selected for destination.",
  }),
  dimensions: z.enum(["Standard", "Large", "Custom"], {
    required_error: "Dimensions are required.",
    invalid_type_error: "Invalid dimensions selected.",
  }),
  weight: z
    .number({
      invalid_type_error: "Weight must be a number.",
      required_error: "Weight is required.",
    })
    .positive("Weight must be greater than 0.")
    .max(30, "Weight must not exceed 30kg."),
  sendingMode: z.enum(["Point of Collection", "Home pick"], {
    required_error: "Sending mode is required.",
    invalid_type_error: "Invalid sending mode selected.",
  }),
  deliveryMode: z.enum(["Standard", "Express"], {
    required_error: "Delivery mode is required.",
    invalid_type_error: "Invalid delivery mode selected.",
  }),
  interestedService: z.enum(["Particular", "Company"], {
    required_error: "Service type is required.",
    invalid_type_error: "Invalid service type selected.",
  }),
  senderDetails: z.object({
    name: z.string().min(1, "Sender's name is required."),
    email: z
      .string()
      .email("Invalid email address.")
      .nonempty("Sender's email is required."),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, "Invalid phone number.")
      .nonempty("Sender's phone number is required."),
    address: z.string().min(1, "Sender's address is required."),
  }),
  receiverDetails: z.object({
    name: z.string().min(1, "Receiver's name is required."),
    email: z
      .string()
      .email("Invalid email address.")
      .nonempty("Receiver's email is required."),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, "Invalid phone number.")
      .nonempty("Receiver's phone number is required."),
    address: z.string().min(1, "Receiver's address is required."),
  }),
});


export type ParcelFormSchema = z.infer<typeof parcelFormSchema>;
