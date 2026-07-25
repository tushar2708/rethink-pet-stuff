import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useReviews(revieweeId: string) {
  return useQuery({
    queryKey: ["reviews", revieweeId],
    queryFn: () => apiFetch<any>(`/reviews?revieweeId=${revieweeId}`),
    enabled: !!revieweeId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { appointmentId: string; rating: number; comment?: string }) =>
      apiFetch("/reviews", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
