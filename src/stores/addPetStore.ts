import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AddPetData {
  petType: string;
  customType: string;
  petName: string;
  ageYears: number | undefined;
  ageMonths: number | undefined;
  breed: string;
  gender: string;
  dateOfBirth: string;
  weightKg: number | undefined;
  lifestyle: string;
  isNeutered: boolean;
  completedVaccinations: string[];
  temperament: string;
  energyLevel: string;
  petPhoto: string;
}

interface AddPetState {
  data: Partial<AddPetData>;
  setStepData: (stepData: Partial<AddPetData>) => void;
  clearData: () => void;
}

export const useAddPetStore = create<AddPetState>()(
  persist(
    (set) => ({
      data: {},
      setStepData: (stepData: Partial<AddPetData>) => {
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
      name: "petos-add-pet",
    }
  )
);
