import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import { useAvailableGigJobs } from "@/hooks/useGigWorkers";

export function GigJobsPage() {
  const { data: jobs } = useAvailableGigJobs();
  const updateAppointment = useUpdateAppointment();

  const handleAccept = async (jobId: string) => {
    await updateAppointment.mutateAsync({ id: jobId, data: { status: "confirmed" } });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Available Jobs</h1>
        <p className="text-sm text-muted-foreground">Jobs that match your services.</p>
      </div>
      <div className="space-y-3">
        {(jobs || []).map((job: any) => (
          <div key={job.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Link to={`/gig/jobs/${job.id}`} className="font-medium text-foreground hover:underline">{job.pet?.name}</Link>
                <p className="text-sm text-muted-foreground">{job.owner?.name} · {job.serviceType}</p>
                <p className="text-sm text-muted-foreground">{new Date(job.scheduledAt).toLocaleString()}</p>
              </div>
              <Button size="sm" onClick={() => handleAccept(job.id)}>Accept</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
