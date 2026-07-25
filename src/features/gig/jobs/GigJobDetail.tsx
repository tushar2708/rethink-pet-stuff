import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppointment, useUpdateAppointment } from "@/hooks/useAppointments";

export function GigJobDetail() {
  const params = useParams();
  const { data: job } = useAppointment(params.jobId || "");
  const updateAppointment = useUpdateAppointment();

  if (!job) return <div className="p-6">Loading...</div>;

  const handleUpdate = async (status: string) => {
    await updateAppointment.mutateAsync({ id: job.id, data: { status } });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Detail</h1>
        <p className="text-sm text-muted-foreground">{job.pet?.name} · {job.owner?.name}</p>
      </div>
      <div className="rounded-lg border p-4 space-y-2">
        <p className="text-sm text-muted-foreground">Service: {job.serviceType}</p>
        <p className="text-sm text-muted-foreground">When: {new Date(job.scheduledAt).toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Duration: {job.durationMinutes} minutes</p>
        {job.notes && <p className="text-sm text-muted-foreground">Notes: {job.notes}</p>}
      </div>
      <div className="flex gap-2">
        {job.status === "confirmed" && <Button onClick={() => handleUpdate("in-progress")}>Start</Button>}
        {job.status === "in-progress" && <Button onClick={() => handleUpdate("completed")}>Complete</Button>}
      </div>
    </div>
  );
}
