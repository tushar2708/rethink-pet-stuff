import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { OWNER_STEPS } from "@/features/owner/onboarding/config"
import { StepWrapper } from "@/components/shared/StepWrapper"
import { Input } from "@/components/ui/input"
import type { OwnerOnboardingData } from "@/stores/ownerOnboardingStore"

export function OwnerAboutYou() {
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

  return (
    <StepWrapper
      title="About You"
      description="Let's get to know you"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Full Name</label>
        <Input
          placeholder="John Doe"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Email Address</label>
        <Input
          type="email"
          placeholder="john@example.com"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Phone Number</label>
        <Input
          type="tel"
          placeholder="+1 (555) 123-4567"
          {...form.register("phone")}
          aria-invalid={!!form.formState.errors.phone}
        />
        {form.formState.errors.phone && (
          <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
        )}
      </div>
    </StepWrapper>
  )
}
