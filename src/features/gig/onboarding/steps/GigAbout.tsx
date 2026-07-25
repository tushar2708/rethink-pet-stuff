import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";

export function GigAbout() {
  const { data, setStepData } = useGigOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });

  const bio = form.watch("bio") || "";
  const hasPets = form.watch("hasPets") || false;

  return (
    <StepWrapper
      title="Tell pet owners about you"
      description="Share a little about yourself and your experience"
      onNext={() => void next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</label>
          <Textarea id="bio" maxLength={200} {...form.register("bio")} />
          <div className="flex justify-between">
            {form.formState.errors.bio ? (
              <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
            ) : <span />}
            <p className="text-xs text-muted-foreground">{bio.length}/200</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Do you have pets?</p>
            <p className="text-xs text-muted-foreground">This helps build trust with owners</p>
          </div>
          <Switch checked={hasPets} onCheckedChange={(checked) => form.setValue("hasPets", checked, { shouldValidate: true })} />
        </div>

        {hasPets && (
          <div className="space-y-2">
            <label htmlFor="petDetails" className="text-sm font-medium text-foreground">Tell us about them</label>
            <Textarea id="petDetails" {...form.register("petDetails")} />
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
