import { z } from "zod";

// Personal Info Step
export const vetPersonalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  useDrPrefix: z.boolean().default(false),
});

export type VetPersonalInfo = z.infer<typeof vetPersonalInfoSchema>;

// Credentials Step
export const vetCredentialsSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  yearsOfPractice: z.number().int().positive("Years of practice must be positive"),
  degree: z.enum(["DVM", "VMD", "BVSc", "other"]),
  licenseDocUrl: z.string().optional(),
});

export type VetCredentials = z.infer<typeof vetCredentialsSchema>;

// Clinic Info Step
export const vetClinicSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required").max(2),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  clinicPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  clinicLogoUrl: z.string().optional(),
});

export type VetClinic = z.infer<typeof vetClinicSchema>;

// Specializations Step
export const vetSpecializationsSchema = z.object({
  specializations: z
    .array(
      z.enum([
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
      ])
    )
    .min(1, "Select at least one specialization"),
});

export type VetSpecializations = z.infer<typeof vetSpecializationsSchema>;

// Availability Step
const timeSlotsSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
});

export const vetAvailabilitySchema = z.object({
  schedule: z
    .array(
      z.object({
        day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
        enabled: z.boolean(),
        slots: z.array(timeSlotsSchema),
      })
    )
    .min(1, "Add availability for at least one day"),
  consultationDuration: z.enum(["15", "30", "45", "60"]).pipe(z.coerce.number()),
});

export type VetAvailability = z.infer<typeof vetAvailabilitySchema>;

// Profile/Bio Step
export const vetProfileSchema = z.object({
  bio: z.string().max(300, "Bio must be 300 characters or less"),
  profilePhotoUrl: z.string().optional(),
});

export type VetProfile = z.infer<typeof vetProfileSchema>;

// Combined vet onboarding schema
export const vetOnboardingSchema = vetPersonalInfoSchema
  .merge(vetCredentialsSchema)
  .merge(vetClinicSchema)
  .merge(vetSpecializationsSchema)
  .merge(vetAvailabilitySchema)
  .merge(vetProfileSchema);

export type VetOnboarding = z.infer<typeof vetOnboardingSchema>;
