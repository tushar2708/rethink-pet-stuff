import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OwnerOnboardingData extends Record<string, unknown> {
  // Step 1: About You
  name?: string;
  email?: string;
  phone?: string;
  // Step 2: Pet Type
  petType?: string;
  customType?: string;
  // Step 3: Breed
  breed?: string;
  // Step 4: Basics
  petName?: string;
  gender?: string;
  dateOfBirth?: string;
  weightKg?: number;
  petPhoto?: File | string;
  // Step 5: Lifestyle
  lifestyle?: string;
  // Step 6: Vaccination
  isNeutered?: boolean;
  completedVaccinations?: string[];
  // Step 7: Temperament
  temperament?: string;
  energyLevel?: string;
}

interface OwnerOnboardingState {
  data: Partial<OwnerOnboardingData>;
  setStepData: (stepData: Partial<OwnerOnboardingData>) => void;
  clearData: () => void;
}

export const useOwnerOnboardingStore = create<OwnerOnboardingState>()(
  persist(
    (set) => ({
      data: {},
      setStepData: (stepData: Partial<OwnerOnboardingData>) => {
        set((state) => ({
          data: {
            ...state.data,
            ...stepData,
          },
        }));
      },
      clearData: () => {
        set({ data: {} });
      },
    }),
    {
      name: "petos-owner-onboarding",
    }
  )
);
