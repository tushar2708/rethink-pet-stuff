# Advanced Patterns & Edge Cases

This document covers advanced patterns, common gotchas, and edge cases when using the stores and hooks.

---

## Multi-Step Form Patterns

### Pattern 1: Conditional Steps

Some flows may have optional steps based on earlier answers (e.g., "Are you using a clinic?" → if yes, show clinic details step).

```typescript
// components/owner/onboarding/useConditionalSteps.ts
import { useOwnerOnboardingStore } from "@/stores";
import { useMemo } from "react";
import { allSteps } from "./steps";

export function useConditionalSteps() {
  const { data } = useOwnerOnboardingStore();

  const steps = useMemo(() => {
    // If they selected "other" pet type, skip the breed details step
    if (data.petType === "other") {
      return allSteps.filter((step) => step.id !== "breed-details");
    }
    return allSteps;
  }, [data.petType]);

  return steps;
}
```

Then in your component:

```typescript
function OwnerOnboarding() {
  const { data, setStepData } = useOwnerOnboardingStore();
  const steps = useConditionalSteps();

  const { currentStep, form, next, prev, progress } = useMultiStepForm({
    steps, // Filtered steps
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
    defaultValues,
  });

  // Rest of the component...
}
```

---

### Pattern 2: Progressive Validation (Async)

Validate fields asynchronously (e.g., check if email is already registered).

```typescript
// components/shared/schemas.ts
import { z } from "zod";

const validateEmailUnique = async (email: string) => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const { isAvailable } = await response.json();
  return isAvailable;
};

export const aboutYouSchema = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .refine(validateEmailUnique, "Email is already registered"),
  phone: z.string().min(10),
});
```

This integrates seamlessly with React Hook Form's `trigger()` method in `useMultiStepForm.next()`.

---

### Pattern 3: Dependent Field Validation

Validate one field based on another field's value.

```typescript
export const petDetailsSchema = z
  .object({
    petName: z.string().min(1),
    ageYears: z.number().optional(),
    ageMonths: z.number().optional(),
    breed: z.string(),
  })
  .refine(
    (data) => {
      // At least one age value is provided
      return data.ageYears !== undefined || data.ageMonths !== undefined;
    },
    {
      message: "Please provide at least years or months",
      path: ["ageYears"], // Focus error on this field
    }
  );
```

---

### Pattern 4: Custom Step Rendering

Different UI patterns for different step types (tabs, accordion, full-page, etc.).

```typescript
interface StepConfigExtended extends StepConfig {
  layout: "fullpage" | "tabs" | "accordion";
  icon?: React.ReactNode;
  subtitle?: string;
}

const steps: StepConfigExtended[] = [
  {
    id: "about-you",
    path: "about-you",
    schema: aboutYouSchema,
    fields: ["name", "email", "phone"],
    layout: "fullpage",
    icon: <UserIcon />,
    subtitle: "Tell us about yourself",
  },
  // ...
];

function StepRenderer({ step, form }: Props) {
  if (step.layout === "fullpage") {
    return <FullPageStep />;
  } else if (step.layout === "tabs") {
    return <TabsStep />;
  } else if (step.layout === "accordion") {
    return <AccordionStep />;
  }
}
```

---

### Pattern 5: Saving Progress in Real-Time

Auto-save form data to backend while user is filling it out (not just on completion).

```typescript
import { useEffect } from "react";
import { useMultiStepForm } from "@/hooks";
import { useDebounce } from "@/hooks"; // You'd create this

function OwnerOnboarding() {
  const { data, setStepData } = useOwnerOnboardingStore();
  const { form, currentStep } = useMultiStepForm({ /* ... */ });

  const debouncedData = useDebounce(form.watch(), 1000);

  useEffect(() => {
    // Auto-save to backend
    if (debouncedData && currentStep) {
      fetch("/api/owner/save-progress", {
        method: "POST",
        body: JSON.stringify({
          step: currentStep.id,
          data: debouncedData,
        }),
      });
    }
  }, [debouncedData, currentStep]);

  // Rest of component...
}
```

---

## Common Gotchas & Solutions

### Gotcha 1: Field Name Mismatch

**Problem:** Form field name doesn't match Zod schema property.

```typescript
// ❌ WRONG: Field is named "firstName" but schema expects "name"
<input {...form.register("firstName")} />

const schema = z.object({
  name: z.string(), // Mismatch!
});
```

**Solution:** Match field names exactly.

```typescript
// ✅ CORRECT
<input {...form.register("name")} />

const schema = z.object({
  name: z.string(),
});
```

---

### Gotcha 2: Not Including All Fields in `defaultValues`

**Problem:** Missing fields in `defaultValues` cause TypeScript errors and runtime issues.

```typescript
// ❌ WRONG: Missing "customType"
const defaultValues = {
  name: "",
  email: "",
  phone: "",
  petType: "",
  // customType is missing!
};
```

**Solution:** Include all fields, even if optional.

```typescript
// ✅ CORRECT
const defaultValues = {
  name: "",
  email: "",
  phone: "",
  petType: "",
  customType: "",
};
```

---

### Gotcha 3: Validating All Fields Instead of Current Step

**Problem:** Global schema validates all fields, even ones not yet filled.

```typescript
// ❌ WRONG: Single schema with all fields
const globalSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  petType: z.string().min(1),
  petName: z.string().min(1),
  breed: z.string().min(1),
  temperament: z.string().min(1),
  energyLevel: z.string().min(1),
});

// When on step 1, trying to go to step 2 validates ALL fields
```

**Solution:** One schema per step.

```typescript
// ✅ CORRECT: Per-step schemas
const step1Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
});

const step2Schema = z.object({
  petType: z.string().min(1),
});

// Only validates the current step's schema
```

---

### Gotcha 4: Not Clearing Data on Completion

**Problem:** User completes onboarding, but localStorage still has their data. If they start another pet onboarding, it's pre-filled.

```typescript
// ❌ WRONG: Forgot to clear
const handleComplete = async () => {
  const response = await fetch("/api/owner/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
  // Forgot to clear localStorage!
  navigate("/owner/dashboard");
};
```

**Solution:** Clear data after successful submission.

```typescript
// ✅ CORRECT
const handleComplete = async () => {
  const response = await fetch("/api/owner/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    clearData(); // Clear localStorage
    navigate("/owner/dashboard");
  }
};
```

---

### Gotcha 5: URL Doesn't Match Step Path

**Problem:** Browser URL is `/owner/onboarding/about-you` but step's path is `about-you`. The hook can't find the step.

```typescript
// ❌ WRONG: Path doesn't match URL segment
const steps: StepConfig[] = [
  {
    id: "about-you",
    path: "aboutYou", // Camel case - won't match "about-you" in URL
    schema,
    fields,
  },
];
```

**Solution:** Keep URL segments and step paths consistent.

```typescript
// ✅ CORRECT
const steps: StepConfig[] = [
  {
    id: "about-you",
    path: "about-you", // Matches URL: /owner/onboarding/about-you
    schema,
    fields,
  },
];
```

---

### Gotcha 6: Forgetting to Handle Loading State

**Problem:** `next()` is async (validates + saves), but component doesn't show loading feedback.

```typescript
// ❌ WRONG: No loading feedback
<button type="submit">Next</button>
```

**Solution:** Show loading state during validation.

```typescript
// ✅ CORRECT
const [isLoading, setIsLoading] = useState(false);

const handleNext = async () => {
  setIsLoading(true);
  try {
    const success = await next();
    if (!success) {
      // Show error toast
    }
  } finally {
    setIsLoading(false);
  }
};

<button type="submit" disabled={isLoading}>
  {isLoading ? "Loading..." : "Next"}
</button>
```

---

### Gotcha 7: Not Resetting Form on Conditional Step Skip

**Problem:** User answers "yes" to a question, fills out step 2, then changes answer to "no". Step 2 data is still in localStorage but shouldn't be submitted.

```typescript
// ❌ WRONG: Data lingers even when step is skipped
const steps = data.hasClinic
  ? allSteps
  : allSteps.filter((s) => s.id !== "clinic-details");

// If user changes hasClinic to false, "clinic-details" data is still in store
```

**Solution:** Clear relevant data when conditions change.

```typescript
// ✅ CORRECT
useEffect(() => {
  if (!data.hasClinic) {
    // Clear clinic-related fields
    setStepData({
      clinicName: "",
      clinicPhone: "",
      clinicAddress: "",
    });
  }
}, [data.hasClinic]);
```

---

## Performance Optimizations

### Memoize Steps Array

```typescript
import { useMemo } from "react";

function OnboardingPage() {
  const steps = useMemo(
    () => [
      { id: "step1", path: "step1", schema, fields },
      { id: "step2", path: "step2", schema, fields },
    ],
    [] // Empty deps - steps never change
  );

  const { form, next } = useMultiStepForm({
    steps,
    // ...
  });

  // Prevents unnecessary re-renders
}
```

---

### Debounce Auto-Save

```typescript
import { useCallback } from "react";

function useAutoSave(data: unknown, delay = 1000) {
  const save = useCallback(() => {
    fetch("/api/save", { method: "POST", body: JSON.stringify(data) });
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(save, delay);
    return () => clearTimeout(timer);
  }, [save, delay]);
}
```

---

### Lazy-Load Step Components

```typescript
import { lazy, Suspense } from "react";

const AboutYouStep = lazy(() =>
  import("./steps/AboutYouStep").then((m) => ({ default: m.AboutYouStep }))
);
const PetTypeStep = lazy(() =>
  import("./steps/PetTypeStep").then((m) => ({ default: m.PetTypeStep }))
);

function StepRenderer({ step }: Props) {
  return (
    <Suspense fallback={<div>Loading step...</div>}>
      {step.id === "about-you" && <AboutYouStep />}
      {step.id === "pet-type" && <PetTypeStep />}
    </Suspense>
  );
}
```

---

## Testing Patterns

### Test Data Persistence

```typescript
import { renderHook, act } from "@testing-library/react";
import { useOwnerOnboardingStore } from "@/stores";

it("should persist data to localStorage", () => {
  const { result } = renderHook(() => useOwnerOnboardingStore());

  act(() => {
    result.current.setStepData({ name: "John", email: "john@example.com" });
  });

  // Check localStorage
  const stored = JSON.parse(localStorage.getItem("petstuff-owner-onboarding"));
  expect(stored.state.data.name).toBe("John");
});
```

---

### Test Form Navigation

```typescript
import { renderHook, act } from "@testing-library/react";
import { useMultiStepForm } from "@/hooks";

it("should navigate to next step on valid submission", async () => {
  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
  }));

  const { result } = renderHook(() =>
    useMultiStepForm({ steps, basePath, storeData, setStepData })
  );

  act(() => {
    result.current.form.setValue("name", "John");
    result.current.form.setValue("email", "john@example.com");
    result.current.form.setValue("phone", "5551234567");
  });

  await act(async () => {
    await result.current.next();
  });

  expect(mockNavigate).toHaveBeenCalledWith("/owner/onboarding/pet-type");
});
```

---

## Type Safety Patterns

### Typed Step Data

```typescript
type OwnerOnboardingStepData = Partial<OwnerOnboardingData>;

function useOwnerSteps(): StepConfig<OwnerOnboardingStepData>[] {
  return [
    {
      id: "about-you",
      path: "about-you",
      schema: z.object({ name: z.string(), email: z.string() }),
      fields: ["name", "email"] as const,
    },
  ];
}
```

---

### Typed Step Renderer

```typescript
interface StepRendererProps<T extends Record<string, unknown>> {
  step: StepConfig;
  data: Partial<T>;
  form: UseFormReturn<T>;
}

function StepRenderer<T extends Record<string, unknown>>({
  step,
  data,
  form,
}: StepRendererProps<T>) {
  // TypeScript knows the shape of data and form
}
```

---

## Summary

✅ Use per-step schemas, not global schemas  
✅ Always include all fields in defaultValues  
✅ Match URL paths with step.path exactly  
✅ Clear data after successful submission  
✅ Handle async `next()` with loading state  
✅ Clear data when conditional steps are skipped  
✅ Memoize steps array to prevent re-renders  
✅ Lazy-load step components for performance  
✅ Test persistence and navigation thoroughly  
✅ Use TypeScript for type-safe data flow  

These patterns will help you build robust, maintainable multi-step forms!
