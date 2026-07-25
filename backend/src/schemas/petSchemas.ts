import { z } from "zod";

const petBaseSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  type: z.enum(["dog", "cat", "bird", "hamster", "other"]),
  customType: z.string().nullish(),
  breed: z.string().nullish(),
  ageYears: z.number().int().nonnegative().nullish(),
  ageMonths: z.number().int().min(0).max(11).nullish(),
  temperament: z.enum(["calm", "needs-warming-up"]),
  energyLevel: z.enum(["low", "medium", "high"]),
  photoUrl: z.string().nullish(),
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
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    petName: z.string().min(1, "Pet name is required"),
    petType: z.enum(["dog", "cat", "bird", "hamster", "other"]),
    customType: z.string().optional(),
    breed: z.string().optional(),
    ageYears: z.number().int().nonnegative().optional(),
    ageMonths: z.number().int().min(0).max(11).optional(),
    temperament: z.enum(["calm", "needs-warming-up"]),
    energyLevel: z.enum(["low", "medium", "high"]),
    petPhoto: z.string().optional(),
  })
  .refine((data) => data.petType !== "other" || !!data.customType, {
    message: "Custom pet type required when 'Other' selected",
    path: ["customType"],
  });

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type OwnerOnboardingInput = z.infer<typeof ownerOnboardingSchema>;
