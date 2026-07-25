import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useVetPatientDetail } from "@/hooks/useVets";

export function VetPatientDetail() {
  const params = useParams();
  const { data } = useVetPatientDetail(params.petId || "");

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{data.pet?.name}</h1>
        <p className="text-sm text-muted-foreground">Owner: {data.appointments?.[0]?.owner?.name}</p>
      </div>
      <div className="space-y-3">
        {data.appointments?.map((appt: any) => (
          <Card key={appt.id} className="space-y-2 p-4">
            <p className="font-medium text-foreground">{appt.serviceType}</p>
            <p className="text-sm text-muted-foreground">{new Date(appt.scheduledAt).toLocaleString()}</p>
            {appt.notes && <p className="text-sm text-muted-foreground">Notes: {appt.notes}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
