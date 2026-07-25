import { Link } from "react-router-dom";
import { usePets } from "@/hooks/usePets";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function VaccinationsPage() {
  const { data: pets = [] } = usePets();

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-8">
      <h1 className="font-display text-3xl font-bold mb-2">Vaccinations</h1>
      <p className="text-[#5a6882] mb-8">Track vaccination schedules for all your pets</p>

      {pets.length === 0 ? (
        <div className="rounded-2xl bg-[#111128] border border-[#1a1a3e] p-12 text-center">
          <p className="text-5xl mb-4">💉</p>
          <h3 className="text-xl font-bold mb-2">No pets registered yet</h3>
          <p className="text-[#5a6882] mb-6">Register a pet to see their vaccination schedule</p>
          <Link to="/owner/pets/add/pet-type" className="inline-block bg-[#8b5cf6] text-white font-bold px-6 py-3 rounded-xl">
            Register Your Pet
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pets.map((pet: any) => (
            <PetVaccinationCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}

function PetVaccinationCard({ pet }: { pet: any }) {
  const { data: timeline } = useQuery({
    queryKey: ["pets", pet.id, "health-timeline"],
    queryFn: () => apiFetch<any>(`/pets/${pet.id}/health-timeline`),
  });

  const allItems: any[] = [];
  if (timeline) {
    for (const stage of ["onRepeat", "kitten", "puppy", "firstYear", "adult", "senior", "lifetimeWatch"]) {
      const items = (timeline as any)[stage];
      if (Array.isArray(items)) {
        allItems.push(...items.filter((item: any) => item.careType === "vaccination"));
      }
    }
  }

  const done = allItems.filter((i) => i.status === "done").length;
  const overdue = allItems.filter((i) => i.status === "overdue").length;
  const total = allItems.length;

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
          <p className="text-sm text-[#5a6882]">{pet.breed || pet.type}</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold">{done} done</span>
          {overdue > 0 && <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-bold">{overdue} overdue</span>}
          <span className="bg-[#1a1a3e] text-[#5a6882] px-3 py-1 rounded-full font-bold">{total} total</span>
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="p-8 text-center text-[#5a6882]">
          <p>No vaccination data yet.</p>
          <Link to={`/owner/pets/${pet.id}/health`} className="text-[#8b5cf6] text-sm mt-2 inline-block">View health timeline →</Link>
        </div>
      ) : (
        <div className="divide-y divide-[#1a1a3e]">
          {allItems.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.status === "done" ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" : item.status === "overdue" ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
              </div>
              <div className="text-right">
                {item.dateDue && (
                  <p className={`text-xs font-medium ${item.status === "overdue" ? "text-red-400" : item.status === "done" ? "text-green-400" : "text-[#5a6882]"}`}>
                    {new Date(item.dateDue).toLocaleDateString()}
                  </p>
                )}
                <p className="text-[10px] text-[#5a6882] capitalize">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-[#1a1a3e]">
        <Link to={`/owner/pets/${pet.id}/health`} className="block text-center text-sm text-[#8b5cf6] hover:underline">
          View full health timeline →
        </Link>
      </div>
    </div>
  );
}
