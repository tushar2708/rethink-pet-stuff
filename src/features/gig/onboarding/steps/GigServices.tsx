import { StepWrapper } from "@/components/shared/StepWrapper";
import { ServiceDetailExpander } from "@/components/shared/ServiceDetailExpander";
import { useGigOnboardingStore } from "@/stores/gigOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { GIG_STEPS } from "@/features/gig/onboarding/config";

export function GigServices() {
  const { data, setStepData } = useGigOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: GIG_STEPS,
    basePath: "/gig/onboarding",
    storeData: data,
    setStepData,
  });

  const services = form.watch("services") || [];

  return (
    <StepWrapper
      title="What can you do?"
      description="Select the services you offer and set your rates"
      onNext={() => void next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <ServiceDetailExpander
        services={services as any}
        onChange={(nextServices) => form.setValue("services", nextServices as any, { shouldValidate: true })}
      />
      {form.formState.errors.services && (
        <p className="text-xs text-destructive">{form.formState.errors.services.message as string}</p>
      )}
    </StepWrapper>
  );
}
