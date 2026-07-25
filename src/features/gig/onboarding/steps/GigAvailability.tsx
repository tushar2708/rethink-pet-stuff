import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { WeeklyScheduleBuilder } from "@/components/shared/WeeklyScheduleBuilder";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";

const TIME_PREFS = ["morning", "afternoon", "evening", "flexible"] as const;

export function GigAvailability() {
  const { data, setStepData } = useGigOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });

  const schedule = (form.watch("schedule") as any[]) || [];
  const timePreferences = (form.watch("timePreferences") as string[]) || [];

  const toggleTimePref = (value: string) => {
    const nextPrefs = timePreferences.includes(value)
      ? timePreferences.filter((p) => p !== value)
      : [...timePreferences, value];
    form.setValue("timePreferences", nextPrefs as any, { shouldValidate: true });
  };

  return (
    <StepWrapper
      title="When and where?"
      description="Set your availability and coverage area"
      onNext={() => void next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Schedule</p>
          <WeeklyScheduleBuilder
            value={schedule as any}
            onChange={(nextSchedule) => {
              form.setValue("schedule", nextSchedule as any, { shouldValidate: true });
            }}
          />
          {form.formState.errors.schedule && (
            <p className="text-xs text-destructive">{form.formState.errors.schedule.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Time Preferences</p>
          <div className="flex flex-wrap gap-2">
            {TIME_PREFS.map((pref) => (
              <Button
                key={pref}
                type="button"
                variant={timePreferences.includes(pref) ? "default" : "outline"}
                onClick={() => toggleTimePref(pref)}
              >
                {pref.charAt(0).toUpperCase() + pref.slice(1)}
              </Button>
            ))}
          </div>
          {form.formState.errors.timePreferences && (
            <p className="text-xs text-destructive">{form.formState.errors.timePreferences.message as string}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="coverageZip" className="text-sm font-medium text-foreground">Coverage ZIP</label>
            <Input id="coverageZip" placeholder="94110" {...form.register("coverageZip")} />
            {form.formState.errors.coverageZip && <p className="text-xs text-destructive">{form.formState.errors.coverageZip.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="coverageRadiusMiles" className="text-sm font-medium text-foreground">Radius (miles)</label>
            <Input id="coverageRadiusMiles" type="number" placeholder="5" {...form.register("coverageRadiusMiles", { valueAsNumber: true })} />
            {form.formState.errors.coverageRadiusMiles && <p className="text-xs text-destructive">{form.formState.errors.coverageRadiusMiles.message}</p>}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
