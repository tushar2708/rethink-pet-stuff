import { Link } from "react-router-dom";
import { usePets } from "@/hooks/usePets";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function HealthRecordsPage() {
  const { data: pets = [] } = usePets();

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-8">
      <h1 className="font-display text-3xl font-bold mb-2">Health Records</h1>
      <p className="text-[#5a6882] mb-8">View and manage health records for all your pets</p>

      {pets.length === 0 ? (
        <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-12 text-center">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-bold mb-2">No pets registered yet</h3>
          <p className="text-[#5a6882] mb-6">Register a pet to start tracking health records</p>
          <Link to="/owner/pets/add/pet-type" className="inline-block bg-[#8b5cf6] text-white font-bold px-6 py-3 rounded-xl">
            Register Your Pet
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pets.map((pet: any) => (
            <PetHealthCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}

function PetHealthCard({ pet }: { pet: any }) {
  const { data: records = [] } = useQuery({
    queryKey: ["pets", pet.id, "health-records"],
    queryFn: () => apiFetch<any[]>(`/pets/${pet.id}/health-records`),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["pets", pet.id, "medical-events"],
    queryFn: () => apiFetch<any[]>(`/pets/${pet.id}/medical-events`),
  });

  const allRecords = [
    ...records.map((r: any) => ({ ...r, source: "preventive", date: r.datePerformed || r.dateDue })),
    ...events.map((e: any) => ({ ...e, source: "event", date: e.dateOccurred })),
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  return (
    <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] overflow-hidden">
      <div className="flex items-center gap-4 p-5 border-b border-[#1a1a3e]">
        {pet.photoUrl ? (
          <img src={pet.photoUrl} alt={pet.name} className="h-12 w-12 rounded-full object-cover border-2 border-[#8b5cf6]/30" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-[#1a1a3e] flex items-center justify-center text-xl">🐾</div>
        )}
        <div className="flex-1">
          <h3 className="font-display font-bold text-lg">{pet.name}</h3>
          <p className="text-sm text-[#5a6882]">{pet.breed || pet.type} · {allRecords.length} record{allRecords.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to={`/owner/pets/${pet.id}/medical`} className="text-sm text-[#8b5cf6] hover:underline">
          Add Record →
        </Link>
      </div>

      {allRecords.length === 0 ? (
        <div className="p-8 text-center text-[#5a6882]">No records yet</div>
      ) : (
        <div className="divide-y divide-[#1a1a3e]">
          {allRecords.slice(0, 5).map((record: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <div className={`w-2 h-2 rounded-full ${record.status === "done" || record.source === "event" ? "bg-green-500" : record.status === "overdue" ? "bg-red-500" : "bg-amber-500"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{record.name}</p>
                <p className="text-xs text-[#5a6882]">{record.careType || record.eventType}</p>
              </div>
              <p className="text-xs text-[#5a6882]">{record.date ? new Date(record.date).toLocaleDateString() : "—"}</p>
            </div>
          ))}
          {allRecords.length > 5 && (
            <Link to={`/owner/pets/${pet.id}/medical`} className="block px-5 py-3 text-center text-sm text-[#8b5cf6] hover:bg-[#161638]">
              View all {allRecords.length} records →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
