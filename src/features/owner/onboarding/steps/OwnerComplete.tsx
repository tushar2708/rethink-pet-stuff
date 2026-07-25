import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useMutation } from "@tanstack/react-query"
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import type { OwnerOnboardingData } from "@/stores/ownerOnboardingStore"

export function OwnerComplete() {
  const navigate = useNavigate()
  const { data, setStepData, clearData } = useOwnerOnboardingStore()
  useMultiStepForm<OwnerOnboardingData>({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  })

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: data.name || "",
        phone: data.phone || "",
        petName: data.petName || "",
        petType: data.petType || "dog",
        customType: data.customType,
        breed: data.breed,
        ageYears: data.ageYears ? Number(data.ageYears) : undefined,
        ageMonths: data.ageMonths ? Number(data.ageMonths) : undefined,
        temperament: data.temperament || "calm",
        energyLevel: data.energyLevel || "low",
        petPhoto: typeof data.petPhoto === "string" ? data.petPhoto : undefined,
      }
      return apiFetch("/owner/onboarding", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },
  })

  const petPhoto = data.petPhoto as string | undefined
  const PET_TYPE_LABELS: Record<string, string> = {
    dog: "🐕 Dog",
    cat: "🐈 Cat",
    bird: "🦜 Bird",
    hamster: "🐹 Hamster",
  }

  const handleGoToDashboard = async () => {
    try {
      await submitMutation.mutateAsync()
      clearData()
      navigate("/owner/dashboard")
    } catch {
      // Error shown via submitMutation.error
    }
  }

  const handleAddAnotherPet = async () => {
    try {
      await submitMutation.mutateAsync()
      clearData()
      navigate("/owner/onboarding/pet-type")
    } catch {
      // Error shown via submitMutation.error
    }
  }

  return (
    <>
      <ConfettiCelebration active={true} />

      <StepWrapper
        title="You're All Set!"
        description="Your onboarding is complete"
        showNav={false}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mb-4 text-5xl"
        >
          🎉
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full rounded-lg border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-4">
            <div className="border-b border-border pb-4">
              <p className="text-xs text-muted-foreground mb-2">Owner</p>
              <p className="text-lg font-semibold text-foreground">{data.name}</p>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">Your Pet</p>

              {petPhoto && (
                <div className="flex justify-center">
                  <img
                    src={petPhoto}
                    alt={data.petName}
                    className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{data.petName}</p>
                  <p className="text-xs text-muted-foreground">
                    {PET_TYPE_LABELS[data.petType as string] || data.customType}
                  </p>
                </div>

                {(data.ageYears !== undefined || data.ageMonths !== undefined) && (
                  <p className="text-xs text-muted-foreground">
                    Age: {data.ageYears ?? 0} years, {data.ageMonths ?? 0} months
                  </p>
                )}

                {data.breed && (
                  <p className="text-xs text-muted-foreground">Breed: {data.breed}</p>
                )}

                {data.temperament && (
                  <p className="text-xs text-muted-foreground">
                    Temperament: {data.temperament === "calm" ? "Calm & Friendly" : "Needs Warming Up"}
                  </p>
                )}

                {data.energyLevel && (
                  <p className="text-xs text-muted-foreground">
                    Energy: {data.energyLevel.charAt(0).toUpperCase() + data.energyLevel.slice(1)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {submitMutation.error && (
          <div className="mt-4 w-full rounded-lg bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{submitMutation.error.message}</p>
          </div>
        )}

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex w-full flex-col gap-3 mt-8"
        >
          <Button
            variant="default"
            size="lg"
            onClick={handleGoToDashboard}
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Saving..." : "Go to Dashboard"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleAddAnotherPet}
            className="w-full"
            disabled={submitMutation.isPending}
          >
            Add Another Pet
          </Button>
        </motion.div>
      </StepWrapper>
    </>
  )
}
