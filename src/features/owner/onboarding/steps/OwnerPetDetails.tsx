import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { FileUpload } from "@/components/shared/FileUpload"
import { Input } from "@/components/ui/input"
import type { OwnerOnboardingData } from "@/stores/ownerOnboardingStore"

export function OwnerPetDetails() {
  const { data, setStepData } = useOwnerOnboardingStore()
  const { form, next, prev, isFirst, isLast } = useMultiStepForm<OwnerOnboardingData>({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  })

  const handleNext = async () => {
    const success = await next()
    if (!success) {
      return
    }
  }

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      // Store the file in form state
      form.setValue("petPhoto", file as any)
    }
  }

  return (
    <StepWrapper
      title="Tell Us About Your Pet"
      description="Help us know your furry friend better"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Pet Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Pet Name</label>
        <Input
          placeholder="e.g., Max, Bella"
          {...form.register("petName")}
          aria-invalid={!!form.formState.errors.petName}
        />
        {form.formState.errors.petName && (
          <p className="text-xs text-destructive">{form.formState.errors.petName.message}</p>
        )}
      </div>

      {/* Age */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Age</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Years</span>
            <Input
              type="number"
              min="0"
              max="30"
              placeholder="0"
              {...form.register("ageYears", {
                valueAsNumber: true,
              })}
              aria-invalid={!!form.formState.errors.ageYears}
            />
            {form.formState.errors.ageYears && (
              <p className="text-xs text-destructive">
                {form.formState.errors.ageYears.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Months</span>
            <Input
              type="number"
              min="0"
              max="11"
              placeholder="0"
              {...form.register("ageMonths", {
                valueAsNumber: true,
              })}
              aria-invalid={!!form.formState.errors.ageMonths}
            />
            {form.formState.errors.ageMonths && (
              <p className="text-xs text-destructive">
                {form.formState.errors.ageMonths.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Breed */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Breed</label>
        <Input
          placeholder="e.g., Golden Retriever"
          {...form.register("breed")}
          aria-invalid={!!form.formState.errors.breed}
        />
        {form.formState.errors.breed && (
          <p className="text-xs text-destructive">{form.formState.errors.breed.message}</p>
        )}
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Pet Photo</label>
        <FileUpload
          value={data.petPhoto as any}
          onChange={handlePhotoChange}
          accept="image/*"
          maxSizeMB={5}
          shape="circle"
          placeholder="Upload photo"
        />
      </div>
    </StepWrapper>
  )
}
