import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePet, useUpdatePet } from "@/hooks/usePets";
import { useNavigate, useParams } from "react-router-dom";

export function PetEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { data: pet } = usePet(params.petId || "");
  const updatePet = useUpdatePet();
  const form = useForm<any>();

  useEffect(() => {
    if (pet) form.reset(pet);
  }, [pet, form]);

  const onSubmit = async (values: any) => {
    await updatePet.mutateAsync({ id: params.petId || "", data: values });
    navigate(`/owner/pets/${params.petId}`);
  };

  if (!pet) return <div className="p-6">Loading...</div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Pet</h1>
      <Input placeholder="Pet name" {...form.register("name")} />
      <Input placeholder="Type" {...form.register("type")} />
      <Input placeholder="Breed" {...form.register("breed")} />
      <Input type="number" placeholder="Age years" {...form.register("ageYears", { valueAsNumber: true })} />
      <Input type="number" placeholder="Age months" {...form.register("ageMonths", { valueAsNumber: true })} />
      <Input placeholder="Temperament" {...form.register("temperament")} />
      <Input placeholder="Energy level" {...form.register("energyLevel")} />
      <Button type="submit">Save</Button>
    </form>
  );
}
