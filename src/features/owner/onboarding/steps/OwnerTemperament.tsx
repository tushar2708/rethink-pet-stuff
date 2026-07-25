import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Shield } from "lucide-react"
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { ImageCard } from "@/components/shared/ImageCard"
import { Button } from "@/components/ui/button"
import { ENERGY_LEVELS } from "@/lib/constants"
import { apiFetch } from "@/lib/api"
import type { OwnerOnboardingData } from "@/stores/ownerOnboardingStore"

export function OwnerTemperament() {
  const navigate = useNavigate()
  const { data, setStepData } = useOwnerOnboardingStore()
  const { form, prev, isFirst } = useMultiStepForm<OwnerOnboardingData>({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const petName = form.watch("petName")
  const temperament = form.watch("temperament")
  const energyLevel = form.watch("energyLevel")

  const handleSubmit = async () => {
    const valid = await form.trigger(["temperament", "energyLevel"])
    if (!valid) return

    setStepData(form.getValues())
    const allData = { ...data, ...form.getValues() }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await apiFetch("/owner/onboarding", {
        method: "POST",
        body: JSON.stringify({
          petName: allData.petName || "",
          petType: allData.petType || "dog",
          customType: allData.customType,
          breed: allData.breed,
          ageYears: allData.ageYears ? Number(allData.ageYears) : undefined,
          ageMonths: allData.ageMonths ? Number(allData.ageMonths) : undefined,
          temperament: allData.temperament || "calm",
          energyLevel: allData.energyLevel || "low",
          petPhoto: typeof allData.petPhoto === "string" ? allData.petPhoto : undefined,
        }),
      })
      navigate("/owner/onboarding/complete")
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StepWrapper
      title={`How is ${petName || "Your Pet"} with New People?`}
      description="Select the temperament and energy level"
      onNext={handleSubmit}
      onPrev={prev}
      isFirst={isFirst}
      isLast={true}
      nextLabel={submitting ? "Saving..." : "Submit"}
      nextDisabled={submitting}
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

      {submitError && (
        <div className="rounded-lg bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}
    </StepWrapper>
  )
}
