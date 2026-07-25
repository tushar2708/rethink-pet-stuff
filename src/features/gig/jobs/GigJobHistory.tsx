import { Badge } from "@/components/ui/badge";
import { useGigJobHistory } from "@/hooks/useGigWorkers";

export function GigJobHistory() {
  const { data: jobs } = useGigJobHistory();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job History</h1>
        <p className="text-sm text-muted-foreground">Past completed and cancelled jobs.</p>
      </div>
      <div className="space-y-3">
        {(jobs || []).map((job: any) => (
          <div key={job.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{job.pet?.name}</p>
                <p className="text-sm text-muted-foreground">{job.serviceType} · {new Date(job.scheduledAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <Badge>{job.status}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">${job.price ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
