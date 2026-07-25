import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useMyVetProfile() {
  return useQuery({
    queryKey: ["vets", "me"],
    queryFn: () => apiFetch<any>("/vets/me"),
  });
}

export function useVetProfile(id: string) {
  return useQuery({
    queryKey: ["vets", id],
    queryFn: () => apiFetch<any>(`/vets/${id}`),
    enabled: !!id,
  });
}

export function useSearchVets(params: { specialization?: string; city?: string; state?: string; page?: number }) {
  const searchParams = new URLSearchParams();
  if (params.specialization) searchParams.set("specialization", params.specialization);
  if (params.city) searchParams.set("city", params.city);
  if (params.state) searchParams.set("state", params.state);
  if (params.page) searchParams.set("page", String(params.page));
  return useQuery({
    queryKey: ["vets", "search", params],
    queryFn: () => apiFetch<any>(`/vets/search?${searchParams.toString()}`),
  });
}

export function useVetPatients() {
  return useQuery({
    queryKey: ["vets", "me", "patients"],
    queryFn: () => apiFetch<any[]>("/vets/me/patients"),
  });
}

export function useVetPatientDetail(petId: string) {
  return useQuery({
    queryKey: ["vets", "me", "patients", petId],
    queryFn: () => apiFetch<any>(`/vets/me/patients/${petId}`),
    enabled: !!petId,
  });
}
