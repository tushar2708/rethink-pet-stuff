import type { DaySchedule } from "./common";

export type GigServiceType = "walking" | "sitting" | "grooming" | "taxi" | "training";
export type ExperienceLevel = "beginner" | "intermediate" | "expert";
export type TimePref = "morning" | "afternoon" | "evening" | "flexible";

export interface ServiceDetail {
  type: GigServiceType;
  experienceLevel: ExperienceLevel;
  hourlyRate: number;
}

export interface GigWorkerProfile {
  id: string;
  userId: string;
  firstName: string;
  services: ServiceDetail[];
  schedule: DaySchedule[];
  timePreferences: TimePref[];
  coverageZip: string;
  coverageRadiusMiles: number;
  bio: string;
  hasPets: boolean;
  petDetails?: string;
  backgroundCheckConsent: boolean;
  photoUrl?: string;
  rating?: number;
  reviewCount?: number;
  badges: string[];
}
