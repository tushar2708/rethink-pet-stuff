export type PetType = "dog" | "cat" | "bird" | "hamster" | "other";
export type Temperament = "calm" | "needs-warming-up";
export type EnergyLevel = "low" | "medium" | "high";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  type: PetType;
  customType?: string; // when type is "other"
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  temperament: Temperament;
  energyLevel: EnergyLevel;
  photoUrl?: string;
  createdAt: string;
}
