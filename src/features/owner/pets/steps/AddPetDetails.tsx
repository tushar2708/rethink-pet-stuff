import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/shared/FileUpload";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { useAddPetStore } from "@/stores/addPetStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { ADD_PET_STEPS } from "@/features/owner/pets/addPetConfig";
import type { AddPetData } from "@/stores/addPetStore";

export function AddPetDetails() {
  const { data, setStepData } = useAddPetStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm<AddPetData>({
    steps: ADD_PET_STEPS,
    basePath: "/owner/pets/add",
    storeData: data,
    setStepData,
  });
  return (
    <StepWrapper title="Pet Details" description="Tell us about your pet" onNext={() => void next()} onPrev={prev} isFirst={isFirst} isLast={isLast}>
      <div className="space-y-4">
        <Input placeholder="Pet name" {...form.register("petName")} />
        <div className="grid grid-cols-2 gap-3">
          <Input type="number" placeholder="Years" {...form.register("ageYears", { valueAsNumber: true })} />
          <Input type="number" placeholder="Months" {...form.register("ageMonths", { valueAsNumber: true })} />
        </div>
        <Input placeholder="Breed" {...form.register("breed")} />
        <FileUpload value={undefined} onChange={() => {}} accept="image/*" shape="circle" placeholder="Upload photo" />
      </div>
    </StepWrapper>
  );
}
