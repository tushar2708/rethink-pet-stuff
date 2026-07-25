import { motion } from "framer-motion"
import {
  Dog,
  Cat,
  Bird,
  Rabbit,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { ImageCard } from "@/components/shared/ImageCard"
import { Input } from "@/components/ui/input"
import { PET_TYPES } from "@/lib/constants"
import type { OwnerOnboardingData } from "@/stores/ownerOnboardingStore"

const iconMap: Record<string, LucideIcon> = {
  Dog,
  Cat,
  Bird,
  Rabbit,
  HelpCircle,
}

export function OwnerPetType() {
  const { data, setStepData } = useOwnerOnboardingStore()
  const { form, next, prev, isFirst, isLast } = useMultiStepForm<OwnerOnboardingData>({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  })

  const petType = form.watch("petType")

  const handleNext = async () => {
    const success = await next()
    if (!success) {
      return
    }
  }

  const iconVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  return (
    <StepWrapper
      title="What Kind of Pet Do You Have?"
      description="Select your pet type"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Pet Type Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {PET_TYPES.map((type, index) => {
          const Icon = iconMap[type.icon]
          const isSelected = petType === type.value

          return (
            <motion.div
              key={type.value}
              custom={index}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
            >
              <ImageCard
                icon={Icon ? <Icon className="h-8 w-8" /> : undefined}
                label={type.label}
                selected={isSelected}
                onSelect={() => form.setValue("petType", type.value)}
                mode="single"
              />
            </motion.div>
          )
        })}
      </div>

      {/* Custom Type Input (shown when "other" is selected) */}
      {petType === "other" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2"
        >
          <label className="text-sm font-medium text-foreground">
            What type of pet do you have?
          </label>
          <Input
            placeholder="e.g., Guinea Pig, Lizard, Snake"
            {...form.register("customType")}
            aria-invalid={!!form.formState.errors.customType}
          />
          {form.formState.errors.customType && (
            <p className="text-xs text-destructive">
              {form.formState.errors.customType.message}
            </p>
          )}
        </motion.div>
      )}
    </StepWrapper>
  )
}
