import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppointments } from "@/hooks/useAppointments";
import { useMyVetProfile } from "@/hooks/useVets";

export function VetDashboard() {
  const { data: profile, isLoading } = useMyVetProfile();
  const { data: appointmentsData } = useAppointments();

  if (isLoading) return <div className="p-6">Loading...</div>;

  const appointments = appointmentsData?.appointments || [];
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter((a: any) => new Date(a.scheduledAt).toDateString() === today);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{profile?.useDrPrefix ? "Dr. " : ""}{profile?.user?.name || "Vet Dashboard"}</h1>
        <p className="text-sm text-muted-foreground">{profile?.clinics?.[0]?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Today's appointments</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{todaysAppointments.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Rating</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{profile?.rating ?? "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Specializations</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{profile?.specializations?.length ?? 0}</p>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Specializations</h2>
        <div className="flex flex-wrap gap-2">
          {profile?.specializations?.map((spec: any) => (
            <Badge key={spec.specialization}>{spec.specialization}</Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Today's Appointments</h2>
        <div className="space-y-3">
          {todaysAppointments.length === 0 ? <p className="text-sm text-muted-foreground">No appointments today.</p> : todaysAppointments.map((appt: any) => (
            <Card key={appt.id} className="p-4">
              <p className="font-medium text-foreground">{appt.pet?.name}</p>
              <p className="text-sm text-muted-foreground">{appt.owner?.name} · {appt.serviceType}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
