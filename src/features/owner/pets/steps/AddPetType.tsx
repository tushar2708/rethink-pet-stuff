import { motion } from "framer-motion";
import { Dog, Cat, Bird, Rabbit, HelpCircle, type LucideIcon } from "lucide-react";
import { ImageCard } from "@/components/shared/ImageCard";
import { Input } from "@/components/ui/input";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { useAddPetStore } from "@/stores/addPetStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { ADD_PET_STEPS } from "@/features/owner/pets/addPetConfig";
import { PET_TYPES } from "@/lib/constants";
import type { AddPetData } from "@/stores/addPetStore";

const iconMap: Record<string, LucideIcon> = { Dog, Cat, Bird, Rabbit, HelpCircle };

export function AddPetType() {
  const { data, setStepData } = useAddPetStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm<AddPetData>({
    steps: ADD_PET_STEPS,
    basePath: "/owner/pets/add",
    storeData: data,
    setStepData,
  });
  const petType = form.watch("petType");
  return (
    <StepWrapper title="What Kind of Pet?" description="Select your pet type" onNext={() => void next()} onPrev={prev} isFirst={isFirst} isLast={isLast}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {PET_TYPES.map((type, index) => {
          const Icon = iconMap[type.icon];
          return (
            <motion.div key={type.value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <ImageCard icon={Icon ? <Icon className="h-8 w-8" /> : undefined} label={type.label} selected={petType === type.value} onSelect={() => form.setValue("petType", type.value as any)} mode="single" />
            </motion.div>
          );
        })}
      </div>
      {petType === "other" && <Input placeholder="Custom type" {...form.register("customType")} />}
    </StepWrapper>
  );
}
