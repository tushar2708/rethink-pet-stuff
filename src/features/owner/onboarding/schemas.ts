import { z } from "zod";

// About You Step
export const ownerAboutYouSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type OwnerAboutYou = z.infer<typeof ownerAboutYouSchema>;

// Pet Type Step
export const ownerPetTypeSchema = z.object({
  petType: z.enum(["dog", "cat", "bird", "hamster", "other"]),
  customType: z.string().optional(),
});

export type OwnerPetType = z.infer<typeof ownerPetTypeSchema>;

// Pet Details Step
export const ownerPetDetailsSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  ageYears: z.preprocess((v) => (v === "" || Number.isNaN(v) ? undefined : Number(v)), z.number({ required_error: "Age in years is required" }).int().nonnegative()),
  ageMonths: z.preprocess((v) => (v === "" || Number.isNaN(v) ? undefined : Number(v)), z.number({ required_error: "Age in months is required" }).int().min(0).max(11)),
  breed: z.string().optional(),
});

export type OwnerPetDetails = z.infer<typeof ownerPetDetailsSchema>;

// Temperament & Energy Step
export const ownerTemperamentSchema = z.object({
  temperament: z.enum(["calm", "needs-warming-up"]),
  energyLevel: z.enum(["low", "medium", "high"]),
});

export type OwnerTemperament = z.infer<typeof ownerTemperamentSchema>;

// Combined onboarding form type
export const ownerOnboardingSchema = ownerAboutYouSchema
  .merge(ownerPetTypeSchema)
  .merge(ownerPetDetailsSchema)
  .merge(ownerTemperamentSchema)
  .refine(
    (data) => data.petType !== "other" || !!data.customType,
    {
      message: "Custom pet type is required when selecting 'Other'",
      path: ["customType"],
    }
  );

export type OwnerOnboarding = z.infer<typeof ownerOnboardingSchema>;
