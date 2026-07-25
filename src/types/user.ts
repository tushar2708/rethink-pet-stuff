export type UserRole = "owner" | "vet" | "gig";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  onboardingComplete: boolean;
  createdAt: string;
}
