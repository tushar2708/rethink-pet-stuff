import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";

export function GigComplete() {
  const navigate = useNavigate();
  const { data, clearData } = useGigOnboardingStore();

  const handleFinish = () => {
    clearData();
    navigate("/gig/dashboard");
  };

  return (
    <>
      <ConfettiCelebration active={true} />
      <StepWrapper
        title="You're in!"
        description="Your profile is ready and you can start getting jobs"
        onNext={handleFinish}
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
          <Button className="w-full" onClick={handleFinish}>
            Start Getting Jobs
          </Button>
        </motion.div>
      </StepWrapper>
    </>
  );
}
