import { z } from "zod";

export const dayScheduleSchema = z.object({
  day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
  enabled: z.boolean(),
  slots: z.array(
    z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
      end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
    })
  ),
});

export const base64Schema = z.string().optional().refine(
  (val) => {
    if (!val) return true;
    const raw = val.includes(",") ? val.split(",")[1]! : val;
    return Buffer.byteLength(raw, "base64") <= 1_048_576;
  },
  "File exceeds 1MB limit"
);

const specializationSchema = z.enum([
  "general",
  "surgery",
  "dermatology",
  "dentistry",
  "oncology",
  "exotic",
  "emergency",
  "behavioral",
  "nutrition",
  "cardiology",
  "ophthalmology",
  "orthopedics",
]);

export const vetOnboardingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  useDrPrefix: z.boolean().default(false),
  licenseNumber: z.string().min(1, "License number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  yearsOfPractice: z.number().int().positive("Must be positive"),
  degree: z.enum(["DVM", "VMD", "BVSc", "other"]),
  licenseDocUrl: base64Schema,
  clinicName: z.string().min(1, "Clinic name is required"),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2, "State must be 2 characters"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP"),
  clinicPhone: z.string().min(10),
  website: z.string().url().optional().or(z.literal("")),
  clinicLogoUrl: base64Schema,
  specializations: z.array(specializationSchema).min(1, "Select at least one specialization"),
  schedule: z.array(dayScheduleSchema).min(1),
  consultationDuration: z
    .number()
    .refine((v) => [15, 30, 45, 60].includes(v), "Must be 15, 30, 45, or 60"),
  bio: z.string().max(300, "Bio must be 300 characters or less"),
  profilePhotoUrl: base64Schema,
});

export const vetUpdateSchema = vetOnboardingSchema.partial();

export const vetSearchQuerySchema = z.object({
  specialization: specializationSchema.optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export type VetOnboardingInput = z.infer<typeof vetOnboardingSchema>;
export type VetUpdateInput = z.infer<typeof vetUpdateSchema>;
export type VetSearchQuery = z.infer<typeof vetSearchQuerySchema>;
