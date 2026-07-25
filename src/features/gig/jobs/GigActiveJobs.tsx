import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import { useActiveGigJobs } from "@/hooks/useGigWorkers";

export function GigActiveJobs() {
  const { data: jobs } = useActiveGigJobs();
  const updateAppointment = useUpdateAppointment();

  const handleUpdate = async (id: string, status: string) => {
    await updateAppointment.mutateAsync({ id, data: { status } });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Active Jobs</h1>
        <p className="text-sm text-muted-foreground">Current in-progress or confirmed work.</p>
      </div>
      <div className="space-y-3">
        {(jobs || []).map((job: any) => (
          <div key={job.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Link to={`/gig/jobs/${job.id}`} className="font-medium text-foreground hover:underline">{job.pet?.name}</Link>
                <p className="text-sm text-muted-foreground">{job.owner?.name} · {job.serviceType}</p>
              </div>
              <div className="flex gap-2">
                {job.status === "confirmed" && <Button size="sm" onClick={() => handleUpdate(job.id, "in-progress")}>Start</Button>}
                {job.status === "in-progress" && <Button size="sm" onClick={() => handleUpdate(job.id, "completed")}>Complete</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
