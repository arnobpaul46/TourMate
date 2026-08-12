import { z } from "zod";

export const updateMeSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
  })
  .refine((data) => data.name || data.email, {
    message: "At least one of name or email is required",
  });

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
