import { z } from "zod";

// Personal Info Step
export const gigPersonalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type GigPersonalInfo = z.infer<typeof gigPersonalInfoSchema>;

// Services Step
export const gigServicesSchema = z.object({
  services: z
    .array(
      z.object({
        type: z.enum(["walking", "sitting", "grooming", "taxi", "training"]),
        experienceLevel: z.enum(["beginner", "intermediate", "expert"]),
        hourlyRate: z.number().positive("Hourly rate must be positive"),
      })
    )
    .min(1, "Select at least one service"),
});

export type GigServices = z.infer<typeof gigServicesSchema>;

// Availability Step
const timeSlotsSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)"),
});

export const gigAvailabilitySchema = z.object({
  schedule: z
    .array(
      z.object({
        day: z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
        enabled: z.boolean(),
        slots: z.array(timeSlotsSchema),
      })
    )
    .min(1, "Available for at least one day"),
  timePreferences: z
    .array(z.enum(["morning", "afternoon", "evening", "flexible"]))
    .min(1, "Select at least one time preference"),
  coverageZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  coverageRadiusMiles: z.number().int().positive("Coverage radius must be positive"),
});

export type GigAvailability = z.infer<typeof gigAvailabilitySchema>;

// About Step
export const gigAboutSchema = z.object({
  bio: z.string().max(200, "Bio must be 200 characters or less"),
  hasPets: z.boolean(),
  petDetails: z.string().optional(),
});

export type GigAbout = z.infer<typeof gigAboutSchema>;

// Consent Step
export const gigConsentSchema = z.object({
  backgroundCheckConsent: z.boolean().refine((val) => val === true, {
    message: "Background check consent is required",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type GigConsent = z.infer<typeof gigConsentSchema>;

// Combined gig worker onboarding schema
export const gigOnboardingSchema = gigPersonalInfoSchema
  .merge(gigServicesSchema)
  .merge(gigAvailabilitySchema)
  .merge(gigAboutSchema)
  .merge(gigConsentSchema);

export type GigOnboarding = z.infer<typeof gigOnboardingSchema>;
