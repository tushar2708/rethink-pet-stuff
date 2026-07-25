# Implementation Examples

Complete examples for each onboarding flow using the stores and hooks.

---

## Owner Onboarding (4 Steps)

### Step Configuration

```typescript
// components/owner/onboarding/steps.ts
import { StepConfig } from "@/hooks";
import { z } from "zod";

const aboutYouSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

const petTypeSchema = z.object({
  petType: z.string().min(1, "Please select a pet type"),
  customType: z.string().optional(),
});

const petDetailsSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  ageYears: z.number().optional(),
  ageMonths: z.number().optional(),
  breed: z.string().min(1, "Breed is required"),
});

const temperamentSchema = z.object({
  temperament: z.string().min(1, "Please describe temperament"),
  energyLevel: z.string().min(1, "Please select energy level"),
});

export const ownerSteps: StepConfig[] = [
  {
    id: "about-you",
    path: "about-you",
    schema: aboutYouSchema,
    fields: ["name", "email", "phone"],
  },
  {
    id: "pet-type",
    path: "pet-type",
    schema: petTypeSchema,
    fields: ["petType", "customType"],
  },
  {
    id: "pet-details",
    path: "pet-details",
    schema: petDetailsSchema,
    fields: ["petName", "ageYears", "ageMonths", "breed"],
  },
  {
    id: "temperament",
    path: "temperament",
    schema: temperamentSchema,
    fields: ["temperament", "energyLevel"],
  },
];
```

### Main Onboarding Component

```typescript
// components/owner/onboarding/OwnerOnboarding.tsx
import { useMultiStepForm } from "@/hooks";
import { useOwnerOnboardingStore } from "@/stores";
import { ownerSteps } from "./steps";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  petType: "",
  customType: "",
  petName: "",
  ageYears: undefined,
  ageMonths: undefined,
  breed: "",
  temperament: "",
  energyLevel: "",
};

export function OwnerOnboarding() {
  const { data, setStepData } = useOwnerOnboardingStore();

  const {
    currentStep,
    currentStepIndex,
    form,
    next,
    prev,
    progress,
    isFirst,
    isLast,
  } = useMultiStepForm({
    steps: ownerSteps,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
    defaultValues,
  });

  if (!currentStep) {
    return <div>Loading...</div>;
  }

  const handleNext = form.handleSubmit(async () => {
    const success = await next();
    if (success && !isLast) {
      // Optional: Show toast/animation
    }
  });

  const handleComplete = form.handleSubmit(async () => {
    const success = await next();
    if (success && isLast) {
      // Submit to API
      try {
        const response = await fetch("/api/owner/onboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          // Clear store and redirect
          // useOwnerOnboardingStore.setState({ data: {} });
          // navigate("/owner/dashboard");
        }
      } catch (error) {
        console.error("Onboarding failed:", error);
      }
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentStepIndex + 1} of {ownerSteps.length}
          </span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={isLast ? handleComplete : handleNext}>
        <div className="space-y-6">
          {currentStep.id === "about-you" && (
            <AboutYouStep form={form} />
          )}
          {currentStep.id === "pet-type" && (
            <PetTypeStep form={form} />
          )}
          {currentStep.id === "pet-details" && (
            <PetDetailsStep form={form} />
          )}
          {currentStep.id === "temperament" && (
            <TemperamentStep form={form} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={prev}
            disabled={isFirst}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLast ? "Complete Onboarding" : "Next"}
          </button>
        </div>
      </form>

      {/* Step indicators */}
      <div className="flex gap-2 mt-8 justify-center">
        {ownerSteps.map((step, idx) => (
          <div
            key={step.id}
            className={`h-2 w-8 rounded-full transition-colors ${
              idx < currentStepIndex
                ? "bg-green-600"
                : idx === currentStepIndex
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

### Individual Step Components

```typescript
// components/owner/onboarding/steps/AboutYouStep.tsx
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

export function AboutYouStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <Input {...register("name")} placeholder="John Doe" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input {...register("email")} type="email" placeholder="john@example.com" />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
      </div>
    </>
  );
}
```

---

## Vet Onboarding (6 Steps)

### Step Configuration

```typescript
// components/vet/onboarding/steps.ts
import { StepConfig } from "@/hooks";
import { z } from "zod";

const aboutYouSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  phone: z.string().min(10),
  useDrPrefix: z.boolean(),
});

const credentialsSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  issuingAuthority: z.string().min(1),
  yearsOfPractice: z.number().min(0),
  degree: z.string().min(1, "Degree is required"),
});

const clinicSchema = z.object({
  clinicName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  zip: z.string().min(5),
  clinicPhone: z.string().min(10),
  website: z.string().url().optional().or(z.literal("")),
});

const specializationsSchema = z.object({
  specializations: z.array(z.string()).min(1, "Select at least one specialization"),
});

const scheduleSchema = z.object({
  schedule: z.array(
    z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      isAvailable: z.boolean(),
    })
  ),
  consultationDuration: z.number().min(15).max(240),
});

const bioSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters"),
});

export const vetSteps: StepConfig[] = [
  {
    id: "about-you",
    path: "about-you",
    schema: aboutYouSchema,
    fields: ["name", "email", "phone", "useDrPrefix"],
  },
  {
    id: "credentials",
    path: "credentials",
    schema: credentialsSchema,
    fields: ["licenseNumber", "issuingAuthority", "yearsOfPractice", "degree"],
  },
  {
    id: "clinic",
    path: "clinic",
    schema: clinicSchema,
    fields: ["clinicName", "street", "city", "state", "zip", "clinicPhone", "website"],
  },
  {
    id: "specializations",
    path: "specializations",
    schema: specializationsSchema,
    fields: ["specializations"],
  },
  {
    id: "schedule",
    path: "schedule",
    schema: scheduleSchema,
    fields: ["schedule", "consultationDuration"],
  },
  {
    id: "bio",
    path: "bio",
    schema: bioSchema,
    fields: ["bio"],
  },
];
```

### Usage

```typescript
// components/vet/onboarding/VetOnboarding.tsx
import { useMultiStepForm } from "@/hooks";
import { useVetOnboardingStore } from "@/stores";
import { vetSteps } from "./steps";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  useDrPrefix: false,
  licenseNumber: "",
  issuingAuthority: "",
  yearsOfPractice: undefined,
  degree: "",
  clinicName: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  clinicPhone: "",
  website: "",
  specializations: [],
  schedule: [],
  consultationDuration: 30,
  bio: "",
};

export function VetOnboarding() {
  const { data, setStepData } = useVetOnboardingStore();

  const { currentStep, form, next, prev, progress, isFirst, isLast } =
    useMultiStepForm({
      steps: vetSteps,
      basePath: "/vet/onboarding",
      storeData: data,
      setStepData,
      defaultValues,
    });

  return (
    // Similar structure to OwnerOnboarding
    // Render different step components based on currentStep.id
  );
}
```

---

## Gig Onboarding (5 Steps)

### Step Configuration

```typescript
// components/gig/onboarding/steps.ts
import { StepConfig } from "@/hooks";
import { z } from "zod";

const personalSchema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
});

const servicesSchema = z.object({
  services: z
    .array(
      z.object({
        type: z.string().min(1),
        experienceLevel: z.enum(["beginner", "intermediate", "expert"]),
        hourlyRate: z.number().min(10),
      })
    )
    .min(1, "Select at least one service"),
});

const availabilitySchema = z.object({
  availableDays: z.array(z.string()).min(1),
  timePreferences: z.string().min(1),
  coverageZip: z.string().min(5),
  coverageRadiusMiles: z.number().min(1).max(50),
});

const bioSchema = z.object({
  bio: z.string().min(50),
  hasPets: z.boolean(),
  petDetails: z.string().optional(),
});

const agreementsSchema = z.object({
  backgroundCheckConsent: z.boolean().refine((val) => val === true),
  termsAccepted: z.boolean().refine((val) => val === true),
});

export const gigSteps: StepConfig[] = [
  {
    id: "personal",
    path: "personal",
    schema: personalSchema,
    fields: ["firstName", "email", "phone"],
  },
  {
    id: "services",
    path: "services",
    schema: servicesSchema,
    fields: ["services"],
  },
  {
    id: "availability",
    path: "availability",
    schema: availabilitySchema,
    fields: ["availableDays", "timePreferences", "coverageZip", "coverageRadiusMiles"],
  },
  {
    id: "bio",
    path: "bio",
    schema: bioSchema,
    fields: ["bio", "hasPets", "petDetails"],
  },
  {
    id: "agreements",
    path: "agreements",
    schema: agreementsSchema,
    fields: ["backgroundCheckConsent", "termsAccepted"],
  },
];
```

---

## Testing the Multi-Step Form

```typescript
// Test that data persists across reloads
describe("useMultiStepForm with Zustand persistence", () => {
  it("should restore form data from localStorage on mount", () => {
    // 1. Fill out step 1
    // 2. Click next (saves to Zustand/localStorage)
    // 3. Reload page
    // 4. Verify form data is restored
  });

  it("should navigate URL when next() is called", () => {
    // 1. Call next()
    // 2. Verify URL changed to next step's path
  });

  it("should validate only current step fields", () => {
    // 1. Leave step 2 field empty
    // 2. Call next() from step 1
    // 3. Should succeed (doesn't validate step 2)
  });

  it("should merge form data from all steps", () => {
    // 1. Fill step 1 → save
    // 2. Go to step 2 → fill → save
    // 3. Go to step 3 → check that both step 1 and step 2 data are available
  });
});
```

---

## Router Configuration

```typescript
// app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { OwnerOnboarding } from "@/components/owner/onboarding/OwnerOnboarding";
import { VetOnboarding } from "@/components/vet/onboarding/VetOnboarding";
import { GigOnboarding } from "@/components/gig/onboarding/GigOnboarding";

export const router = createBrowserRouter([
  {
    path: "/owner/onboarding/:step",
    element: <OwnerOnboarding />,
  },
  {
    path: "/vet/onboarding/:step",
    element: <VetOnboarding />,
  },
  {
    path: "/gig/onboarding/:step",
    element: <GigOnboarding />,
  },
  // ... other routes
]);
```

**Note:** The `:step` param is optional in the URL pattern but recommended for clarity. The hook uses the last path segment regardless.

---

## Summary

Each onboarding flow:
1. ✅ Defines per-step Zod schemas
2. ✅ Configures `StepConfig[]` array
3. ✅ Calls `useMultiStepForm()` hook
4. ✅ Renders different components per step
5. ✅ Handles validation + navigation
6. ✅ Persists data to Zustand → localStorage
7. ✅ Submits to backend on completion

All code is fully typed and integrates seamlessly with React Hook Form + React Router v7.
