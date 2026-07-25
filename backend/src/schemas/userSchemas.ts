import { z } from "zod";
import { base64Schema } from "./vetSchemas";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
  avatarUrl: base64Schema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
