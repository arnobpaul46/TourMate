import { z } from "zod";

export const createReviewSchema = z.object({
  tourPackageId: z.string().uuid("Invalid tour package id"),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
});

export const getReviewsQuerySchema = z.object({
  tourPackageId: z.string().uuid("Invalid tour package id"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;
