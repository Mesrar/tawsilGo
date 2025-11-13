import { z } from "zod";

// Step 1: Define validation schema with Zod
export const parcelDetailsSchema = z.object({
  pickupPoint: z.string({
    required_error: "Please select a pickup point",
  }),
  deliveryPoint: z.string({
    required_error: "Please select a delivery point",
  }),
  parcelWeight: z
    .number({
      required_error: "Please enter the parcel weight",
      invalid_type_error: "Weight must be a number",
    })
    .positive("Weight must be greater than zero"),
  packagingType: z.string({
      required_error: "Please select a packaging type",
    }),
  specialRequirements: z.string().optional(),

  senderDetails: z.object({
    name: z
      .string({
        required_error: "Please enter sender's name",
      })
      .min(2, "Name must be at least 2 characters"),
    phone: z
      .string({
        required_error: "Please enter sender's phone number",
      })
      .min(6, "Phone number must be at least 6 characters"),
    
  }),
  receiverDetails: z.object({
    name: z
      .string({
        required_error: "Please enter receiver's name",
      })
      .min(2, "Name must be at least 2 characters"),
    phone: z
      .string({
        required_error: "Please enter receiver's phone number",
      })
      .min(6, "Phone number must be at least 6 characters"),
    
  }),
})
.refine(data => data.pickupPoint !== data.deliveryPoint, {
  message: "Pickup and delivery points must be different",
  path: ["deliveryPoint"],
});

// Define the type for our form values
export type ParcelDetailsFormValues = z.infer<typeof parcelDetailsSchema>;
