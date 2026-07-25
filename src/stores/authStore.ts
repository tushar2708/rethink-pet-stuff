import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  vetProfileId: string | null;
  gigProfileId: string | null;
  setUser: (user: User) => void;
  setVetProfileId: (id: string) => void;
  setGigProfileId: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      vetProfileId: null,
      gigProfileId: null,
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      setVetProfileId: (id: string) => set({ vetProfileId: id }),
      setGigProfileId: (id: string) => set({ gigProfileId: id }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          vetProfileId: null,
          gigProfileId: null,
        }),
    }),
    { name: "petstuff-auth" }
  )
);
