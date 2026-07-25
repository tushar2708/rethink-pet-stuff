import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useVetPatients } from "@/hooks/useVets";

export function VetPatientsPage() {
  const { data: patients } = useVetPatients();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patients</h1>
        <p className="text-sm text-muted-foreground">Pets you have seen recently.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(patients || []).map((pet: any) => (
          <Link key={pet.id} to={`/vet/patients/${pet.id}`}>
            <Card className="space-y-2 p-4 hover:border-primary/50">
              <p className="font-semibold text-foreground">{pet.name}</p>
              <p className="text-sm text-muted-foreground">{pet.type} · {pet.breed || "Unknown breed"}</p>
              <p className="text-sm text-muted-foreground">Owner: {pet.owner?.name}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
