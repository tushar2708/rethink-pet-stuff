import type { StepConfig } from "@/hooks/useMultiStepForm";
import {
  gigPersonalInfoSchema,
  gigServicesSchema,
  gigAvailabilitySchema,
  gigAboutSchema,
  gigConsentSchema,
} from "./schemas";

export const GIG_STEPS: StepConfig[] = [
  {
    id: "personal-info",
    path: "personal-info",
    schema: gigPersonalInfoSchema,
    fields: ["firstName", "email", "phone"],
  },
  {
    id: "services",
    path: "services",
    schema: gigServicesSchema,
    fields: ["services"],
  },
  {
    id: "availability",
    path: "availability",
    schema: gigAvailabilitySchema,
    fields: ["schedule", "timePreferences", "coverageZip", "coverageRadiusMiles"],
  },
  {
    id: "about",
    path: "about",
    schema: gigAboutSchema,
    fields: ["bio", "hasPets", "petDetails"],
  },
  {
    id: "consent",
    path: "consent",
    schema: gigConsentSchema,
    fields: ["backgroundCheckConsent", "termsAccepted"],
  },
  {
    id: "complete",
    path: "complete",
    schema: gigConsentSchema,
    fields: [],
  },
];

export const GIG_STEP_LABELS = [
  { id: "personal-info", label: "Personal Info" },
  { id: "services", label: "Services" },
  { id: "availability", label: "Availability" },
  { id: "about", label: "About You" },
  { id: "consent", label: "Consent" },
  { id: "complete", label: "Complete" },
];
