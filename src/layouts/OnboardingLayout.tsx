import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface OnboardingLayoutProps {
  portal: "owner" | "vet" | "gig";
  steps: Array<{ id: string; label: string }>;
}

export function OnboardingLayout({ portal, steps }: OnboardingLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current step index from URL path
  const currentStepIndex = steps.findIndex((step) => {
    const pathSegment = location.pathname.split("/").pop();
    return step.id === pathSegment;
  });

  const isFirstStep = currentStepIndex <= 0;
  const progress = currentStepIndex >= 0 ? (currentStepIndex + 1) / steps.length : 0;

  const handleBack = () => {
    if (currentStepIndex > 0 && currentStepIndex < steps.length) {
      const prevStep = steps[currentStepIndex - 1];
      if (prevStep) {
        navigate(`/${portal}/onboarding/${prevStep.id}`);
      }
    }
  };

  return (
    <div
      data-portal={portal}
      className="min-h-screen flex-col bg-background py-8 px-4 sm:flex sm:items-center sm:justify-center"
    >
      {/* Header with Back Button */}
      <div className="mb-8 w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          {!isFirstStep && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {currentStepIndex >= 0 && currentStepIndex < steps.length && steps[currentStepIndex] && (
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
              <h1 className="text-2xl font-bold text-foreground">{steps[currentStepIndex]!.label}</h1>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              portal === "owner" && "bg-[#F59E0B]",
              portal === "vet" && "bg-[#3B82F6]",
              portal === "gig" && "bg-[#F97316]"
            )}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Content Area with Animation */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
