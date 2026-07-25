import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { WeeklyScheduleBuilder } from "@/components/shared/WeeklyScheduleBuilder";
import { useMyVetProfile } from "@/hooks/useVets";
import { apiFetch } from "@/lib/api";
import { useState } from "react";

export function VetSchedulePage() {
  const qc = useQueryClient();
  const { data: profile } = useMyVetProfile();
  const [schedule, setSchedule] = useState<any[]>(profile?.schedules || []);
  const saveMutation = useMutation({
    mutationFn: () => apiFetch("/vets/me/schedule", { method: "PUT", body: JSON.stringify({ schedule }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vets", "me"] }),
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Schedule</h1>
        <p className="text-sm text-muted-foreground">Update your availability.</p>
      </div>
      <WeeklyScheduleBuilder value={schedule as any} onChange={(next) => setSchedule(next as any)} />
      <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
