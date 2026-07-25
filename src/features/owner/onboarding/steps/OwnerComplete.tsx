import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration"
import { Button } from "@/components/ui/button"

export function OwnerComplete() {
  const navigate = useNavigate()
  const { data, clearData } = useOwnerOnboardingStore()

  const petPhoto = data.petPhoto as string | undefined
  const PET_TYPE_LABELS: Record<string, string> = {
    dog: "🐕 Dog",
    cat: "🐈 Cat",
    bird: "🦜 Bird",
    hamster: "🐹 Hamster",
  }

  return (
    <>
      <ConfettiCelebration active={true} />

      <div className="flex flex-col items-center gap-8 mx-auto w-full max-w-lg px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">You're All Set!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your profile has been saved</p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-5xl"
        >
          🎉
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
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
                <p className="text-sm font-semibold text-foreground">{data.petName}</p>
                <p className="text-xs text-muted-foreground">
                  {PET_TYPE_LABELS[data.petType as string] || data.customType}
                </p>
                <p className="text-xs text-muted-foreground">
                  Age: {data.ageYears ?? 0} years, {data.ageMonths ?? 0} months
                </p>
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

        <div className="flex w-full flex-col gap-3">
          <Button size="lg" onClick={() => { clearData(); navigate("/owner/dashboard") }} className="w-full">
            Go to Dashboard
          </Button>
          <Button variant="outline" size="lg" onClick={() => { clearData(); navigate("/owner/onboarding/pet-type") }} className="w-full">
            Add Another Pet
          </Button>
        </div>
      </div>
    </>
  )
}
