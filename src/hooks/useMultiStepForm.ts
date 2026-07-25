import { useLocation, useNavigate } from "react-router-dom";
import {
  useForm,
  type UseFormReturn,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodSchema } from "zod";
import { useCallback, useEffect, useMemo } from "react";

export interface StepConfig {
  id: string;
  path: string;
  schema: ZodSchema;
  fields: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseMultiStepFormConfig<T extends Record<string, any>> {
  steps: StepConfig[];
  basePath: string;
  storeData: Partial<T>;
  setStepData: (data: Partial<T>) => void;
  defaultValues?: DefaultValues<T>;
}

export interface UseMultiStepFormReturn<T extends Record<string, any>> {
  currentStepIndex: number;
  currentStep: StepConfig | undefined;
  form: UseFormReturn<T>;
  next: () => Promise<boolean>;
  prev: () => void;
  goToStep: (stepId: string) => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  canGoNext: boolean;
}

export function useMultiStepForm<T extends Record<string, any>>({
  steps,
  basePath,
  storeData,
  setStepData,
  defaultValues,
}: UseMultiStepFormConfig<T>): UseMultiStepFormReturn<T> {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepIndex = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const index = steps.findIndex((step) => step.path === lastSegment);
    return index !== -1 ? index : 0;
  }, [location.pathname, steps]);

  const currentStep = steps[currentStepIndex];

  const form = useForm<T>({
    resolver: currentStep ? zodResolver(currentStep.schema) : undefined,
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      ...storeData,
    } as unknown as T);
  }, [currentStepIndex, storeData, defaultValues, form]);

  const saveCurrentStepFields = useCallback(() => {
    if (!currentStep) return;
    const allValues = form.getValues();
    const stepValues: Record<string, unknown> = {};
    for (const field of currentStep.fields) {
      const val = allValues[field as keyof typeof allValues];
      if (val !== undefined) {
        stepValues[field] = val;
      }
    }
    setStepData(stepValues as Partial<T>);
  }, [currentStep, form, setStepData]);

  const next = useCallback(async (): Promise<boolean> => {
    if (!currentStep) {
      return false;
    }

    const isValid = await form.trigger(currentStep.fields as never);

    if (!isValid) {
      return false;
    }

    saveCurrentStepFields();

    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        navigate(`${basePath}/${nextStep.path}`);
      }
    }

    return true;
  }, [
    currentStep,
    currentStepIndex,
    steps,
    form,
    saveCurrentStepFields,
    navigate,
    basePath,
  ]);

  const prev = useCallback(() => {
    saveCurrentStepFields();

    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      if (prevStep) {
        navigate(`${basePath}/${prevStep.path}`);
      }
    }
  }, [currentStepIndex, steps, saveCurrentStepFields, navigate, basePath]);

  const goToStep = useCallback(
    (stepId: string) => {
      const foundStep = steps.find((step) => step.id === stepId);
      if (foundStep) {
        saveCurrentStepFields();
        navigate(`${basePath}/${foundStep.path}`);
      }
    },
    [steps, saveCurrentStepFields, navigate, basePath]
  );

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const progress = (currentStepIndex + 1) / steps.length;
  const canGoNext = !isLast;

  return {
    currentStepIndex,
    currentStep,
    form,
    next,
    prev,
    goToStep,
    isFirst,
    isLast,
    progress,
    canGoNext,
  };
}
