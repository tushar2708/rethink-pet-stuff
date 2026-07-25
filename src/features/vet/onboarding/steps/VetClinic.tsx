"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { VET_STEPS } from "@/features/vet/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { FileUpload } from "@/components/shared/FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

export function VetClinic() {
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
      title="Your Clinic"
      description="Tell us about your veterinary practice"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Clinic Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="clinicName" className="font-medium">
          Clinic Name
        </Label>
        <Input
          id="clinicName"
          placeholder="Sunshine Veterinary Clinic"
          {...form.register("clinicName")}
          aria-invalid={!!form.formState.errors.clinicName}
        />
        {form.formState.errors.clinicName && (
          <p className="text-xs text-destructive">
            {form.formState.errors.clinicName.message}
          </p>
        )}
      </div>

      {/* Street Address */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="street" className="font-medium">
          Street Address
        </Label>
        <Input
          id="street"
          placeholder="123 Pet Lane"
          {...form.register("street")}
          aria-invalid={!!form.formState.errors.street}
        />
        {form.formState.errors.street && (
          <p className="text-xs text-destructive">
            {form.formState.errors.street.message}
          </p>
        )}
      </div>

      {/* City and State Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="city" className="font-medium">
            City
          </Label>
          <Input
            id="city"
            placeholder="San Francisco"
            {...form.register("city")}
            aria-invalid={!!form.formState.errors.city}
          />
          {form.formState.errors.city && (
            <p className="text-xs text-destructive">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="state" className="font-medium">
            State
          </Label>
          <Input
            id="state"
            placeholder="CA"
            maxLength={2}
            {...form.register("state")}
            aria-invalid={!!form.formState.errors.state}
          />
          {form.formState.errors.state && (
            <p className="text-xs text-destructive">
              {form.formState.errors.state.message}
            </p>
          )}
        </div>
      </div>

      {/* ZIP Code */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="zip" className="font-medium">
          ZIP Code
        </Label>
        <Input
          id="zip"
          placeholder="94110"
          {...form.register("zip")}
          aria-invalid={!!form.formState.errors.zip}
        />
        {form.formState.errors.zip && (
          <p className="text-xs text-destructive">
            {form.formState.errors.zip.message}
          </p>
        )}
      </div>

      {/* Clinic Phone */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="clinicPhone" className="font-medium">
          Clinic Phone
        </Label>
        <Input
          id="clinicPhone"
          type="tel"
          placeholder="(555) 987-6543"
          {...form.register("clinicPhone")}
          aria-invalid={!!form.formState.errors.clinicPhone}
        />
        {form.formState.errors.clinicPhone && (
          <p className="text-xs text-destructive">
            {form.formState.errors.clinicPhone.message}
          </p>
        )}
      </div>

      {/* Website */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="website" className="font-medium">
          Website <span className="text-xs text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="website"
          type="url"
          placeholder="https://sunshinevetclinic.com"
          {...form.register("website")}
          aria-invalid={!!form.formState.errors.website}
        />
        {form.formState.errors.website && (
          <p className="text-xs text-destructive">
            {form.formState.errors.website.message}
          </p>
        )}
      </div>

      {/* Clinic Logo */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium">Clinic Logo</Label>
        <p className="text-xs text-muted-foreground">
          Upload your clinic's logo for your profile
        </p>
        <FileUpload
          value={form.watch("clinicLogoUrl")}
          onChange={(file) => {
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                form.setValue("clinicLogoUrl", reader.result as string, {
                  shouldValidate: true,
                });
              };
              reader.readAsDataURL(file);
            } else {
              form.setValue("clinicLogoUrl", "", { shouldValidate: true });
            }
          }}
          shape="square"
          placeholder="Upload clinic logo"
        />
      </div>
    </StepWrapper>
  );
}
