import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchVets } from "@/hooks/useVets";
import { VET_SPECIALIZATIONS } from "@/lib/constants";

export function FindVetPage() {
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const { data, isLoading } = useSearchVets({
    specialization: specialization || undefined,
    city: city || undefined,
    state: state || undefined,
  });

  const vets = data?.vets || [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find a Vet</h1>
        <p className="text-sm text-muted-foreground">Search by specialization and location.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <select className="rounded-md border px-3 py-2" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All specializations</option>
          {VET_SPECIALIZATIONS.map((spec) => (
            <option key={spec.value} value={spec.value}>{spec.label}</option>
          ))}
        </select>
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vets.map((vet: any) => (
            <Link key={vet.id} to={`/owner/find-vet/${vet.id}`}>
              <Card className="space-y-3 p-4 hover:border-primary/50">
                <div>
                  <p className="font-semibold text-foreground">{vet.useDrPrefix ? "Dr. " : ""}{vet.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{vet.clinics?.[0]?.name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vet.specializations?.slice(0, 3).map((spec: any) => (
                    <Badge key={spec.specialization} variant="secondary">{spec.specialization}</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Rating: {vet.rating ?? "No ratings yet"}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
