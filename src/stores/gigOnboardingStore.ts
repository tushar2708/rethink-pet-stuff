import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ServiceOffering {
  type: string;
  experienceLevel: string;
  hourlyRate: number | undefined;
}

export interface GigOnboardingData {
  // Step 1: Personal Information
  firstName: string;
  email: string;
  phone: string;
  // Step 2: Services
  services: ServiceOffering[];
  // Step 3: Availability & Coverage
  availableDays: string[];
  timePreferences: string;
  coverageZip: string;
  coverageRadiusMiles: number | undefined;
  // Step 4: Bio & Pets
  bio: string;
  hasPets: boolean;
  petDetails: string;
  // Step 5: Agreements
  backgroundCheckConsent: boolean;
  termsAccepted: boolean;
}

interface GigOnboardingState {
  data: Partial<GigOnboardingData>;
  setStepData: (stepData: Partial<GigOnboardingData>) => void;
  clearData: () => void;
}

export const useGigOnboardingStore = create<GigOnboardingState>()(
  persist(
    (set) => ({
      data: {},
      setStepData: (stepData: Partial<GigOnboardingData>) => {
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
      name: "petstuff-gig-onboarding",
    }
  )
);
