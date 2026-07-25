import type { DayOfWeek } from "../types/common";
import type { PetType, Temperament, EnergyLevel } from "../types/pet";
import type { VetSpecialization } from "../types/vet";
import type { GigServiceType } from "../types/gig";

// Pet Types
export const PET_TYPES = [
  { value: "dog" as const, label: "Dog", icon: "Dog" },
  { value: "cat" as const, label: "Cat", icon: "Cat" },
  { value: "bird" as const, label: "Bird", icon: "Bird" },
  { value: "hamster" as const, label: "Hamster", icon: "Rabbit" },
  { value: "other" as const, label: "Other", icon: "HelpCircle" },
] as const satisfies Array<{ value: PetType; label: string; icon: string }>;

// Vet Specializations
export const VET_SPECIALIZATIONS = [
  { value: "general" as const, label: "General Practice", icon: "Stethoscope" },
  { value: "surgery" as const, label: "Surgery", icon: "Scissors" },
  { value: "dermatology" as const, label: "Dermatology", icon: "Droplets" },
  { value: "dentistry" as const, label: "Dentistry", icon: "Sparkles" },
  { value: "oncology" as const, label: "Oncology", icon: "AlertCircle" },
  { value: "exotic" as const, label: "Exotic Animals", icon: "Bird" },
  { value: "emergency" as const, label: "Emergency & Critical Care", icon: "AlertTriangle" },
  { value: "behavioral" as const, label: "Behavioral", icon: "Brain" },
  { value: "nutrition" as const, label: "Nutrition", icon: "Apple" },
  { value: "cardiology" as const, label: "Cardiology", icon: "Heart" },
  { value: "ophthalmology" as const, label: "Ophthalmology", icon: "Eye" },
  { value: "orthopedics" as const, label: "Orthopedics", icon: "Bone" },
] as const satisfies Array<{ value: VetSpecialization; label: string; icon: string }>;

// Gig Services
export const GIG_SERVICES = [
  {
    value: "walking" as const,
    label: "Dog Walking",
    icon: "Footprints",
    suggestedRateRange: { min: 15, max: 25 },
  },
  {
    value: "sitting" as const,
    label: "Pet Sitting",
    icon: "Home",
    suggestedRateRange: { min: 20, max: 35 },
  },
  {
    value: "grooming" as const,
    label: "Grooming",
    icon: "Scissors",
    suggestedRateRange: { min: 35, max: 75 },
  },
  {
    value: "taxi" as const,
    label: "Pet Taxi",
    icon: "Car",
    suggestedRateRange: { min: 25, max: 50 },
  },
  {
    value: "training" as const,
    label: "Training",
    icon: "Award",
    suggestedRateRange: { min: 40, max: 80 },
  },
] as const satisfies Array<{
  value: GigServiceType;
  label: string;
  icon: string;
  suggestedRateRange: { min: number; max: number };
}>;

// Temperaments
export const TEMPERAMENTS = [
  { value: "calm" as const, label: "Calm" },
  { value: "needs-warming-up" as const, label: "Needs Warming Up" },
] as const satisfies Array<{ value: Temperament; label: string }>;

// Energy Levels
export const ENERGY_LEVELS = [
  { value: "low" as const, label: "Low" },
  { value: "medium" as const, label: "Medium" },
  { value: "high" as const, label: "High" },
] as const satisfies Array<{ value: EnergyLevel; label: string }>;

// Days of Week
export const DAYS_OF_WEEK = [
  { value: "mon" as const, label: "Monday" },
  { value: "tue" as const, label: "Tuesday" },
  { value: "wed" as const, label: "Wednesday" },
  { value: "thu" as const, label: "Thursday" },
  { value: "fri" as const, label: "Friday" },
  { value: "sat" as const, label: "Saturday" },
  { value: "sun" as const, label: "Sunday" },
] as const satisfies Array<{ value: DayOfWeek; label: string }>;

// Consultation Durations
export const CONSULTATION_DURATIONS = [
  { value: 15 as const, label: "15 minutes" },
  { value: 30 as const, label: "30 minutes" },
  { value: 45 as const, label: "45 minutes" },
  { value: 60 as const, label: "1 hour" },
] as const satisfies Array<{ value: 15 | 30 | 45 | 60; label: string }>;
