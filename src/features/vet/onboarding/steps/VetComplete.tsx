"use client";

import { useVetOnboardingStore } from "@/stores/vetOnboardingStore";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function VetComplete() {
  const navigate = useNavigate();
  const { data, clearData } = useVetOnboardingStore();

  const drPrefix = data.useDrPrefix ? "Dr. " : "";
  const vetName = `${drPrefix}${data.name || "Veterinarian"}`;
  const specializations = data.specializations || [];

  const handleGoToDashboard = () => {
    clearData();
    navigate("/vet/dashboard");
  };

  const scheduleEnabled = data.schedule?.filter((s) => s.enabled) || [];
  const scheduleSummary =
    scheduleEnabled.length > 0
      ? `${scheduleEnabled.length} day${scheduleEnabled.length !== 1 ? "s" : ""} per week`
      : "Availability pending";

  return (
    <>
      <ConfettiCelebration active={true} />

      <StepWrapper
        title="Your Profile is Live!"
        description="Congratulations, you're ready to start serving patients"
        onNext={handleGoToDashboard}
        showNav={false}
        className="flex flex-col gap-8"
      >
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-500"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.5,
              }}
            >
              <CheckCircle2 className="h-20 w-20 text-green-500 fill-green-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-foreground">{vetName}</h3>
            <p className="text-sm text-muted-foreground">{data.clinicName}</p>
          </div>

          {specializations.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Specializations
              </p>
              <div className="flex flex-wrap gap-2">
                {specializations.slice(0, 4).map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {spec}
                  </Badge>
                ))}
                {specializations.length > 4 && (
                  <Badge variant="secondary">
                    +{specializations.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Schedule</p>
            <p className="text-sm text-muted-foreground">{scheduleSummary}</p>
            {data.consultationDuration && (
              <p className="text-sm text-muted-foreground">
                {data.consultationDuration} minute consultations
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            size="lg"
            onClick={handleGoToDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You can edit your profile anytime in your dashboard settings
          </p>
        </motion.div>
      </StepWrapper>
    </>
  );
}
