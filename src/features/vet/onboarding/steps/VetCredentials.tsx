"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { VET_STEPS } from "@/features/vet/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { FileUpload } from "@/components/shared/FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback } from "react";
import { fileToBase64 } from "@/lib/photo";

const ISSUING_AUTHORITIES = [
  "State Veterinary Board",
  "AVMA",
  "Provincial College",
  "Federal Authority",
  "Other",
];

const DEGREES = [
  { value: "DVM", label: "DVM (Doctor of Veterinary Medicine)" },
  { value: "VMD", label: "VMD (Veterinariae Medicinae Doctoris)" },
  { value: "BVSc", label: "BVSc (Bachelor of Veterinary Science)" },
  { value: "other", label: "Other" },
];

export function VetCredentials() {
  const { data, setStepData } = useVetOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: VET_STEPS,
    basePath: "/vet/onboarding",
    storeData: data,
    setStepData,
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNext = useCallback(async () => {
    await next();
  }, [next]);

  return (
    <StepWrapper
      title="Your Credentials"
      description="Help us verify your professional qualifications"
      onNext={handleNext}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      {/* License Number */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="licenseNumber" className="font-medium">
          Veterinary License Number
        </Label>
        <Input
          id="licenseNumber"
          placeholder="VET-12345678"
          {...form.register("licenseNumber")}
          aria-invalid={!!form.formState.errors.licenseNumber}
        />
        {form.formState.errors.licenseNumber && (
          <p className="text-xs text-destructive">
            {form.formState.errors.licenseNumber.message}
          </p>
        )}
      </div>

      {/* Issuing Authority */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="issuingAuthority" className="font-medium">
          Issuing Authority
        </Label>
        <Select
          value={form.watch("issuingAuthority") || ""}
          onValueChange={(value) =>
            form.setValue("issuingAuthority", value, { shouldValidate: true })
          }
        >
          <SelectTrigger id="issuingAuthority">
            <SelectValue placeholder="Select authority" />
          </SelectTrigger>
          <SelectContent>
            {ISSUING_AUTHORITIES.map((authority) => (
              <SelectItem key={authority} value={authority}>
                {authority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.issuingAuthority && (
          <p className="text-xs text-destructive">
            {form.formState.errors.issuingAuthority.message}
          </p>
        )}
      </div>

      {/* Years of Practice */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="yearsOfPractice" className="font-medium">
          Years of Practice
        </Label>
        <Input
          id="yearsOfPractice"
          type="number"
          min="0"
          placeholder="10"
          {...form.register("yearsOfPractice", {
            valueAsNumber: true,
          })}
          aria-invalid={!!form.formState.errors.yearsOfPractice}
        />
        {form.formState.errors.yearsOfPractice && (
          <p className="text-xs text-destructive">
            {form.formState.errors.yearsOfPractice.message}
          </p>
        )}
      </div>

      {/* Degree */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="degree" className="font-medium">
          Degree
        </Label>
        <Select
          value={form.watch("degree") || ""}
          onValueChange={(value) =>
            form.setValue("degree", value, { shouldValidate: true })
          }
        >
          <SelectTrigger id="degree">
            <SelectValue placeholder="Select degree" />
          </SelectTrigger>
          <SelectContent>
            {DEGREES.map((degree) => (
              <SelectItem key={degree.value} value={degree.value}>
                {degree.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.degree && (
          <p className="text-xs text-destructive">
            {form.formState.errors.degree.message}
          </p>
        )}
      </div>

      {/* License Document Upload */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium">License Document</Label>
        <p className="text-xs text-muted-foreground">
          Upload a copy of your license (PDF or image)
        </p>
        <FileUpload
          value={form.watch("licenseDocUrl")}
          onChange={async (file) => {
            setUploadError(null);
            if (file) {
              try {
                const base64 = await fileToBase64(file);
                form.setValue("licenseDocUrl", base64, { shouldValidate: true });
                setStepData({ licenseDocUrl: base64 } as any);
              } catch (err: any) {
                form.setValue("licenseDocUrl", undefined as any, { shouldValidate: true });
                setUploadError(err?.message || "Failed to process file");
              }
            } else {
              form.setValue("licenseDocUrl", undefined as any, { shouldValidate: true });
              setStepData({ licenseDocUrl: undefined } as any);
            }
          }}
          accept="image/*,application/pdf"
          shape="square"
          placeholder="Upload license document"
        />
        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}
      </div>

      {/* Helper Text */}
      <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
        <p className="text-xs text-blue-800">
          We verify credentials to build trust with pet owners
        </p>
      </div>
    </StepWrapper>
  );
}
