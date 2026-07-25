import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: "owner" | "vet" | "gig";
    avatarUrl: string | null;
    onboardingComplete: boolean;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

function normalizeUser(user: AuthResponse["user"]) {
  return {
    ...user,
    avatarUrl: user.avatarUrl ?? undefined,
  };
}

function handleAuthSuccess(data: AuthResponse) {
  localStorage.setItem("petos-token", data.token);
  useAuthStore.getState().setUser(normalizeUser(data.user));
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: handleAuthSuccess,
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string; phone: string; role: string }) =>
      apiFetch<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: handleAuthSuccess,
  });
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const user = await apiFetch<AuthResponse["user"]>("/auth/me");
      const normalizedUser = normalizeUser(user);
      setUser(normalizedUser);
      return normalizedUser;
    },
    enabled: !!localStorage.getItem("petos-token"),
    retry: false,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: () => {
        localStorage.removeItem("petos-token");
        logout();
      },
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return () => {
    localStorage.removeItem("petos-token");
    logout();
    queryClient.clear();
  };
}
