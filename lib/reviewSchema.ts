import { z } from "zod";

// One schema, shared by the API route (server) and the review form (client).
export const reviewSchema = z.object({
  product_id: z
    .number({ error: "Product is required" })
    .int("Product must be an integer")
    .positive("Product must be positive"),
  rating: z
    .number({ error: "Please choose a rating from 1 to 5" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string({ error: "Comment is required" })
    .trim()
    .min(1, "Comment is required")
    .max(500, "Comment must be at most 500 characters"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
