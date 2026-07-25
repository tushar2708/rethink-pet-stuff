import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/useAppointments";

const STATUSES = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

export function OwnerAppointmentsPage() {
  const { data } = useAppointments();
  const appointments = data?.appointments || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground">Track your bookings and services.</p>
        </div>
        <Link to="/owner/bookings/new"><Button>New Booking</Button></Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => <Badge key={status} variant="outline">{status}</Badge>)}
      </div>
      <div className="space-y-3">
        {appointments.map((appt: any) => (
          <Link key={appt.id} to={`/owner/appointments/${appt.id}`}>
            <div className="rounded-lg border p-4 hover:border-primary/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{appt.pet?.name} with {appt.provider?.name}</p>
                  <p className="text-sm text-muted-foreground">{appt.serviceType} · {new Date(appt.scheduledAt).toLocaleString()}</p>
                </div>
                <Badge>{appt.status}</Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
