import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DaySchedule } from "@/types/common";

export interface VetOnboardingData {
  // Step 1: About You
  name: string;
  email: string;
  phone: string;
  useDrPrefix: boolean;
  // Step 2: Credentials
  licenseNumber: string;
  issuingAuthority: string;
  yearsOfPractice: number | undefined;
  degree: string;
  licenseDocUrl: string | undefined;
  // Step 3: Clinic Information
  clinicName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  clinicPhone: string;
  website: string;
  clinicLogoUrl: string | undefined;
  // Step 4: Specializations
  specializations: string[];
  // Step 5: Schedule
  schedule: DaySchedule[];
  consultationDuration: number | undefined;
  // Step 6: Bio
  bio: string;
  profilePhotoUrl: string | undefined;
}

interface VetOnboardingState {
  data: Partial<VetOnboardingData>;
  setStepData: (stepData: Partial<VetOnboardingData>) => void;
  clearData: () => void;
}

export const useVetOnboardingStore = create<VetOnboardingState>()(
  persist(
    (set) => ({
      data: {},
      setStepData: (stepData: Partial<VetOnboardingData>) => {
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
      name: "petos-vet-onboarding",
    }
  )
);
