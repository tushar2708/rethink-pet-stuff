import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; avatarUrl?: string }) =>
      apiFetch("/users/me", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: (updatedUser: any) => {
      useAuthStore.getState().setUser(updatedUser);
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
