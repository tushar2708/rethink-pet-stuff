import { z } from "zod";

export const breedQuerySchema = z.object({
  petType: z.enum(["dog", "cat", "bird", "hamster", "other"]),
});

export type BreedQuery = z.infer<typeof breedQuerySchema>;
