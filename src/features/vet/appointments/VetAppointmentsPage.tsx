import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppointments, useUpdateAppointment } from "@/hooks/useAppointments";

export function VetAppointmentsPage() {
  const { data } = useAppointments();
  const updateAppointment = useUpdateAppointment();
  const appointments = data?.appointments || [];

  const handleUpdate = async (id: string, status: string) => {
    await updateAppointment.mutateAsync({ id, data: { status } });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="text-sm text-muted-foreground">Manage your patient appointments.</p>
      </div>
      <div className="space-y-3">
        {appointments.map((appt: any) => (
          <div key={appt.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Link to={`/vet/appointments/${appt.id}`} className="font-medium text-foreground hover:underline">{appt.pet?.name}</Link>
                <p className="text-sm text-muted-foreground">{appt.owner?.name} · {appt.serviceType}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{appt.status}</Badge>
                {appt.status === "pending" && <Button size="sm" onClick={() => handleUpdate(appt.id, "confirmed")}>Confirm</Button>}
                {appt.status === "confirmed" && <Button size="sm" onClick={() => handleUpdate(appt.id, "in-progress")}>Start</Button>}
                {appt.status === "in-progress" && <Button size="sm" onClick={() => handleUpdate(appt.id, "completed")}>Complete</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
