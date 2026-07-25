import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchGigWorkers } from "@/hooks/useGigWorkers";

const SERVICE_TYPES = ["walking", "sitting", "grooming", "taxi", "training"];

export function FindWorkerPage() {
  const [serviceType, setServiceType] = useState("");
  const [zip, setZip] = useState("");
  const { data, isLoading } = useSearchGigWorkers({ serviceType: serviceType || undefined, zip: zip || undefined });
  const workers = data?.workers || [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find a Worker</h1>
        <p className="text-sm text-muted-foreground">Search sitters, walkers, and groomers.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <select className="rounded-md border px-3 py-2" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <option value="">All services</option>
          {SERVICE_TYPES.map((service) => <option key={service} value={service}>{service}</option>)}
        </select>
        <Input placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} />
      </div>
      {isLoading ? <div>Loading...</div> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workers.map((worker: any) => (
            <Link key={worker.id} to={`/owner/find-worker/${worker.id}`}>
              <Card className="space-y-3 p-4 hover:border-primary/50">
                <p className="font-semibold text-foreground">{worker.firstName}</p>
                <div className="flex flex-wrap gap-2">
                  {worker.services?.slice(0, 3).map((service: any) => (
                    <Badge key={service.type} variant="secondary">{service.type}: ₹{service.hourlyRate}/hr</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Rating: {worker.rating ?? "No ratings yet"}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
