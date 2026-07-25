import { StepWrapper } from "@/components/shared/StepWrapper";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";

export function GigConsent() {
  const { data, setStepData } = useGigOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });

  return (
    <StepWrapper
      title="One last thing"
      description="We need your consent before you start getting jobs"
      onNext={() => void next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        <label className="flex items-start gap-3 rounded-lg border p-4">
          <input
            type="checkbox"
            checked={!!form.watch("backgroundCheckConsent")}
            onChange={(e) => form.setValue("backgroundCheckConsent", e.target.checked, { shouldValidate: true })}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <div>
            <p className="text-sm font-medium text-foreground">Background check consent</p>
            <p className="text-xs text-muted-foreground">Required to receive customer bookings</p>
            {form.formState.errors.backgroundCheckConsent && <p className="mt-1 text-xs text-destructive">{form.formState.errors.backgroundCheckConsent.message as string}</p>}
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-lg border p-4">
          <input
            type="checkbox"
            checked={!!form.watch("termsAccepted")}
            onChange={(e) => form.setValue("termsAccepted", e.target.checked, { shouldValidate: true })}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <div>
            <p className="text-sm font-medium text-foreground">Terms and conditions</p>
            <p className="text-xs text-muted-foreground">You must accept the platform terms to continue</p>
            {form.formState.errors.termsAccepted && <p className="mt-1 text-xs text-destructive">{form.formState.errors.termsAccepted.message as string}</p>}
          </div>
        </label>
      </div>
    </StepWrapper>
  );
}
