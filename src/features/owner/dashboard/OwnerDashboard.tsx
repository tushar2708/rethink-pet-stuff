import { Link } from "react-router-dom";
import { Dog, Cat, Bird, Rabbit, Plus, Search, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePets } from "@/hooks/usePets";
import { useAuthStore } from "@/stores/authStore";

const PET_ICONS: Record<string, React.ComponentType<any>> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  hamster: Rabbit,
};

export function OwnerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: pets, isLoading } = usePets();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name || "Pet Owner"}</h1>
        <p className="text-sm text-muted-foreground">Manage your pets and bookings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/owner/find-vet">
          <Card className="p-4 hover:border-primary/50">
            <div className="flex items-center gap-3"><Search className="h-5 w-5 text-primary" /><span className="font-medium">Find Vet</span></div>
          </Card>
        </Link>
        <Link to="/owner/find-worker">
          <Card className="p-4 hover:border-primary/50">
            <div className="flex items-center gap-3"><Search className="h-5 w-5 text-primary" /><span className="font-medium">Find Worker</span></div>
          </Card>
        </Link>
        <Link to="/owner/appointments">
          <Card className="p-4 hover:border-primary/50">
            <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-primary" /><span className="font-medium">Appointments</span></div>
          </Card>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">My Pets</h2>
          <Link to="/owner/pets/add/pet-type" className="text-sm text-primary hover:underline">Add Pet</Link>
        </div>

        {!pets || pets.length === 0 ? (
          <EmptyState title="No pets yet" description="Add your first pet to get started." action={{ label: "Add Pet", onClick: () => { window.location.href = "/owner/pets/add/pet-type"; } }} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet: any) => {
              const Icon = PET_ICONS[pet.type] || Dog;
              return (
                <Link key={pet.id} to={`/owner/pets/${pet.id}`}>
                  <Card className="space-y-3 p-4 hover:border-primary/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{pet.name}</p>
                        <p className="text-xs text-muted-foreground">{pet.breed || pet.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {pet.ageYears !== undefined && <span>{pet.ageYears}y</span>}
                      {pet.ageMonths !== undefined && <span>{pet.ageMonths}m</span>}
                    </div>
                    <Badge variant="secondary">{pet.temperament}</Badge>
                  </Card>
                </Link>
              );
            })}
            <Link to="/owner/pets/add/pet-type">
              <Card className="flex h-full min-h-[140px] items-center justify-center border-dashed p-4 hover:border-primary/50">
                <div className="text-center">
                  <Plus className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-medium text-foreground">Add another pet</p>
                </div>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
