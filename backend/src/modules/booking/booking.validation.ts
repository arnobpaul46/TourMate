import { z } from "zod";

export const createBookingSchema = z.object({
  tourPackageId: z.string().uuid("Invalid tour package id"),
  travelDate: z.coerce.date({ message: "Invalid travel date" }),
  guests: z.number().int().positive("Guests must be at least 1"),
});

export const bookingIdSchema = z.object({
  id: z.string().uuid("Invalid booking id"),
});

export const updateBookingStatusSchema = z
  .object({
    bookingStatus: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  })
  .refine((data) => data.bookingStatus || data.paymentStatus, {
    message: "At least one of bookingStatus or paymentStatus is required",
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
