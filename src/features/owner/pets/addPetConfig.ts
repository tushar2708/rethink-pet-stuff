import type { StepConfig } from "@/hooks/useMultiStepForm";
import {
  ownerPetTypeSchema,
  ownerPetDetailsSchema,
  ownerTemperamentSchema,
} from "../onboarding/schemas";

export const ADD_PET_STEPS: StepConfig[] = [
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

export const ADD_PET_STEP_LABELS = [
  { id: "pet-type", label: "Pet Type" },
  { id: "pet-details", label: "Pet Details" },
  { id: "temperament", label: "Temperament" },
  { id: "complete", label: "Complete" },
];
