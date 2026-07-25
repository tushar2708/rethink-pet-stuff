import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePet, useDeletePet } from "@/hooks/usePets";

export function PetDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { data: pet } = usePet(params.petId || "");
  const deletePet = useDeletePet();

  if (!pet) return <div className="p-6">Loading...</div>;

  const handleDelete = async () => {
    if (!window.confirm("Delete this pet?")) return;
    await deletePet.mutateAsync(pet.id);
    navigate("/owner/dashboard");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{pet.name}</h1>
          <p className="text-sm text-muted-foreground">{pet.breed || pet.type}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/owner/pets/${pet.id}/edit`}><Button variant="outline">Edit</Button></Link>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
      {pet.photoUrl && <img src={pet.photoUrl} alt={pet.name} className="h-40 w-40 rounded-full object-cover" />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><p className="text-sm font-medium">Type</p><p className="text-sm text-muted-foreground">{pet.type}</p></div>
        <div><p className="text-sm font-medium">Breed</p><p className="text-sm text-muted-foreground">{pet.breed || "—"}</p></div>
        <div><p className="text-sm font-medium">Age</p><p className="text-sm text-muted-foreground">{pet.ageYears ?? 0} years, {pet.ageMonths ?? 0} months</p></div>
        <div><p className="text-sm font-medium">Temperament</p><Badge variant="secondary">{pet.temperament}</Badge></div>
        <div><p className="text-sm font-medium">Energy</p><p className="text-sm text-muted-foreground">{pet.energyLevel}</p></div>
      </div>
    </div>
  );
}
