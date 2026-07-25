import { StepWrapper } from "@/components/shared/StepWrapper";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export function GigConsent() {
  const { data, setStepData } = useGigOnboardingStore();
  const { form, prev, isFirst } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const valid = await form.trigger(["backgroundCheckConsent", "termsAccepted"]);
    if (!valid) return;

    setStepData({ backgroundCheckConsent: form.getValues("backgroundCheckConsent"), termsAccepted: form.getValues("termsAccepted") } as any);
    const storeSnapshot = useGigOnboardingStore.getState().data;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await apiFetch<{ id: string }>("/gig/onboarding", {
        method: "POST",
        body: JSON.stringify({
          firstName: storeSnapshot.firstName || "",
          email: storeSnapshot.email || "",
          phone: storeSnapshot.phone || "",
          services: storeSnapshot.services || [],
          schedule: storeSnapshot.schedule || [],
          timePreferences: storeSnapshot.timePreferences || [],
          coverageZip: storeSnapshot.coverageZip || "",
          coverageRadiusMiles: Number(storeSnapshot.coverageRadiusMiles) || 5,
          bio: storeSnapshot.bio || "",
          hasPets: storeSnapshot.hasPets ?? false,
          petDetails: storeSnapshot.petDetails,
          backgroundCheckConsent: true,
          photoUrl: storeSnapshot.photoUrl,
        }),
      });
      if ((result as any)?.id) {
        useAuthStore.getState().setGigProfileId((result as any).id);
      }
      navigate("/gig/onboarding/complete");
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepWrapper
      title="One last thing"
      description="We need your consent before you start getting jobs"
      onNext={handleSubmit}
      onPrev={prev}
      isFirst={isFirst}
      isLast={true}
      nextLabel={submitting ? "Saving..." : "Submit"}
      nextDisabled={submitting}
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
      {submitError && (
        <div className="rounded-lg bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}
    </StepWrapper>
  );
}
