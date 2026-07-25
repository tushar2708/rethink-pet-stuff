import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { useAddPetStore } from "@/stores/addPetStore";
import { useCreatePet } from "@/hooks/usePets";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { ADD_PET_STEPS } from "@/features/owner/pets/addPetConfig";
import type { AddPetData } from "@/stores/addPetStore";

export function AddPetComplete() {
  const navigate = useNavigate();
  const { data, setStepData, clearData } = useAddPetStore();
  const createPet = useCreatePet();
  const { prev, isFirst, isLast } = useMultiStepForm<AddPetData>({
    steps: ADD_PET_STEPS,
    basePath: "/owner/pets/add",
    storeData: data,
    setStepData,
  });

  const handleAddPet = async () => {
    await createPet.mutateAsync({
      name: data.petName,
      type: data.petType,
      customType: data.customType,
      breed: data.breed,
      ageYears: data.dateOfBirth
        ? Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : data.ageYears,
      ageMonths: data.dateOfBirth
        ? Math.floor(((Date.now() - new Date(data.dateOfBirth).getTime()) / (30.44 * 24 * 60 * 60 * 1000)) % 12)
        : data.ageMonths,
      temperament: data.temperament,
      energyLevel: data.energyLevel,
      photoUrl: data.petPhoto,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      weightKg: data.weightKg,
      lifestyle: data.lifestyle,
      isNeutered: data.isNeutered,
    } as any);
    clearData();
    navigate("/owner/dashboard");
  };

  return (
    <StepWrapper title="Pet ready to add" description="Review and save your pet" onPrev={prev} isFirst={isFirst} isLast={isLast} showNav={false}>
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <p className="font-semibold text-foreground">{data.petName}</p>
        <p className="text-sm text-muted-foreground">{data.petType}</p>
        <Button className="w-full" onClick={handleAddPet} disabled={createPet.isPending}>{createPet.isPending ? "Saving..." : "Add Pet"}</Button>
      </div>
    </StepWrapper>
  );
}
