import { Card } from "@/components/ui/card";
import { useGigEarnings, useGigJobHistory } from "@/hooks/useGigWorkers";

export function GigEarningsPage() {
  const { data: earnings } = useGigEarnings();
  const { data: jobs } = useGigJobHistory();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="text-sm text-muted-foreground">Track your completed-job earnings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="mt-2 text-2xl font-bold text-foreground">${earnings?.total ?? 0}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">This month</p><p className="mt-2 text-2xl font-bold text-foreground">${earnings?.thisMonth ?? 0}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">This week</p><p className="mt-2 text-2xl font-bold text-foreground">${earnings?.thisWeek ?? 0}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Completed jobs</p><p className="mt-2 text-2xl font-bold text-foreground">{earnings?.completedJobs ?? 0}</p></Card>
      </div>
      <div className="space-y-3">
        {(jobs || []).map((job: any) => (
          <Card key={job.id} className="p-4">
            <p className="font-medium text-foreground">{job.pet?.name}</p>
            <p className="text-sm text-muted-foreground">{job.serviceType} · ₹{job.price ?? 0}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
