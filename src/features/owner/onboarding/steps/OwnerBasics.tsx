import { useState } from "react";
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { OWNER_STEPS } from "@/features/owner/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/FileUpload";
import { fileToBase64 } from "@/lib/photo";
import { cn } from "@/lib/cn";

export function OwnerBasics() {
  const { data, setStepData } = useOwnerOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  });

  const [, setPhotoLoading] = useState(false);

  const selectedGender = form.watch("gender");

  const calculateDateOfBirth = (weeks: number) => {
    const date = new Date();
    date.setDate(date.getDate() - weeks * 7);
    return date.toISOString().split("T")[0];
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setPhotoLoading(true);
      const base64 = await fileToBase64(file);
      setStepData({ petPhoto: base64 });
    } catch (error) {
      console.error("Failed to upload photo:", error);
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <StepWrapper
      title="Let's get the basics"
      description="Help us understand your pet better."
      onNext={() => next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-6">
        {/* Pet Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pet Name</label>
          <Input
            placeholder="e.g., Simba"
            {...form.register("petName")}
            className="w-full"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => form.setValue("gender", "male")}
              className={cn(
                "flex-1",
                selectedGender === "male"
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              Male
            </Button>
            <Button
              type="button"
              onClick={() => form.setValue("gender", "female")}
              className={cn(
                "flex-1",
                selectedGender === "female"
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              Female
            </Button>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <Input
            type="date"
            {...form.register("dateOfBirth")}
            className="w-full"
          />
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                form.setValue("dateOfBirth", calculateDateOfBirth(10))
              }
              className="text-xs"
            >
              10 weeks old
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const date = new Date();
                date.setMonth(date.getMonth() - 6);
                form.setValue("dateOfBirth", date.toISOString().split("T")[0]);
              }}
              className="text-xs"
            >
              6 months old
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const date = new Date();
                date.setFullYear(date.getFullYear() - 2);
                form.setValue("dateOfBirth", date.toISOString().split("T")[0]);
              }}
              className="text-xs"
            >
              2 years old
            </Button>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Weight (kg)</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 4.2"
              {...form.register("weightKg")}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pet Photo (Optional)</label>
          <FileUpload
            value={data.petPhoto as string | undefined}
            onChange={(file) => {
              if (file) void handlePhotoUpload(file);
            }}
            maxSizeMB={1}
            accept="image/*"
            shape="circle"
            placeholder="Upload photo"
          />
        </div>
      </div>
    </StepWrapper>
  );
}
