import { useState, useEffect } from "react";
import { useOwnerOnboardingStore } from "@/stores/ownerOnboardingStore";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { OWNER_STEPS } from "@/features/owner/onboarding/config";
import { StepWrapper } from "@/components/shared/StepWrapper";
import { Switch } from "@/components/ui/switch";
import { apiFetch } from "@/lib/api";

interface HealthTemplate {
  id: string;
  name: string;
  lifeStage?: string;
}

export function OwnerVaccination() {
  const { data, setStepData } = useOwnerOnboardingStore();
  const { form, next, prev, isFirst, isLast } = useMultiStepForm({
    steps: OWNER_STEPS,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
  });

  const [templates, setTemplates] = useState<HealthTemplate[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isNeutered, setIsNeutered] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const result = await apiFetch<HealthTemplate[]>(
          `/health-templates?petType=${data.petType || "dog"}&lifestyle=${
            data.lifestyle || ""
          }&gender=${data.gender || ""}`
        );

        const filtered = (result || []).filter(
          (template) =>
            template.lifeStage !== "lifetime_watch" &&
            template.lifeStage !== "on_repeat"
        );

        setTemplates(filtered);
      } catch (error) {
        console.error("Failed to fetch health templates:", error);
      }
    };

    fetchTemplates();
  }, [data.petType, data.lifestyle, data.gender]);

  useEffect(() => {
    const completed = form.watch("completedVaccinations") || [];
    setCompletedIds(Array.isArray(completed) ? completed : []);
  }, [form]);

  useEffect(() => {
    const neutered = form.watch("isNeutered") || false;
    setIsNeutered(neutered);
  }, [form]);

  const handleVaccinationChange = (
    templateId: string,
    checked: boolean
  ) => {
    const newIds = checked
      ? [...completedIds, templateId]
      : completedIds.filter((id) => id !== templateId);

    setCompletedIds(newIds);
    form.setValue("completedVaccinations", newIds);
  };

  const handleNeuteredChange = (checked: boolean) => {
    setIsNeutered(checked);
    form.setValue("isNeutered", checked);
  };

  return (
    <StepWrapper
      title="Anything done already?"
      description="Optional. We'll mark these as done."
      onNext={() => next()}
      onPrev={prev}
      isFirst={isFirst}
      isLast={isLast}
    >
      <div className="space-y-4">
        {templates.length > 0 && (
          <div className="space-y-2 max-h-72 overflow-y-auto border rounded-lg">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border-b last:border-b-0 py-3 px-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium">{template.name}</span>
                <Switch
                  checked={completedIds.includes(template.id)}
                  onCheckedChange={(checked) =>
                    handleVaccinationChange(template.id, checked)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Neutered Toggle */}
        <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
          <span className="text-sm font-medium">Neutered/Spayed</span>
          <Switch checked={isNeutered} onCheckedChange={handleNeuteredChange} />
        </div>

        {templates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No vaccinations found for your pet.</p>
            <p className="text-xs">Just tap continue to proceed.</p>
          </div>
        )}

        {templates.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            None yet? Just tap continue.
          </p>
        )}
      </div>
    </StepWrapper>
  );
}
