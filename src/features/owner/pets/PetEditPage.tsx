import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Dog, Cat, Bird, Rabbit, HelpCircle, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePet, useUpdatePet } from "@/hooks/usePets";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

const PET_ICONS: Record<string, LucideIcon> = { dog: Dog, cat: Cat, bird: Bird, hamster: Rabbit, other: HelpCircle };
const ENERGY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function PetEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { data: pet, isLoading } = usePet(params.petId || "");
  const updatePet = useUpdatePet();
  const form = useForm<any>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (pet) {
      form.reset(pet);
      setPhotoPreview(pet.photoUrl || null);
    }
  }, [pet, form]);

  const temperament = form.watch("temperament");
  const energyLevel = form.watch("energyLevel");

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        form.setValue("photoUrl", base64);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      form.setValue("photoUrl", null);
    }
  };

  const onSubmit = async (values: any) => {
    await updatePet.mutateAsync({ id: params.petId || "", data: values });
    navigate(`/owner/pets/${params.petId}`);
  };

  if (isLoading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!pet) return <div className="p-6 text-center text-muted-foreground">Pet not found</div>;

  const Icon = PET_ICONS[pet.type] || HelpCircle;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <button onClick={() => navigate(`/owner/pets/${params.petId}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to {pet.name}
      </button>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="overflow-hidden">
          {/* Photo section */}
          <div className="flex flex-col items-center bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-8">
            {photoPreview ? (
              <img src={photoPreview} alt={pet.name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-primary/10 shadow-md">
                <Icon className="h-14 w-14 text-primary" />
              </div>
            )}
            <div className="mt-4">
              <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0] || null)}
                />
              </Button>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-6 p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
              <Input {...form.register("name")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Breed</label>
                <Input placeholder="e.g., Golden Retriever" {...form.register("breed")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Type</label>
                <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/50 px-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{pet.type}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Age (years)</label>
                <Input type="number" min={0} {...form.register("ageYears", { valueAsNumber: true })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Age (months)</label>
                <Input type="number" min={0} max={11} {...form.register("ageMonths", { valueAsNumber: true })} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Temperament</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => form.setValue("temperament", "calm")}
                  className={cn("flex items-center gap-2 rounded-lg border-2 p-3 transition-all", temperament === "calm" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                  <Heart className="h-5 w-5 text-primary" /><span className="text-sm font-medium">Calm & Friendly</span>
                </button>
                <button type="button" onClick={() => form.setValue("temperament", "needs-warming-up")}
                  className={cn("flex items-center gap-2 rounded-lg border-2 p-3 transition-all", temperament === "needs-warming-up" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                  <Shield className="h-5 w-5 text-primary" /><span className="text-sm font-medium">Needs Warming Up</span>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Energy Level</label>
              <div className="grid grid-cols-3 gap-2">
                {ENERGY_OPTIONS.map((opt) => (
                  <Button key={opt.value} type="button" variant={energyLevel === opt.value ? "default" : "outline"}
                    onClick={() => form.setValue("energyLevel", opt.value)} className="w-full">
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={updatePet.isPending}>
                {updatePet.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/owner/pets/${params.petId}`)}>
                Cancel
              </Button>
            </div>

            {updatePet.error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{updatePet.error.message}</p>
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
