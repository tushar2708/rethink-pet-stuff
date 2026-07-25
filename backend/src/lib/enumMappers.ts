import { Temperament, AppointmentStatus } from "@prisma/client";

const TEMPERAMENT_MAP: Record<string, Temperament> = {
  "calm": Temperament.calm,
  "needs-warming-up": Temperament.needs_warming_up,
};

const TEMPERAMENT_REVERSE: Record<Temperament, string> = {
  [Temperament.calm]: "calm",
  [Temperament.needs_warming_up]: "needs-warming-up",
};

export function toDbTemperament(val: string): Temperament {
  return TEMPERAMENT_MAP[val] || Temperament.calm;
}

export function toApiTemperament(val: Temperament): string {
  return TEMPERAMENT_REVERSE[val] || "calm";
}

const STATUS_MAP: Record<string, AppointmentStatus> = {
  "pending": AppointmentStatus.pending,
  "confirmed": AppointmentStatus.confirmed,
  "in-progress": AppointmentStatus.in_progress,
  "in_progress": AppointmentStatus.in_progress,
  "completed": AppointmentStatus.completed,
  "cancelled": AppointmentStatus.cancelled,
};

const STATUS_REVERSE: Record<AppointmentStatus, string> = {
  [AppointmentStatus.pending]: "pending",
  [AppointmentStatus.confirmed]: "confirmed",
  [AppointmentStatus.in_progress]: "in-progress",
  [AppointmentStatus.completed]: "completed",
  [AppointmentStatus.cancelled]: "cancelled",
};

export function toDbStatus(val: string): AppointmentStatus {
  return STATUS_MAP[val] || AppointmentStatus.pending;
}

export function toApiStatus(val: AppointmentStatus): string {
  return STATUS_REVERSE[val] || "pending";
}
