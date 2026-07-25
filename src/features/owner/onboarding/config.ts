import type { StepConfig } from "@/hooks/useMultiStepForm";
import {
  ownerPetTypeSchema,
  ownerBreedSchema,
  ownerBasicsSchema,
  ownerLifestyleSchema,
  ownerVaccinationSchema,
  ownerTemperamentSchema,
} from "./schemas";

export const OWNER_STEPS: StepConfig[] = [
  {
    id: "pet-type",
    path: "pet-type",
    schema: ownerPetTypeSchema,
    fields: ["petType", "customType"],
  },
  {
    id: "breed",
    path: "breed",
    schema: ownerBreedSchema,
    fields: ["breed"],
  },
  {
    id: "basics",
    path: "basics",
    schema: ownerBasicsSchema,
    fields: ["petName", "gender", "dateOfBirth", "weightKg"],
  },
  {
    id: "lifestyle",
    path: "lifestyle",
    schema: ownerLifestyleSchema,
    fields: ["lifestyle"],
  },
  {
    id: "vaccination",
    path: "vaccination",
    schema: ownerVaccinationSchema,
    fields: ["completedVaccinations", "isNeutered"],
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
  { id: "breed", label: "Breed" },
  { id: "basics", label: "Basics" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "vaccination", label: "Vaccination" },
  { id: "temperament", label: "Temperament" },
  { id: "complete", label: "Complete" },
];
