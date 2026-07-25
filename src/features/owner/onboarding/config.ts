import type { StepConfig } from "@/hooks/useMultiStepForm";
import {
  ownerAboutYouSchema,
  ownerPetTypeSchema,
  ownerPetDetailsSchema,
  ownerTemperamentSchema,
} from "./schemas";

export const OWNER_STEPS: StepConfig[] = [
  {
    id: "about-you",
    path: "about-you",
    schema: ownerAboutYouSchema,
    fields: ["name", "email", "phone"],
  },
  {
    id: "pet-type",
    path: "pet-type",
    schema: ownerPetTypeSchema,
    fields: ["petType", "customType"],
  },
  {
    id: "pet-details",
    path: "pet-details",
    schema: ownerPetDetailsSchema,
    fields: ["petName", "ageYears", "ageMonths", "breed"],
  },
  {
    id: "temperament",
    path: "temperament",
    schema: ownerTemperamentSchema,
    fields: ["temperament", "energyLevel"],
  },
  {
    id: "complete",
    path: "complete",
    schema: ownerTemperamentSchema,
    fields: [],
  },
];

export const OWNER_STEP_LABELS = [
  { id: "pet-type", label: "Pet Type" },
  { id: "pet-details", label: "Pet Details" },
  { id: "temperament", label: "Temperament" },
  { id: "complete", label: "Complete" },
];
