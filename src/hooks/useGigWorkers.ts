import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useMyGigProfile() {
  return useQuery({
    queryKey: ["gig-workers", "me"],
    queryFn: () => apiFetch<any>("/gig-workers/me"),
  });
}

export function useGigProfile(id: string) {
  return useQuery({
    queryKey: ["gig-workers", id],
    queryFn: () => apiFetch<any>(`/gig-workers/${id}`),
    enabled: !!id,
  });
}

export function useSearchGigWorkers(params: { serviceType?: string; zip?: string; page?: number }) {
  const searchParams = new URLSearchParams();
  if (params.serviceType) searchParams.set("serviceType", params.serviceType);
  if (params.zip) searchParams.set("zip", params.zip);
  if (params.page) searchParams.set("page", String(params.page));
  return useQuery({
    queryKey: ["gig-workers", "search", params],
    queryFn: () => apiFetch<any>(`/gig-workers/search?${searchParams.toString()}`),
  });
}

export function useAvailableGigJobs() {
  return useQuery({
    queryKey: ["gig-workers", "me", "jobs", "available"],
    queryFn: () => apiFetch<any[]>("/gig-workers/me/jobs/available"),
  });
}

export function useActiveGigJobs() {
  return useQuery({
    queryKey: ["gig-workers", "me", "jobs", "active"],
    queryFn: () => apiFetch<any[]>("/gig-workers/me/jobs/active"),
  });
}

export function useGigJobHistory() {
  return useQuery({
    queryKey: ["gig-workers", "me", "jobs", "history"],
    queryFn: () => apiFetch<any[]>("/gig-workers/me/jobs/history"),
  });
}

export function useGigEarnings() {
  return useQuery({
    queryKey: ["gig-workers", "me", "earnings"],
    queryFn: () => apiFetch<{ total: number; thisWeek: number; thisMonth: number; completedJobs: number }>("/gig-workers/me/earnings"),
  });
}
