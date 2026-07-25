import { Heart, Shield } from "lucide-react"
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { ImageCard } from "@/components/shared/ImageCard"
import { Button } from "@/components/ui/button"
import { ENERGY_LEVELS } from "@/lib/constants"
import type { OwnerOnboardingData } from "@/stores/ownerOnboardingStore"

export function OwnerTemperament() {
  const { data, setStepData } = useOwnerOnboardingStore()
  const { form, next, prev, isFirst, isLast } = useMultiStepForm<OwnerOnboardingData>({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  })

  const petName = form.watch("petName")
  const temperament = form.watch("temperament")
  const energyLevel = form.watch("energyLevel")

  const handleNext = async () => {
    const success = await next()
    if (!success) {
      return
    }
  }

  return (
    <StepWrapper
      title={`How is ${petName || "Your Pet"} with New People?`}
      description="Select the temperament and energy level"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Temperament Selection */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Calm & Friendly */}
          <ImageCard
            icon={<Heart className="h-8 w-8" />}
            label="Calm & Friendly"
            description="Gets along well with everyone"
            selected={temperament === "calm"}
            onSelect={() => form.setValue("temperament", "calm")}
            mode="single"
          />

          {/* Needs Warming Up */}
          <ImageCard
            icon={<Shield className="h-8 w-8" />}
            label="Needs Warming Up"
            description="Takes time with new people"
            selected={temperament === "needs-warming-up"}
            onSelect={() => form.setValue("temperament", "needs-warming-up")}
            mode="single"
          />
        </div>

        {form.formState.errors.temperament && (
          <p className="text-xs text-destructive">
            {form.formState.errors.temperament.message}
          </p>
        )}
      </div>

      {/* Energy Level Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">Energy Level</label>
        <div className="grid grid-cols-3 gap-2">
          {ENERGY_LEVELS.map((level) => {
            const isSelected = energyLevel === level.value

            return (
              <Button
                key={level.value}
                variant={isSelected ? "default" : "outline"}
                onClick={() => form.setValue("energyLevel", level.value)}
                className="w-full"
                aria-pressed={isSelected}
              >
                {level.label}
              </Button>
            )
          })}
        </div>

        {form.formState.errors.energyLevel && (
          <p className="text-xs text-destructive">
            {form.formState.errors.energyLevel.message}
          </p>
        )}
      </div>
    </StepWrapper>
  )
}
