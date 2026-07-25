"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { VET_STEPS } from "@/features/vet/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";
import * as React from "react";

export function VetPersonalInfo() {
  const { data, setStepData } = useVetOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: VET_STEPS,
    basePath: "/vet/onboarding",
    storeData: data,
    setStepData,
  });

  const handleNext = React.useCallback(async () => {
    await next();
  }, [next]);

  return (
    <StepWrapper
      title="Welcome, Doctor"
      description="Let's start with your basic information"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Dr. Prefix Toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="use-dr-prefix"
          checked={form.watch("useDrPrefix") ?? false}
          onCheckedChange={(checked) =>
            form.setValue("useDrPrefix", checked, { shouldValidate: true })
          }
        />
        <Label htmlFor="use-dr-prefix" className="font-medium cursor-pointer">
          Use "Dr." prefix in your name
        </Label>
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="John Smith"
          {...form.register("name")}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@vetclinic.com"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone" className="font-medium">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          {...form.register("phone")}
          aria-invalid={!!form.formState.errors.phone}
        />
        {form.formState.errors.phone && (
          <p className="text-xs text-destructive">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      {/* Trust Badge */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3 border border-blue-200">
        <Lock className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Your information is encrypted and secure
        </p>
      </div>
    </StepWrapper>
  );
}
