# Quick Start: Stores & Hooks

## 5-Minute Overview

### Zustand Stores (Auto-Persist to localStorage)

```typescript
// Authentication
import { useAuthStore } from "@/stores";
const { user, setUser, logout } = useAuthStore();

// Owner Onboarding (4 steps)
import { useOwnerOnboardingStore } from "@/stores";
const { data, setStepData, clearData } = useOwnerOnboardingStore();

// Vet Onboarding (6 steps)
import { useVetOnboardingStore } from "@/stores";
const { data, setStepData, clearData } = useVetOnboardingStore();

// Gig Onboarding (5 steps)
import { useGigOnboardingStore } from "@/stores";
const { data, setStepData, clearData } = useGigOnboardingStore();

// Add Pet (single or multi-step)
import { useAddPetStore } from "@/stores";
const { data, setStepData, clearData } = useAddPetStore();
```

---

## Multi-Step Forms (THE CRITICAL PATTERN)

### Step 1: Define Your Steps

```typescript
import { StepConfig } from "@/hooks";
import { z } from "zod";

const steps: StepConfig[] = [
  {
    id: "about-you",
    path: "about-you",
    schema: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(10),
    }),
    fields: ["name", "email", "phone"],
  },
  {
    id: "pet-info",
    path: "pet-info",
    schema: z.object({
      petType: z.string().min(1),
      petName: z.string().min(1),
    }),
    fields: ["petType", "petName"],
  },
];
```

### Step 2: Use the Hook

```typescript
import { useMultiStepForm } from "@/hooks";
import { useOwnerOnboardingStore } from "@/stores";

function OnboardingPage() {
  const { data, setStepData } = useOwnerOnboardingStore();

  const {
    currentStep,
    form,
    next,
    prev,
    progress,
    isFirst,
    isLast,
  } = useMultiStepForm({
    steps,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
    defaultValues: { name: "", email: "", phone: "", petType: "", petName: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async () => {
        const success = await next();
      })}
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Form fields for current step */}
      {currentStep?.id === "about-you" && (
        <>
          <input {...form.register("name")} placeholder="Your name" />
          <input {...form.register("email")} placeholder="Email" />
          <input {...form.register("phone")} placeholder="Phone" />
        </>
      )}

      {currentStep?.id === "pet-info" && (
        <>
          <input {...form.register("petType")} placeholder="Pet type" />
          <input {...form.register("petName")} placeholder="Pet name" />
        </>
      )}

      {/* Navigation buttons */}
      <button type="button" onClick={prev} disabled={isFirst}>
        Back
      </button>
      <button type="submit" disabled={isLast}>
        {isLast ? "Finish" : "Next"}
      </button>
    </form>
  );
}
```

---

## Responsive Design

```typescript
import { useMediaQuery } from "@/hooks";

function ResponsiveNav() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

---

## Portal Detection

```typescript
import { usePortal } from "@/hooks";

function DashboardRouter() {
  const portal = usePortal();

  if (portal === "owner") return <OwnerDashboard />;
  if (portal === "vet") return <VetDashboard />;
  if (portal === "gig") return <GigDashboard />;
  return <LandingPage />;
}
```

---

## Key Points

✅ **Stores auto-persist** — No manual localStorage needed  
✅ **URL drives step logic** — Back button works naturally  
✅ **Form data survives reloads** — Zustand + localStorage  
✅ **Validation per-step** — Each step has its own Zod schema  
✅ **Fully typed** — TypeScript catches errors at compile time  
✅ **Works with React Hook Form** — Standard patterns apply  

---

## Files Created

| Path | Purpose |
|------|---------|
| `src/stores/authStore.ts` | Auth state + persist |
| `src/stores/ownerOnboardingStore.ts` | Owner form data |
| `src/stores/vetOnboardingStore.ts` | Vet form data |
| `src/stores/gigOnboardingStore.ts` | Gig worker form data |
| `src/stores/addPetStore.ts` | Add pet form data |
| `src/hooks/useMultiStepForm.ts` | **CRITICAL: URL-synced form orchestration** |
| `src/hooks/useMediaQuery.ts` | Responsive design queries |
| `src/hooks/usePortal.ts` | Portal detection (owner/vet/gig) |

**Documentation:** `STORES_AND_HOOKS.md`

---

## Next Steps

1. **Create route structure** with step paths (e.g., `/owner/onboarding/about-you`)
2. **Define Zod schemas** for each step's validation
3. **Build form components** using React Hook Form + shadcn/ui
4. **Test persistence** by reloading during form entry
5. **Add completion logic** (API calls, email confirmation, etc.)
