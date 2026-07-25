import { z } from "zod";
import { base64Schema } from "./vetSchemas";

const petBaseSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  type: z.enum(["dog", "cat", "bird", "hamster", "other"]),
  customType: z.string().nullish(),
  breed: z.string().nullish(),
  ageYears: z.number().int().nonnegative().nullish(),
  ageMonths: z.number().int().min(0).max(11).nullish(),
  temperament: z.enum(["calm", "needs-warming-up"]),
  energyLevel: z.enum(["low", "medium", "high"]),
  photoUrl: base64Schema,
  gender: z.enum(["male", "female"]).nullish(),
  dateOfBirth: z.string().nullish(),
  weightKg: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().positive().nullish()),
  lifestyle: z.enum(["indoor", "outdoor"]).nullish(),
  isNeutered: z.boolean().default(false),
});

export const createPetSchema = petBaseSchema.refine(
  (data) => data.type !== "other" || !!data.customType,
  {
    message: "Custom pet type is required when selecting 'Other'",
    path: ["customType"],
  }
);

export const updatePetSchema = petBaseSchema.partial();

export const petIdParamSchema = z.object({
  id: z.string().uuid("Invalid pet ID"),
});

export const petQuerySchema = z.object({
  ownerId: z.string().uuid().optional(),
});

export const ownerOnboardingSchema = z
  .object({
    petName: z.string().min(1, "Pet name is required"),
    petType: z.enum(["dog", "cat", "bird", "hamster", "other"]),
    customType: z.string().optional(),
    breed: z.string().optional(),
    ageYears: z.number().int().nonnegative().optional(),
    ageMonths: z.number().int().min(0).max(11).optional(),
    temperament: z.enum(["calm", "needs-warming-up"]),
    energyLevel: z.enum(["low", "medium", "high"]),
    petPhoto: base64Schema,
    gender: z.enum(["male", "female"]).nullish(),
    dateOfBirth: z.string().nullish(),
    weightKg: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().positive().nullish()),
    lifestyle: z.enum(["indoor", "outdoor"]).nullish(),
    isNeutered: z.boolean().default(false),
    completedVaccinations: z.array(z.string()).default([]),
  })
  .refine((data) => data.petType !== "other" || !!data.customType, {
    message: "Custom pet type required when 'Other' selected",
    path: ["customType"],
  });

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type OwnerOnboardingInput = z.infer<typeof ownerOnboardingSchema>;
