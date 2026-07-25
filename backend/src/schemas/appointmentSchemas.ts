import { z } from "zod";

export const createAppointmentSchema = z.object({
  petId: z.string().uuid("Invalid pet ID"),
  providerId: z.string().uuid("Invalid provider ID"),
  providerType: z.enum(["vet", "gig"]),
  serviceType: z.string().min(1, "Service type is required"),
  scheduledAt: z.string().datetime("Invalid datetime format"),
  durationMinutes: z.number().int().positive("Duration must be positive"),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["confirmed", "in-progress", "completed", "cancelled"]),
  notes: z.string().optional(),
});

export const appointmentQuerySchema = z.object({
  ownerId: z.string().uuid().optional(),
  providerId: z.string().uuid().optional(),
  status: z
    .enum(["pending", "confirmed", "in-progress", "completed", "cancelled"])
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const appointmentIdParamSchema = z.object({
  id: z.string().uuid("Invalid appointment ID"),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type AppointmentQuery = z.infer<typeof appointmentQuerySchema>;
