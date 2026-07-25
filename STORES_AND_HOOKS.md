# Stores and Hooks Documentation

This document explains all the Zustand stores and custom hooks created for the PetStuff application.

## Zustand Stores

All stores use the `persist` middleware to automatically save data to localStorage and restore it on app reload.

### 1. `useAuthStore`

Manages user authentication state.

**Location:** `src/stores/authStore.ts`

**State:**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}
```

**Usage:**
```typescript
import { useAuthStore } from "@/stores";

function MyComponent() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  return (
    <>
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
      <button onClick={logout}>Logout</button>
    </>
  );
}
```

**localStorage Key:** `petstuff-auth`

---

### 2. `useOwnerOnboardingStore`

Persists owner onboarding form data across 4 steps.

**Location:** `src/stores/ownerOnboardingStore.ts`

**Data Schema:**
```typescript
interface OwnerOnboardingData {
  // Step 1: About You
  name: string;
  email: string;
  phone: string;
  // Step 2: Pet Type
  petType: string;
  customType: string;
  // Step 3: Pet Details
  petName: string;
  ageYears: number | undefined;
  ageMonths: number | undefined;
  breed: string;
  // Step 4: Temperament
  temperament: string;
  energyLevel: string;
}
```

**State:**
```typescript
interface OwnerOnboardingState {
  data: Partial<OwnerOnboardingData>;
  setStepData: (stepData: Partial<OwnerOnboardingData>) => void;
  clearData: () => void;
}
```

**Usage:**
```typescript
import { useOwnerOnboardingStore } from "@/stores";

function OwnerStep1() {
  const { data, setStepData } = useOwnerOnboardingStore();

  const handleSubmit = (formData: Partial<OwnerOnboardingData>) => {
    setStepData(formData); // Merges with existing data
  };

  return <form>{/* fields */}</form>;
}
```

**localStorage Key:** `petstuff-owner-onboarding`

---

### 3. `useVetOnboardingStore`

Persists vet onboarding form data across 6 steps.

**Location:** `src/stores/vetOnboardingStore.ts`

**Data Schema:**
```typescript
interface VetOnboardingData {
  // Step 1: About You
  name: string;
  email: string;
  phone: string;
  useDrPrefix: boolean;
  // Step 2: Credentials
  licenseNumber: string;
  issuingAuthority: string;
  yearsOfPractice: number | undefined;
  degree: string;
  // Step 3: Clinic Information
  clinicName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  clinicPhone: string;
  website: string;
  // Step 4: Specializations
  specializations: string[];
  // Step 5: Schedule
  schedule: DaySchedule[];
  consultationDuration: number | undefined;
  // Step 6: Bio
  bio: string;
}
```

**localStorage Key:** `petstuff-vet-onboarding`

---

### 4. `useGigOnboardingStore`

Persists gig worker onboarding form data across 5 steps.

**Location:** `src/stores/gigOnboardingStore.ts`

**Data Schema:**
```typescript
interface GigOnboardingData {
  // Step 1: Personal Information
  firstName: string;
  email: string;
  phone: string;
  // Step 2: Services
  services: ServiceOffering[];
  // Step 3: Availability & Coverage
  availableDays: string[];
  timePreferences: string;
  coverageZip: string;
  coverageRadiusMiles: number | undefined;
  // Step 4: Bio & Pets
  bio: string;
  hasPets: boolean;
  petDetails: string;
  // Step 5: Agreements
  backgroundCheckConsent: boolean;
  termsAccepted: boolean;
}
```

**localStorage Key:** `petstuff-gig-onboarding`

---

### 5. `useAddPetStore`

Persists add-pet form data (subset of owner onboarding fields).

**Location:** `src/stores/addPetStore.ts`

**Data Schema:**
```typescript
interface AddPetData {
  petType: string;
  customType: string;
  petName: string;
  ageYears: number | undefined;
  ageMonths: number | undefined;
  breed: string;
  temperament: string;
  energyLevel: string;
}
```

**localStorage Key:** `petstuff-add-pet`

---

## Custom Hooks

### 1. `useMultiStepForm`

**The most critical hook.** Manages multi-step forms with URL-synced navigation and Zustand state persistence.

**Location:** `src/hooks/useMultiStepForm.ts`

**Key Concept:**
- URL (via React Router) determines which step is active
- Zustand stores the form data across page reloads
- Validation happens per-step using Zod schemas

**Configuration Interface:**
```typescript
interface UseMultiStepFormConfig<T extends Record<string, unknown>> {
  steps: StepConfig[];              // Array of step configurations
  basePath: string;                 // e.g., "/owner/onboarding"
  storeData: Partial<T>;            // Current data from Zustand
  setStepData: (data: Partial<T>) => void; // Zustand setter
  defaultValues?: DefaultValues<T>; // Default form values
}

interface StepConfig {
  id: string;          // Unique step identifier
  path: string;        // URL path segment (e.g., "about-you")
  schema: ZodSchema;   // Zod validation schema for this step
  fields: string[];    // Field names to validate on this step
}
```

**Return Value:**
```typescript
interface UseMultiStepFormReturn<T extends Record<string, unknown>> {
  currentStepIndex: number;       // 0-based index of current step
  currentStep: StepConfig | undefined;
  form: UseFormReturn<T>;         // React Hook Form instance
  next: () => Promise<boolean>;   // Validate & navigate to next step
  prev: () => void;               // Navigate to previous step
  goToStep: (stepId: string) => void; // Jump to specific step
  isFirst: boolean;               // Is this the first step?
  isLast: boolean;                // Is this the last step?
  progress: number;               // 0-1 progress value
  canGoNext: boolean;             // Can navigate forward?
}
```

**Example Usage:**

```typescript
import { useMultiStepForm, StepConfig } from "@/hooks";
import { useOwnerOnboardingStore } from "@/stores";
import { z } from "zod";

// Define step schemas
const step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  phone: z.string().min(10),
});

const step2Schema = z.object({
  petType: z.string().min(1),
});

const steps: StepConfig[] = [
  {
    id: "about-you",
    path: "about-you",
    schema: step1Schema,
    fields: ["name", "email", "phone"],
  },
  {
    id: "pet-type",
    path: "pet-type",
    schema: step2Schema,
    fields: ["petType"],
  },
];

function OwnerOnboardingFlow() {
  const { data, setStepData } = useOwnerOnboardingStore();
  
  const { 
    currentStepIndex, 
    currentStep, 
    form, 
    next, 
    prev, 
    progress,
    isFirst,
    isLast 
  } = useMultiStepForm({
    steps,
    basePath: "/owner/onboarding",
    storeData: data,
    setStepData,
    defaultValues: { name: "", email: "", phone: "", petType: "" },
  });

  return (
    <div>
      {/* Progress indicator */}
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Form section */}
      <form onSubmit={form.handleSubmit(async () => {
        const success = await next();
        if (success) console.log("Moving to next step");
      })}>
        {currentStep?.id === "about-you" && (
          <>
            <input {...form.register("name")} placeholder="Name" />
            <input {...form.register("email")} placeholder="Email" />
            <input {...form.register("phone")} placeholder="Phone" />
          </>
        )}

        {currentStep?.id === "pet-type" && (
          <>
            <select {...form.register("petType")}>
              <option value="">Select pet type</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </>
        )}

        <button type="button" onClick={prev} disabled={isFirst}>
          Previous
        </button>
        <button type="submit" disabled={isLast}>
          {isLast ? "Complete" : "Next"}
        </button>
      </form>

      {/* Step indicators */}
      <div className="flex gap-2">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => goToStep(step.id)}
            className={idx <= currentStepIndex ? "completed" : ""}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**How It Works:**

1. **Step Detection:** Uses `useLocation().pathname` to extract the last URL segment and find the matching step
2. **Validation:** When `next()` is called, it validates only the current step's fields using `form.trigger()`
3. **Persistence:** After validation passes, calls `setStepData()` to save form values to Zustand
4. **Navigation:** Uses React Router's `useNavigate()` to change the URL
5. **Data Restoration:** On step change, the hook resets form values using persisted Zustand data
6. **Progress Tracking:** Calculates progress as `(currentStepIndex + 1) / steps.length`

---

### 2. `useMediaQuery`

Simple hook for responsive design queries.

**Location:** `src/hooks/useMediaQuery.ts`

**Signature:**
```typescript
function useMediaQuery(query: string): boolean
```

**Usage:**
```typescript
import { useMediaQuery } from "@/hooks";

function ResponsiveComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isMobile && <MobileNav />}
      {isDesktop && <DesktopNav />}
    </>
  );
}
```

**How It Works:**
- Uses `window.matchMedia()` API
- Sets up event listener for media query changes
- Returns boolean indicating if query matches
- Cleans up listener on unmount

---

### 3. `usePortal`

Determines the current portal (owner/vet/gig) based on URL.

**Location:** `src/hooks/usePortal.ts`

**Signature:**
```typescript
function usePortal(): "owner" | "vet" | "gig" | null
```

**Usage:**
```typescript
import { usePortal } from "@/hooks";

function ContextualComponent() {
  const portal = usePortal();

  if (portal === "owner") {
    return <OwnerDashboard />;
  } else if (portal === "vet") {
    return <VetDashboard />;
  } else if (portal === "gig") {
    return <GigDashboard />;
  }

  return <LandingPage />;
}
```

**How It Works:**
- Checks if pathname starts with `/owner`, `/vet`, or `/gig`
- Returns the matching portal or `null`

---

## Export Convenience

All stores and hooks can be imported from their respective index files:

```typescript
// Import from index files
import { useMultiStepForm, useMediaQuery, usePortal } from "@/hooks";
import { 
  useAuthStore,
  useOwnerOnboardingStore,
  useVetOnboardingStore,
  useGigOnboardingStore,
  useAddPetStore
} from "@/stores";

// Or import directly
import { useAuthStore } from "@/stores/authStore";
```

---

## Best Practices

### Multi-Step Forms

1. **Define schemas per step**, not one global schema:
   ```typescript
   const step1Schema = z.object({ /* step 1 fields */ });
   const step2Schema = z.object({ /* step 2 fields */ });
   ```

2. **Pass only relevant fields in `StepConfig.fields`:**
   ```typescript
   {
     id: "about-you",
     path: "about-you",
     schema: step1Schema,
     fields: ["name", "email", "phone"], // Not: ["name", "email", "phone", "petType"]
   }
   ```

3. **Use `setStepData()` to merge data**, not replace:
   ```typescript
   // This correctly merges with existing data
   setStepData({ name: "John", email: "john@example.com" });
   ```

4. **Always provide `defaultValues`:**
   ```typescript
   defaultValues: {
     name: "",
     email: "",
     phone: "",
     petType: "",
   }
   ```

### Data Persistence

1. **All stores auto-persist to localStorage** — no manual save needed
2. **Clear data when flow is complete:**
   ```typescript
   const { clearData } = useOwnerOnboardingStore();
   clearData(); // After successful submission
   ```

3. **Test persistence** by reloading the page during form entry

---

## TypeScript Support

All stores and hooks are fully typed. TypeScript will catch:
- Missing fields in `defaultValues`
- Incorrect field names in validation schemas
- Type mismatches in setters

```typescript
// ✅ Good: TypeScript knows about name, email, phone
setStepData({ name: "John", email: "john@example.com" });

// ❌ Error: TypeScript flags unknown field
setStepData({ invalidField: "value" });
```

---

## File Locations Summary

| File | Purpose |
|------|---------|
| `src/stores/authStore.ts` | User authentication state |
| `src/stores/ownerOnboardingStore.ts` | Owner onboarding form data |
| `src/stores/vetOnboardingStore.ts` | Vet onboarding form data |
| `src/stores/gigOnboardingStore.ts` | Gig worker onboarding form data |
| `src/stores/addPetStore.ts` | Add pet form data |
| `src/stores/index.ts` | Export all stores |
| `src/hooks/useMultiStepForm.ts` | Multi-step form orchestration (CRITICAL) |
| `src/hooks/useMediaQuery.ts` | Responsive design queries |
| `src/hooks/usePortal.ts` | Portal context detection |
| `src/hooks/index.ts` | Export all hooks |
