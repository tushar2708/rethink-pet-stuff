import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration"
import { Button } from "@/components/ui/button"
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

  const petPhoto = data.petPhoto as string | undefined
  const PET_TYPE_LABELS: Record<string, string> = {
    dog: "🐕 Dog",
    cat: "🐈 Cat",
    bird: "🦜 Bird",
    hamster: "🐹 Hamster",
  }

  const handleGoToDashboard = () => {
    clearData()
    navigate("/owner/dashboard")
  }

  const handleAddAnotherPet = () => {
    // Clear only pet-related data, keep owner info
    const ownerData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    }
    clearData()
    setStepData(ownerData)
    navigate("/owner/onboarding/pet-type")
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
        {/* Celebration Icon */}
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

        {/* Summary Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full rounded-lg border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-4">
            {/* Owner Info */}
            <div className="border-b border-border pb-4">
              <p className="text-xs text-muted-foreground mb-2">Owner</p>
              <p className="text-lg font-semibold text-foreground">{data.name}</p>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>

            {/* Pet Info */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">Your Pet</p>

              {/* Pet Photo (if available) */}
              {petPhoto && (
                <div className="flex justify-center">
                  <img
                    src={petPhoto}
                    alt={data.petName}
                    className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                  />
                </div>
              )}

              {/* Pet Details */}
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

        {/* Action Buttons */}
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
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleAddAnotherPet}
            className="w-full"
          >
            Add Another Pet
          </Button>
        </motion.div>
      </StepWrapper>
    </>
  )
}
