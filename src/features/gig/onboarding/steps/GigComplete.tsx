import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";

export function GigComplete() {
  const navigate = useNavigate();
  const { data, clearData, setStepData } = useGigOnboardingStore();
  const { prev, isFirst, isLast } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        firstName: data.firstName || "",
        email: data.email || "",
        phone: data.phone || "",
        services: data.services || [],
        schedule: data.schedule || [],
        timePreferences: data.timePreferences || [],
        coverageZip: data.coverageZip || "",
        coverageRadiusMiles: Number(data.coverageRadiusMiles) || 5,
        bio: data.bio || "",
        hasPets: data.hasPets ?? false,
        petDetails: data.petDetails,
        backgroundCheckConsent: true,
        photoUrl: data.photoUrl,
      };
      return apiFetch<{ id: string }>("/gig/onboarding", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (result: any) => {
      if (result?.id) {
        useAuthStore.getState().setGigProfileId(result.id);
      }
    },
  });

  const handleFinish = async () => {
    try {
      await submitMutation.mutateAsync();
      clearData();
      navigate("/gig/dashboard");
    } catch {
      // shown below
    }
  };

  return (
    <>
      <ConfettiCelebration active={true} />
      <StepWrapper
        title="You're in!"
        description="Your profile is ready and you can start getting jobs"
        onNext={handleFinish}
        onPrev={prev}
        isFirst={isFirst}
        isLast={isLast}
        nextLabel="Start Getting Jobs"
        showNav={false}
      >
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4"
        >
          <div className="rounded-lg border bg-card p-6">
            <p className="text-lg font-semibold text-foreground">{data.firstName}</p>
            <p className="text-sm text-muted-foreground">{(data.services || []).length} service(s) selected</p>
            <p className="mt-2 text-sm text-muted-foreground">Coverage ZIP: {data.coverageZip}</p>
          </div>
          {submitMutation.error && (
            <div className="rounded-lg bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{submitMutation.error.message}</p>
            </div>
          )}
          <Button className="w-full" onClick={handleFinish} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? "Saving..." : "Start Getting Jobs"}
          </Button>
        </motion.div>
      </StepWrapper>
    </>
  );
}
