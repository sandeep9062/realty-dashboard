import { z } from "zod";

export const PropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide a detailed description"),
  price: z.coerce.number().positive("Price must be a positive number"),
  location: z.string().min(3, "Location is required"),
});

export type PropertyInput = z.infer<typeof PropertySchema>;