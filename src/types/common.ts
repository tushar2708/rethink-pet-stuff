export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface TimeSlot {
  start: string; // HH:mm format
  end: string;
}

export interface DaySchedule {
  day: DayOfWeek;
  enabled: boolean;
  slots: TimeSlot[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
