import type { StepConfig } from "@/hooks/useMultiStepForm";
import {
  vetPersonalInfoSchema,
  vetCredentialsSchema,
  vetClinicSchema,
  vetSpecializationsSchema,
  vetAvailabilitySchema,
  vetProfileSchema,
} from "./schemas";

export const VET_STEPS: StepConfig[] = [
  {
    id: "personal-info",
    path: "personal-info",
    schema: vetPersonalInfoSchema,
    fields: ["name", "email", "phone", "useDrPrefix"],
  },
  {
    id: "credentials",
    path: "credentials",
    schema: vetCredentialsSchema,
    fields: ["licenseNumber", "issuingAuthority", "yearsOfPractice", "degree"],
  },
  {
    id: "clinic",
    path: "clinic",
    schema: vetClinicSchema,
    fields: ["clinicName", "street", "city", "state", "zip", "clinicPhone", "website"],
  },
  {
    id: "specializations",
    path: "specializations",
    schema: vetSpecializationsSchema,
    fields: ["specializations"],
  },
  {
    id: "availability",
    path: "availability",
    schema: vetAvailabilitySchema,
    fields: ["schedule", "consultationDuration"],
  },
  {
    id: "profile",
    path: "profile",
    schema: vetProfileSchema,
    fields: ["bio"],
  },
  {
    id: "complete",
    path: "complete",
    schema: vetProfileSchema,
    fields: [],
  },
];

export const VET_STEP_LABELS = [
  { id: "personal-info", label: "Personal Info" },
  { id: "credentials", label: "Credentials" },
  { id: "clinic", label: "Clinic Info" },
  { id: "specializations", label: "Specializations" },
  { id: "availability", label: "Availability" },
  { id: "profile", label: "Profile" },
  { id: "complete", label: "Complete" },
];
