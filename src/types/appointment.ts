export type AppointmentStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  providerId: string; // vet or gig worker userId
  providerType: "vet" | "gig";
  serviceType: string;
  status: AppointmentStatus;
  scheduledAt: string;
  durationMinutes: number;
  notes?: string;
  createdAt: string;
}
