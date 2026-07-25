"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { VET_STEPS } from "@/features/vet/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { WeeklyScheduleBuilder } from "@/components/shared/WeeklyScheduleBuilder";
import * as React from "react";
import type { DaySchedule } from "@/types/common";

export function VetAvailability() {
  const { data, setStepData } = useVetOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: VET_STEPS,
    basePath: "/vet/onboarding",
    storeData: data,
    setStepData,
  });

  const schedule = form.watch("schedule") || [];
  const consultationDuration = form.watch("consultationDuration");

  const handleScheduleChange = (newSchedule: DaySchedule[]) => {
    form.setValue("schedule", newSchedule, { shouldValidate: true });
  };

  const handleDurationChange = (duration: number) => {
    form.setValue("consultationDuration", duration, { shouldValidate: true });
  };

  const handleNext = React.useCallback(async () => {
    await next();
  }, [next]);

  return (
    <StepWrapper
      title="Set Your Availability"
      description="Let patients know when you're available for consultations"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <WeeklyScheduleBuilder
        value={schedule}
        onChange={handleScheduleChange}
        consultationDuration={consultationDuration}
        onDurationChange={handleDurationChange}
      />

      {/* Error Message */}
      {form.formState.errors.schedule && (
        <div className="rounded-lg bg-destructive/10 p-3">
          <p className="text-xs text-destructive">
            {form.formState.errors.schedule.message}
          </p>
        </div>
      )}

      {form.formState.errors.consultationDuration && (
        <div className="rounded-lg bg-destructive/10 p-3">
          <p className="text-xs text-destructive">
            {form.formState.errors.consultationDuration.message}
          </p>
        </div>
      )}
    </StepWrapper>
  );
}
