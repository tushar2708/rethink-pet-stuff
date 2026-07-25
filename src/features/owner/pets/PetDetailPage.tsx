import { useNavigate, useParams, Link } from "react-router-dom";
import { Dog, Cat, Bird, Rabbit, HelpCircle, Pencil, Trash2, ArrowLeft, Heart, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePet, useDeletePet } from "@/hooks/usePets";
import type { LucideIcon } from "lucide-react";

const PET_ICONS: Record<string, LucideIcon> = { dog: Dog, cat: Cat, bird: Bird, hamster: Rabbit, other: HelpCircle };
const TYPE_LABELS: Record<string, string> = { dog: "Dog", cat: "Cat", bird: "Bird", hamster: "Hamster" };
const TEMP_LABELS: Record<string, string> = { calm: "Calm & Friendly", "needs-warming-up": "Needs Warming Up" };
const ENERGY_LABELS: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

export function PetDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { data: pet, isLoading } = usePet(params.petId || "");
  const deletePet = useDeletePet();

  if (isLoading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!pet) return <div className="p-6 text-center text-muted-foreground">Pet not found</div>;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${pet.name}?`)) return;
    await deletePet.mutateAsync(pet.id);
    navigate("/owner/dashboard");
  };

  const Icon = PET_ICONS[pet.type] || HelpCircle;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <button onClick={() => navigate("/owner/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <Card className="overflow-hidden">
        {/* Header with photo */}
        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-primary/10 shadow-md">
                <Icon className="h-14 w-14 text-primary" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left sm:pt-2">
              <h1 className="text-2xl font-bold text-foreground">{pet.name}</h1>
              <p className="text-muted-foreground">{TYPE_LABELS[pet.type] || pet.customType} {pet.breed ? `· ${pet.breed}` : ""}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="gap-1"><Heart className="h-3 w-3" />{TEMP_LABELS[pet.temperament] || pet.temperament}</Badge>
                <Badge variant="secondary" className="gap-1"><Zap className="h-3 w-3" />{ENERGY_LABELS[pet.energyLevel] || pet.energyLevel} energy</Badge>
              </div>
            </div>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <Link to={`/owner/pets/${pet.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1 bg-white/80"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-1 bg-white/80 text-destructive hover:bg-destructive hover:text-white" onClick={handleDelete} disabled={deletePet.isPending}>
              <Trash2 className="h-3.5 w-3.5" /> {deletePet.isPending ? "..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Age</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {pet.ageYears ?? 0} year{pet.ageYears !== 1 ? "s" : ""}, {pet.ageMonths ?? 0} month{pet.ageMonths !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {TYPE_LABELS[pet.type] || pet.customType || pet.type}
            </p>
          </div>
          {pet.breed && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Breed</p>
              <p className="mt-1 text-sm text-foreground">{pet.breed}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Added</p>
            <p className="mt-1 text-sm text-foreground">{new Date(pet.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
