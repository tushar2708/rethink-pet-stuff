import { Input } from "@/components/ui/input";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";

export function GigPersonalInfo() {
  const { data, setStepData } = useGigOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });

  return (
    <StepWrapper
      title="Hey there, pet lover!"
      description="This will only take about 3 minutes"
      onNext={() => void next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
          <Input id="firstName" placeholder="Alex" {...form.register("firstName")} />
          {form.formState.errors.firstName && <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
          {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label>
          <Input id="phone" type="tel" placeholder="1234567890" {...form.register("phone")} />
          {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
        </div>
      </div>
    </StepWrapper>
  );
}
