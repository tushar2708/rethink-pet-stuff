import type { Address, DaySchedule } from "./common";

export type VetSpecialization =
  | "general"
  | "surgery"
  | "dermatology"
  | "dentistry"
  | "oncology"
  | "exotic"
  | "emergency"
  | "behavioral"
  | "nutrition"
  | "cardiology"
  | "ophthalmology"
  | "orthopedics";

export type VetDegree = "DVM" | "VMD" | "BVSc" | "other";
export type ConsultationDuration = 15 | 30 | 45 | 60;

export interface VetCredentials {
  licenseNumber: string;
  issuingAuthority: string;
  yearsOfPractice: number;
  degree: VetDegree;
  licenseDocUrl?: string;
}

export interface Clinic {
  name: string;
  address: Address;
  phone: string;
  website?: string;
  logoUrl?: string;
}

export interface VetProfile {
  id: string;
  userId: string;
  useDrPrefix: boolean;
  credentials: VetCredentials;
  clinics: Clinic[];
  specializations: VetSpecialization[];
  schedule: DaySchedule[];
  consultationDuration: ConsultationDuration;
  bio: string;
  photoUrl?: string;
  rating?: number;
  reviewCount?: number;
}
