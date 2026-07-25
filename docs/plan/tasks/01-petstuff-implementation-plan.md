# Plan: PetStuff Platform Implementation

> **Progress Tracking**: Mark items as you work:
> - ❌ = Not started
> - ⚠️ = In progress / Partially done
> - ✅ = Complete

## Tracker

| ID | Item | Status | Est. | Notes |
|----|------|--------|------|-------|
| **1** | **Stage: Project Foundation** | ❌ | 3d | |
| 1.1 | Task: Scaffold Vite+React+TS project | ❌ | 0.5d | |
| 1.1.1 | Init Vite with React-TS template, configure `tsconfig` strict mode | ❌ | 1h | |
| 1.1.2 | Install + configure Tailwind CSS v4, shadcn/ui, Lucide icons | ❌ | 1h | |
| 1.1.3 | Install Framer Motion, React Router v7, Zustand, React Hook Form, Zod | ❌ | 1h | |
| 1.1.4 | Configure ESLint, Prettier, Vitest | ❌ | 1h | |
| 1.2 | Task: Routing + Layout Shell | ❌ | 1d | |
| 1.2.1 | Set up React Router with layout routes: `/`, `/owner/*`, `/vet/*`, `/gig/*` | ❌ | 2h | |
| 1.2.2 | Create `OwnerLayout`, `VetLayout`, `GigLayout` shells (sidebar desktop, bottom nav mobile) | ❌ | 3h | [Details](#12-routing--layout-shell) |
| 1.2.3 | Implement portal theming via `data-portal` CSS custom properties | ❌ | 2h | [Details](#12-routing--layout-shell) |
| 1.3 | Task: Shared Components | ❌ | 1.5d | |
| 1.3.1 | `ImageCard` — selectable image card with Framer Motion glow + checkmark | ❌ | 3h | [Details](#13-shared-components) |
| 1.3.2 | `StepWrapper` — onboarding step container with slide animation | ❌ | 2h | |
| 1.3.3 | `ProgressBar` — segmented progress indicator | ❌ | 1h | |
| 1.3.4 | `FileUpload` — drag-drop / tap with circular crop preview | ❌ | 2h | |
| 1.3.5 | `useMultiStepForm` hook — step nav, Zod validation per step, localStorage persist | ❌ | 3h | [Details](#13-shared-components) |
| 1.4 | Task: Type Definitions | ❌ | 0.5d | |
| 1.4.1 | Define `User`, `Pet`, `VetProfile`, `GigWorkerProfile`, `Appointment` types | ❌ | 2h | |
| 1.4.2 | Define Zod schemas for all onboarding steps (owner, vet, gig) | ❌ | 2h | |
| **1-R** | **Review: Stage 1** | ❌ | 0.5d | |
| 1-R.1 | Verify: `npm run dev` starts, all routes render placeholder pages | ❌ | | |
| 1-R.2 | Verify: shared components render in isolation (Storybook or manual) | ❌ | | |
| 1-R.3 | Verify: portal themes switch correctly across `/owner`, `/vet`, `/gig` | ❌ | | |
| 1-R.4 | Verify: `useMultiStepForm` persists/restores from localStorage | ❌ | | |
| 1-R.5 | Tests: Vitest unit tests for `useMultiStepForm`, Zod schemas | ❌ | | |
| 1-R.6 | Docs: update README with setup instructions, project structure | ❌ | | |
| **2** | **Stage: Landing + Owner Onboarding** | ❌ | 3d | Needs 1-R ✅ |
| 2.1 | Task: Landing Page | ❌ | 0.5d | |
| 2.1.1 | Hero section with tagline + 3 portal cards ("Pet Owner", "Vet", "Gig Worker") | ❌ | 2h | |
| 2.1.2 | Each card routes to respective onboarding; responsive stacking on mobile | ❌ | 1h | |
| 2.2 | Task: Owner Onboarding Steps | ❌ | 2d | |
| 2.2.1 | Step 1 "About You" — name, email, phone with inline validation | ❌ | 2h | |
| 2.2.2 | Step 2 "Pet Type" — `ImageCard` grid (Dog, Cat, Bird, Hamster, Other) with stagger fade-in | ❌ | 3h | [Details](#22-owner-onboarding-steps) |
| 2.2.3 | Step 3 "Pet Details" — name, age (years/months toggle), breed autocomplete, photo upload | ❌ | 3h | |
| 2.2.4 | Step 4 "Temperament" — two illustrated cards + energy level slider | ❌ | 2h | |
| 2.2.5 | Step 5 "All Set!" — summary card, confetti animation, "Go to Dashboard" / "Add Another Pet" | ❌ | 2h | |
| 2.2.6 | Wire `OwnerOnboarding` orchestrator page with `useMultiStepForm` | ❌ | 2h | |
| 2.3 | Task: Add Pet Flow (Post-Onboarding) | ❌ | 0.5d | |
| 2.3.1 | `AddPetModal` reusing steps 2-4 in a slide-over panel from dashboard | ❌ | 3h | |
| **2-R** | **Review: Stage 2** | ❌ | 0.5d | |
| 2-R.1 | Verify: full owner onboarding flow in browser (mobile + desktop) | ❌ | | |
| 2-R.2 | Verify: form validation blocks "Next" on invalid input | ❌ | | |
| 2-R.3 | Verify: refresh mid-onboarding restores progress from localStorage | ❌ | | |
| 2-R.4 | Verify: "Add Another Pet" from step 5 and from dashboard modal both work | ❌ | | |
| 2-R.5 | Tests: component tests for each step, integration test for full flow | ❌ | | |
| 2-R.6 | Docs: screenshot onboarding flow in README | ❌ | | |
| **3** | **Stage: Vet + Gig Worker Onboarding** | ❌ | 4d | Needs 2-R ✅ |
| 3.1 | Task: Vet Onboarding Steps | ❌ | 2d | |
| 3.1.1 | Step 1 "Welcome, Doctor" — name (Dr. prefix toggle), email, phone | ❌ | 1.5h | |
| 3.1.2 | Step 2 "Credentials" — license #, issuing authority dropdown, years, degree, doc upload | ❌ | 2h | |
| 3.1.3 | Step 3 "Your Clinic" — clinic name, Google Places address, phone, logo, multi-location toggle | ❌ | 3h | [Details](#31-vet-onboarding-steps) |
| 3.1.4 | Step 4 "Specializations" — multi-select icon chips (12 specializations) | ❌ | 2h | |
| 3.1.5 | Step 5 "Availability" — `WeeklyScheduleBuilder` with day toggles + time pickers + presets | ❌ | 3h | [Details](#31-vet-onboarding-steps) |
| 3.1.6 | Step 6 "Almost There" — photo upload, bio textarea, live profile preview card | ❌ | 2h | |
| 3.1.7 | Wire `VetOnboarding` orchestrator page | ❌ | 1h | |
| 3.2 | Task: Gig Worker Onboarding Steps | ❌ | 2d | |
| 3.2.1 | Step 1 "Hey there!" — first name, email, phone, profile photo, "3 min" estimate | ❌ | 1.5h | |
| 3.2.2 | Step 2 "What can you do?" — service icon cards (multi-select) + `ServiceDetailExpander` per service | ❌ | 3h | [Details](#32-gig-worker-onboarding-steps) |
| 3.2.3 | Step 3 "When and where?" — day chips, time preference pills, zip/radius coverage selector | ❌ | 2.5h | |
| 3.2.4 | Step 4 "About You" — bio prompt, pet ownership question | ❌ | 1.5h | |
| 3.2.5 | Step 5 "One Last Thing" — background check consent, ToS, celebration | ❌ | 2h | |
| 3.2.6 | Wire `GigOnboarding` orchestrator page | ❌ | 1h | |
| **3-R** | **Review: Stage 3** | ❌ | 0.5d | |
| 3-R.1 | Verify: all 6 vet steps in browser (mobile + desktop) | ❌ | | |
| 3-R.2 | Verify: all 5 gig steps in browser (mobile + desktop) | ❌ | | |
| 3-R.3 | Verify: `WeeklyScheduleBuilder` handles edge cases (no days, overlapping times) | ❌ | | |
| 3-R.4 | Verify: `ServiceDetailExpander` expands/collapses, validates rate input | ❌ | | |
| 3-R.5 | Verify: vet theme (blue) and gig theme (orange) apply correctly | ❌ | | |
| 3-R.6 | Tests: component + integration tests for both flows | ❌ | | |
| 3-R.7 | Docs: update README with vet/gig onboarding screenshots | ❌ | | |
| **4** | **Stage: Dashboards** | ❌ | 4d | Needs 3-R ✅ |
| 4.1 | Task: Owner Dashboard | ❌ | 1.5d | |
| 4.1.1 | `PetCard` component — photo, name, species icon, age, temperament badge | ❌ | 2h | |
| 4.1.2 | `PetGrid` — responsive grid of `PetCard`s with "Add Pet" card | ❌ | 1.5h | |
| 4.1.3 | Dashboard page — welcome header, pet grid, placeholder sections for Find Vet / Find Worker | ❌ | 2h | |
| 4.1.4 | Wire "Add Pet" button → `AddPetModal` (from Stage 2) | ❌ | 1h | |
| 4.2 | Task: Vet Dashboard | ❌ | 1.5d | |
| 4.2.1 | `TodayTimeline` — vertical timeline of today's appointments (mock data) | ❌ | 3h | |
| 4.2.2 | `AppointmentCalendar` — weekly calendar view (mock data) | ❌ | 3h | |
| 4.2.3 | Dashboard page — today's timeline, stats cards, placeholder sections | ❌ | 2h | |
| 4.3 | Task: Gig Worker Dashboard | ❌ | 1d | |
| 4.3.1 | `JobCard` — service type, pet info, location, time, pay, accept/decline buttons | ❌ | 2h | |
| 4.3.2 | `JobBoard` — filterable list of `JobCard`s (mock data) | ❌ | 2h | |
| 4.3.3 | `EarningsSummary` — weekly/monthly earnings with simple chart | ❌ | 2h | |
| 4.3.4 | Dashboard page — job board, earnings summary, badges placeholder | ❌ | 1.5h | |
| **4-R** | **Review: Stage 4** | ❌ | 0.5d | |
| 4-R.1 | Verify: owner dashboard shows pets, add pet works end-to-end | ❌ | | |
| 4-R.2 | Verify: vet dashboard renders timeline and calendar with mock data | ❌ | | |
| 4-R.3 | Verify: gig dashboard renders job board and earnings | ❌ | | |
| 4-R.4 | Verify: all 3 dashboards responsive (mobile bottom nav, desktop sidebar) | ❌ | | |
| 4-R.5 | Tests: component tests for cards, grid, timeline, job board | ❌ | | |
| 4-R.6 | Docs: update README with dashboard screenshots | ❌ | | |
| **5** | **Stage: Auth + PWA + Polish** | ❌ | 3d | Needs 4-R ✅ |
| 5.1 | Task: Authentication | ❌ | 1.5d | |
| 5.1.1 | Integrate auth provider (Supabase Auth or Clerk) — signup, login, social login | ❌ | 4h | [Details](#51-authentication) |
| 5.1.2 | Role-based routing — redirect to correct portal after login | ❌ | 2h | |
| 5.1.3 | Protected routes — redirect unauthenticated users to login | ❌ | 2h | |
| 5.1.4 | Persist auth state in Zustand, sync with provider session | ❌ | 2h | |
| 5.2 | Task: PWA Setup | ❌ | 0.5d | |
| 5.2.1 | Configure `vite-plugin-pwa` — manifest, service worker, icons | ❌ | 2h | |
| 5.2.2 | Offline fallback page, cache onboarding assets | ❌ | 2h | |
| 5.3 | Task: Polish + QA | ❌ | 1d | |
| 5.3.1 | Animation polish — step transitions, card selections, confetti timing | ❌ | 3h | |
| 5.3.2 | Accessibility audit — keyboard nav, screen reader labels, focus management | ❌ | 3h | |
| 5.3.3 | Cross-browser testing (Chrome, Safari, Firefox) + mobile device testing | ❌ | 2h | |
| **5-R** | **Review: Stage 5 (Final)** | ❌ | 0.5d | |
| 5-R.1 | Verify: signup → onboarding → dashboard flow for all 3 portals | ❌ | | |
| 5-R.2 | Verify: login persists across refresh, logout clears state | ❌ | | |
| 5-R.3 | Verify: PWA installable on mobile, offline fallback works | ❌ | | |
| 5-R.4 | Verify: all animations smooth on low-end devices | ❌ | | |
| 5-R.5 | Full test suite passing (Vitest) | ❌ | | |
| 5-R.6 | Final README with setup, architecture, screenshots | ❌ | | |

---

## Details

### 1.2 Routing + Layout Shell

**Layout structure (shared across portals):**
- Desktop (≥768px): left sidebar (240px) with nav links + icon, top bar with avatar/notifications
- Mobile (<768px): bottom tab bar (4-5 tabs) with icons + labels, hamburger for overflow
- Sidebar and bottom nav content differs per portal (owner/vet/gig)

**Portal theming via CSS custom properties:**
```css
/* globals.css */
[data-portal="owner"] { --primary: #F59E0B; --accent: #14B8A6; }
[data-portal="vet"]   { --primary: #3B82F6; --accent: #10B981; }
[data-portal="gig"]   { --primary: #F97316; --accent: #22C55E; }
```

### 1.3 Shared Components

**`ImageCard` props:**
- `image: string` — path to pet/service illustration
- `label: string` — display text below image
- `selected: boolean` — controls highlight state
- `onSelect: () => void`
- `mode: "single" | "multi"` — determines `role="radio"` vs `role="checkbox"`
- Selection animation: Framer Motion `scale(1.05)` + border glow + checkmark overlay

**`useMultiStepForm` hook interface:**
```typescript
function useMultiStepForm<T>(config: {
  steps: StepConfig[];        // { id, schema: ZodSchema }
  storageKey: string;         // localStorage key for persistence
}): {
  currentStep: number;
  data: Partial<T>;
  next: () => Promise<boolean>;  // validates current step, returns success
  prev: () => void;
  goTo: (step: number) => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;              // 0-1 for progress bar
  register: UseFormRegister<T>;  // from React Hook Form
  errors: FieldErrors<T>;
  reset: () => void;             // clear persisted data
}
```

### 2.2 Owner Onboarding Steps

**Step 2 — Pet Type image assets needed:**

| Pet Type | Image | Grid Position |
|----------|-------|---------------|
| Dog | Golden retriever photo/illustration | Row 1, Col 1 |
| Cat | Orange tabby photo/illustration | Row 1, Col 2 |
| Bird | Parrot photo/illustration | Row 2, Col 1 |
| Hamster | Hamster photo/illustration | Row 2, Col 2 |
| Other | Paw print icon, opens text input | Row 3, centered |

1. Images sourced from royalty-free sites (Unsplash/Pexels) or custom SVG illustrations
2. Mobile: 2-column grid; Desktop: 3-column grid with "Other" in the row below
3. Single-select behavior — tapping one deselects the previous

### 3.1 Vet Onboarding Steps

**Step 3 — Clinic Address:**
1. Use `@react-google-maps/api` or a lightweight Places autocomplete component
2. Fallback: manual address fields if Google API key not configured
3. Map preview pin below address field (optional, can defer)

**Step 5 — `WeeklyScheduleBuilder`:**

| Day | Enabled | Start | End |
|-----|---------|-------|-----|
| Mon | ✅ | 09:00 | 17:00 |
| Tue | ✅ | 09:00 | 17:00 |
| ... | | | |

1. Preset buttons: "Weekdays 9-5" fills Mon-Fri 09:00-17:00
2. Each day has a toggle switch; disabled days grey out time pickers
3. Consultation duration dropdown: 15 / 30 / 45 / 60 min
4. Validate: end time > start time

### 3.2 Gig Worker Onboarding Steps

**Step 2 — `ServiceDetailExpander`:**
1. Tapping a service card toggles selection AND reveals an expandable panel below
2. Panel contains:
   - Experience segmented control: "New to this" / "Some experience" / "Pro"
   - Rate input: `$` prefix, number input, `/hr` suffix, helper text with suggested range
3. Deselecting the card collapses the panel and clears the sub-fields
4. At least one service must be selected to proceed

### 5.1 Authentication

**Auth provider decision (choose one at implementation time):**

| Option | Pros | Cons |
|--------|------|------|
| Supabase Auth | Free tier, built-in DB, social login, fastest to MVP | Less customizable UI |
| Clerk | Beautiful prebuilt components, role management, webhooks | Paid after free tier |

1. Social login: Google + Apple minimum
2. Role stored as user metadata: `role: "owner" | "vet" | "gig"`
3. Role selected during onboarding, stored after completion
4. Protected route wrapper: `<RequireAuth role="owner">` redirects to login if unauthenticated or wrong role

---

## Tech Stack Summary

| Concern | Library |
|---------|---------|
| Build | Vite + React 19 + TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| State | Zustand (global) + TanStack Query (server) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |
| PWA | vite-plugin-pwa |

## Project Structure

```
src/
  app/              # App.tsx, providers.tsx, router.tsx
  components/
    ui/             # shadcn/ui primitives
    shared/         # ImageCard, StepWrapper, ProgressBar, FileUpload, WeeklyScheduleBuilder
  features/
    auth/           # LoginPage, SignUpPage, RoleSelectPage, authStore
    landing/        # LandingPage (portal selection)
    owner/
      onboarding/   # OwnerOnboarding + 5 step components + schemas
      dashboard/    # OwnerDashboard, PetCard, PetGrid, AddPetModal
      layout/       # OwnerLayout, OwnerBottomNav
    vet/
      onboarding/   # VetOnboarding + 6 step components + schemas
      dashboard/    # VetDashboard, TodayTimeline, AppointmentCalendar
      layout/       # VetLayout, VetBottomNav
    gig/
      onboarding/   # GigOnboarding + 5 step components + schemas
      dashboard/    # GigDashboard, JobCard, JobBoard, EarningsSummary
      layout/       # GigLayout, GigBottomNav
  hooks/            # useMediaQuery, useMultiStepForm
  types/            # user.ts, pet.ts, vet.ts, gig.ts, appointment.ts
  stores/           # userStore, onboardingStore
  lib/              # api.ts, cn.ts, constants.ts
  styles/           # globals.css
```
