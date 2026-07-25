import { z } from "zod";

export const healthTemplateQuerySchema = z.object({
  petType: z.enum(["dog", "cat", "bird", "hamster", "other"]),
  lifestyle: z.string().optional(),
  gender: z.string().optional(),
  breed: z.string().optional(),
});

export const createHealthRecordSchema = z.object({
  templateId: z.string().uuid().optional(),
  name: z.string().min(1),
  careType: z.enum(["vaccination", "deworming", "checkup", "procedure"]),
  status: z.enum(["done", "scheduled", "overdue", "skipped"]).default("done"),
  dateDue: z.string().datetime().optional(),
  datePerformed: z.string().datetime().optional(),
  details: z.any().optional(),
  documentUrl: z.string().optional(),
});

export const updateHealthRecordSchema = z.object({
  status: z.enum(["done", "scheduled", "overdue", "skipped"]).optional(),
  datePerformed: z.string().datetime().optional(),
  details: z.any().optional(),
  documentUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type HealthTemplateQuery = z.infer<typeof healthTemplateQuerySchema>;
export type CreateHealthRecordInput = z.infer<typeof createHealthRecordSchema>;
export type UpdateHealthRecordInput = z.infer<typeof updateHealthRecordSchema>;
