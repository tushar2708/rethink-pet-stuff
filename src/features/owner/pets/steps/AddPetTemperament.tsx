import { Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/shared/ImageCard";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { useAddPetStore } from "@/stores/addPetStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { ADD_PET_STEPS } from "@/features/owner/pets/addPetConfig";
import { ENERGY_LEVELS } from "@/lib/constants";
import type { AddPetData } from "@/stores/addPetStore";

export function AddPetTemperament() {
  const { data, setStepData } = useAddPetStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm<AddPetData>({
    steps: ADD_PET_STEPS,
    basePath: "/owner/pets/add",
    storeData: data,
    setStepData,
  });
  const temperament = form.watch("temperament");
  const energyLevel = form.watch("energyLevel");
  return (
    <StepWrapper title="Temperament" description="How is your pet with new people?" onNext={() => void next()} onPrev={prev} isFirst={isFirst} isLast={isLast}>
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <ImageCard icon={<Heart className="h-8 w-8" />} label="Calm & Friendly" description="Gets along well with everyone" selected={temperament === "calm"} onSelect={() => form.setValue("temperament", "calm" as any)} mode="single" />
          <ImageCard icon={<Shield className="h-8 w-8" />} label="Needs Warming Up" description="Takes time with new people" selected={temperament === "needs-warming-up"} onSelect={() => form.setValue("temperament", "needs-warming-up" as any)} mode="single" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ENERGY_LEVELS.map((level) => (
            <Button key={level.value} variant={energyLevel === level.value ? "default" : "outline"} onClick={() => form.setValue("energyLevel", level.value as any)}>
              {level.label}
            </Button>
          ))}
        </div>
      </div>
    </StepWrapper>
  );
}
