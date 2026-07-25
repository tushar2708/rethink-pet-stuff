import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppointment, useUpdateAppointment } from "@/hooks/useAppointments";

export function VetAppointmentDetail() {
  const params = useParams();
  const { data: appt } = useAppointment(params.appointmentId || "");
  const updateAppointment = useUpdateAppointment();

  if (!appt) return <div className="p-6">Loading...</div>;

  const handleUpdate = async (status: string) => {
    await updateAppointment.mutateAsync({ id: appt.id, data: { status } });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointment Detail</h1>
        <p className="text-sm text-muted-foreground">{appt.pet?.name} · {appt.owner?.name}</p>
      </div>
      <div className="rounded-lg border p-4 space-y-2">
        <p className="text-sm text-muted-foreground">Service: {appt.serviceType}</p>
        <p className="text-sm text-muted-foreground">When: {new Date(appt.scheduledAt).toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Status: {appt.status}</p>
        {appt.notes && <p className="text-sm text-muted-foreground">Notes: {appt.notes}</p>}
      </div>
      <div className="flex gap-2">
        {appt.status === "pending" && <Button onClick={() => handleUpdate("confirmed")}>Confirm</Button>}
        {appt.status === "confirmed" && <Button onClick={() => handleUpdate("in-progress")}>Start</Button>}
        {appt.status === "in-progress" && <Button onClick={() => handleUpdate("completed")}>Complete</Button>}
      </div>
    </div>
  );
}
