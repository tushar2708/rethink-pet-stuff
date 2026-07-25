import { z } from "zod";

export const createReviewSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment ID"),
  rating: z.number().int().min(1).max(5, "Rating must be 1-5"),
  comment: z.string().max(500).optional(),
});

export const reviewQuerySchema = z.object({
  revieweeId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
