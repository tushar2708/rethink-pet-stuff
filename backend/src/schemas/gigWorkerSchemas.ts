import { z } from "zod";
import { dayScheduleSchema, base64Schema } from "./vetSchemas";

const gigServiceTypeSchema = z.enum([
  "walking",
  "sitting",
  "grooming",
  "taxi",
  "training",
]);

const experienceLevelSchema = z.enum(["beginner", "intermediate", "expert"]);

const timePreferenceSchema = z.enum([
  "morning",
  "afternoon",
  "evening",
  "flexible",
]);

export const gigOnboardingSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  phone: z.string().min(10),
  services: z
    .array(
      z.object({
        type: gigServiceTypeSchema,
        experienceLevel: experienceLevelSchema,
        hourlyRate: z.number().positive("Rate must be positive"),
      })
    )
    .min(1, "Select at least one service"),
  schedule: z.array(dayScheduleSchema).min(1),
  timePreferences: z
    .array(timePreferenceSchema)
    .min(1, "Select at least one time preference"),
  coverageZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP"),
  coverageRadiusMiles: z.number().int().positive("Radius must be positive"),
  bio: z.string().max(200, "Bio must be 200 characters or less"),
  hasPets: z.boolean(),
  petDetails: z.string().optional(),
  backgroundCheckConsent: z.literal(true, {
    errorMap: () => ({ message: "Background check consent is required" }),
  }),
  photoUrl: base64Schema,
});

export const gigUpdateSchema = gigOnboardingSchema.partial();

export const gigSearchQuerySchema = z.object({
  serviceType: gigServiceTypeSchema.optional(),
  zip: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type GigOnboardingInput = z.infer<typeof gigOnboardingSchema>;
export type GigUpdateInput = z.infer<typeof gigUpdateSchema>;
export type GigSearchQuery = z.infer<typeof gigSearchQuerySchema>;
