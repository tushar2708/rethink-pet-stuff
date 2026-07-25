import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { OWNER_STEPS } from "@/features/owner/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { Home, TreePine } from "lucide-react";
import { cn } from "@/lib/cn";

export function OwnerLifestyle() {
  const { data, setStepData } = useOwnerOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  });

  const lifestyle = form.watch("lifestyle");

  return (
    <StepWrapper
      title="Lifestyle?"
      description="This changes which vaccines stay lifelong."
      onNext={() => next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        <button
          onClick={() => form.setValue("lifestyle", "indoor")}
          className={cn(
            "w-full rounded-xl border-2 p-6 text-left transition-all",
            lifestyle === "indoor"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Indoor only</p>
              <p className="text-sm text-muted-foreground">
                Never goes outside unsupervised
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => form.setValue("lifestyle", "outdoor")}
          className={cn(
            "w-full rounded-xl border-2 p-6 text-left transition-all",
            lifestyle === "outdoor"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex items-center gap-3">
            <TreePine className="h-6 w-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Goes outdoors</p>
              <p className="text-sm text-muted-foreground">
                Roams or spends time outside
              </p>
            </div>
          </div>
        </button>
      </div>
    </StepWrapper>
  );
}
