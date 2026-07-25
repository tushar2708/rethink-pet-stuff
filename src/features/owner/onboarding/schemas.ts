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

// Breed Step
export const ownerBreedSchema = z.object({
  breed: z.string().min(1, "Please select a breed"),
});

export type OwnerBreed = z.infer<typeof ownerBreedSchema>;

// Basics Step
export const ownerBasicsSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  gender: z.enum(["male", "female"], { required_error: "Please select gender" }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  weightKg: z.preprocess((v) => (v === "" || Number.isNaN(v) ? undefined : Number(v)), z.number().positive("Weight must be positive").optional()),
});

export type OwnerBasics = z.infer<typeof ownerBasicsSchema>;

// Lifestyle Step
export const ownerLifestyleSchema = z.object({
  lifestyle: z.enum(["indoor", "outdoor"], { required_error: "Please select lifestyle" }),
});

export type OwnerLifestyle = z.infer<typeof ownerLifestyleSchema>;

// Vaccination Step
export const ownerVaccinationSchema = z.object({
  completedVaccinations: z.array(z.string()).default([]),
  isNeutered: z.boolean().default(false),
});

export type OwnerVaccination = z.infer<typeof ownerVaccinationSchema>;

// Temperament & Energy Step
export const ownerTemperamentSchema = z.object({
  temperament: z.enum(["calm", "needs-warming-up"]),
  energyLevel: z.enum(["low", "medium", "high"]),
});

export type OwnerTemperament = z.infer<typeof ownerTemperamentSchema>;

// Combined onboarding form type
export const ownerOnboardingSchema = ownerAboutYouSchema
  .merge(ownerPetTypeSchema)
  .merge(ownerBreedSchema)
  .merge(ownerBasicsSchema)
  .merge(ownerLifestyleSchema)
  .merge(ownerVaccinationSchema)
  .merge(ownerTemperamentSchema);

export type OwnerOnboarding = z.infer<typeof ownerOnboardingSchema>;
