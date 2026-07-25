"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { VET_STEPS } from "@/features/vet/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { ImageCard } from "@/components/shared/ImageCard";
import { VET_SPECIALIZATIONS } from "@/lib/constants";
import * as React from "react";
import {
  Stethoscope, Scissors, Droplets, Sparkles, AlertCircle,
  Bird, AlertTriangle, Brain, Apple, Heart, Eye, Bone,
  type LucideIcon,
} from "lucide-react";

export function VetSpecializations() {
  const { data, setStepData } = useVetOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: VET_STEPS,
    basePath: "/vet/onboarding",
    storeData: data,
    setStepData,
  });

  const selectedSpecializations = form.watch("specializations") || [];

  const handleSpecializationChange = (value: string) => {
    const current = selectedSpecializations;
    if (current.includes(value)) {
      form.setValue(
        "specializations",
        current.filter((s) => s !== value),
        { shouldValidate: true }
      );
    } else {
      form.setValue("specializations", [...current, value], {
        shouldValidate: true,
      });
    }
  };

  const handleNext = React.useCallback(async () => {
    await next();
  }, [next]);

  const ICON_MAP: Record<string, LucideIcon> = {
    Stethoscope, Scissors, Droplets, Sparkles, AlertCircle,
    Bird, AlertTriangle, Brain, Apple, Heart, Eye, Bone,
  };

  const getIconComponent = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    if (!Icon) return null;
    return <Icon className="h-8 w-8" />;
  };

  return (
    <StepWrapper
      title="Choose Your Specializations"
      description="Select all areas of expertise that apply to you"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Specializations Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {VET_SPECIALIZATIONS.map((spec) => (
          <ImageCard
            key={spec.value}
            icon={getIconComponent(spec.icon)}
            label={spec.label}
            selected={selectedSpecializations.includes(spec.value)}
            onSelect={() => handleSpecializationChange(spec.value)}
            mode="multi"
          />
        ))}
      </div>

      {/* Error Message */}
      {form.formState.errors.specializations && (
        <div className="rounded-lg bg-destructive/10 p-3">
          <p className="text-xs text-destructive">
            {form.formState.errors.specializations.message}
          </p>
        </div>
      )}

      {/* Selection Count */}
      {selectedSpecializations.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedSpecializations.length} specialization
          {selectedSpecializations.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </StepWrapper>
  );
}
