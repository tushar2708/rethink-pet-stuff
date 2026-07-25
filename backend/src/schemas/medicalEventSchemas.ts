import { z } from "zod";

export const createMedicalEventSchema = z.object({
  eventType: z.enum(["disease", "surgery", "injury", "allergy", "dental", "emergency"]),
  name: z.string().min(1),
  dateOccurred: z.string().datetime().optional(),
  severity: z.enum(["mild", "moderate", "severe", "critical"]).optional(),
  outcome: z.enum(["resolved", "ongoing", "chronic", "monitoring"]).optional(),
  details: z.any().optional(),
  documentUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const updateMedicalEventSchema = createMedicalEventSchema.partial();

export type CreateMedicalEventInput = z.infer<typeof createMedicalEventSchema>;
export type UpdateMedicalEventInput = z.infer<typeof updateMedicalEventSchema>;
