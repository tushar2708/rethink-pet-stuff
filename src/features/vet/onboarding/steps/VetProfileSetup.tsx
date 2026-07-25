"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { VET_STEPS } from "@/features/vet/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { FileUpload } from "@/components/shared/FileUpload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VET_SPECIALIZATIONS } from "@/lib/constants";
import { User, Star } from "lucide-react";
import * as React from "react";

export function VetProfileSetup() {
  const { data, setStepData } = useVetOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: VET_STEPS,
    basePath: "/vet/onboarding",
    storeData: data,
    setStepData,
  });

  const bio = form.watch("bio") || "";
  const profilePhoto = form.watch("profilePhotoUrl");
  const specializations = data.specializations || [];
  const clinicName = data.clinicName || "Your Clinic";
  const drPrefix = data.useDrPrefix ? "Dr. " : "";
  const vetName = `${drPrefix}${data.name || "Veterinarian"}`;

  const handleNext = React.useCallback(async () => {
    await next();
  }, [next]);

  const specLabels = VET_SPECIALIZATIONS.filter((spec) =>
    specializations.includes(spec.value)
  ).map((spec) => spec.label);

  return (
    <StepWrapper
      title="Almost There!"
      description="Complete your profile setup"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* Profile Photo */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium">Profile Photo</Label>
        <p className="text-xs text-muted-foreground">
          A professional photo helps pet owners feel more confident
        </p>
        <FileUpload
          value={profilePhoto}
          onChange={(file) => {
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                form.setValue("profilePhotoUrl", reader.result as string, {
                  shouldValidate: true,
                });
              };
              reader.readAsDataURL(file);
            } else {
              form.setValue("profilePhotoUrl", "", { shouldValidate: true });
            }
          }}
          shape="circle"
          placeholder="Upload your photo"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio" className="font-medium">
          Professional Bio
        </Label>
        <p className="text-xs text-muted-foreground">
          Tell pet owners what makes your practice special
        </p>
        <Textarea
          id="bio"
          placeholder="I'm passionate about compassionate care and have been practicing for over 10 years..."
          maxLength={300}
          {...form.register("bio")}
          className="resize-none"
          aria-invalid={!!form.formState.errors.bio}
        />
        <div className="flex items-center justify-between">
          {form.formState.errors.bio && (
            <p className="text-xs text-destructive">
              {form.formState.errors.bio.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground ml-auto">
            {bio.length}/300 characters
          </p>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-sm font-semibold mb-3 text-foreground">
          Preview Your Profile
        </h3>

        <div className="space-y-3">
          {/* Profile Section */}
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile preview"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-foreground leading-tight">
                {vetName}
              </h4>
              <p className="text-xs text-muted-foreground">{clinicName}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs text-muted-foreground">
                  (No reviews yet)
                </span>
              </div>
            </div>
          </div>

          {/* Specializations Badges */}
          {specLabels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {specLabels.slice(0, 3).map((label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
              {specLabels.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{specLabels.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Bio Preview */}
          {bio && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {bio}
            </p>
          )}
        </div>
      </div>
    </StepWrapper>
  );
}
