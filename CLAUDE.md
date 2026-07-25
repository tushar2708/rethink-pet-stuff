# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Prefer the root `Makefile` for common workflows.

### Install
- `make install` — install frontend and backend dependencies
- `make install-frontend`
- `make install-backend`

### Development
- `make dev` — start backend on `:3001` and frontend on `:5173`
- `make dev-frontend` — start Vite frontend only
- `make dev-backend` — start Express backend only
- `make stop` — stop both dev servers

### Build / typecheck / lint
- `make build` — build frontend and backend
- `make build-frontend`
- `make build-backend`
- `make typecheck`
- `make typecheck-frontend`
- `make typecheck-backend`
- `make lint`
- `make lint-frontend`

### Tests
Frontend tests currently run with Vitest from the repo root:
- `npm run test`
- `npm run test:watch`
- `npx vitest run src/path/to/file.test.ts` — run a single test file
- `npx vitest run -t "test name"` — run tests matching a name

### Database / Prisma
All Prisma commands are in `backend/` and also surfaced through the root `Makefile`:
- `make db-generate`
- `make db-migrate`
- `make db-migrate-create NAME=...`
- `make db-migrate-status`
- `make db-push`
- `make db-studio`
- `make db-reset`

Backend direct equivalents:
- `cd backend && npm run db:generate`
- `cd backend && npm run db:migrate`
- `cd backend && npm run db:push`
- `cd backend && npm run db:studio`

### Deployment
- `make deploy`
- `make deploy-ensure`
- `make deploy-vars`
- `make deploy-up`

## High-level architecture

## Repo shape
This repository is a full-stack app with:
- **Frontend** at the repo root (`src/`, Vite + React + TypeScript)
- **Backend** in `backend/` (Express + TypeScript + Prisma + PostgreSQL)

The root `Makefile` is the operational entrypoint for running both sides together.

## Frontend architecture

### Application shell
- `src/main.tsx` mounts the app.
- `src/app/App.tsx` wraps the router in a single `QueryClientProvider`.
- `src/app/router.tsx` is the central route map for the whole app.

### Routing model
The app uses `createBrowserRouter` with role-specific route trees:
- `/owner/...`
- `/vet/...`
- `/gig/...`

There are separate layouts for:
- `RootLayout`
- `AuthLayout`
- `OnboardingLayout`
- `OwnerLayout`
- `VetLayout`
- `GigLayout`

The onboarding flows are real deep-linked routes, not modal-only or internal-step UIs.

### State model
There are two main kinds of frontend state:
1. **Server state** via React Query
2. **Flow/session state** via Zustand persist stores

Important stores:
- `src/stores/authStore.ts` — authenticated user + profile IDs
- `src/stores/ownerOnboardingStore.ts`
- `src/stores/vetOnboardingStore.ts`
- `src/stores/gigOnboardingStore.ts`
- `src/stores/addPetStore.ts`

A recurring pattern in onboarding is:
- store intermediate step data in Zustand
- validate the current step through `useMultiStepForm`
- submit once near the end of the flow

### Shared onboarding machinery
- `src/hooks/useMultiStepForm.ts` is the key onboarding/navigation abstraction.
- Step definitions live in per-role `config.ts` files.
- Step validation lives in per-role `schemas.ts` files.

When changing onboarding, keep these three layers in sync:
1. route order in `router.tsx`
2. step metadata in `config.ts`
3. Zod shape in `schemas.ts`

### API integration
- `src/lib/api.ts` is the shared fetch wrapper.
- `src/hooks/useAuth.ts` contains auth mutations/queries.
- Other domain hooks under `src/hooks/` wrap backend endpoints.

If frontend behavior looks “local only”, check whether the actual submit is happening on an earlier/later step than expected before assuming the backend is unused.

### File and image handling
`src/lib/photo.ts` is the shared helper for converting uploads to base64 with a size limit. The intended pattern is:
- use `FileUpload`
- convert immediately with `fileToBase64()`
- store the base64 string in Zustand/form state
- preview from that same string
- submit that same string to the backend

Avoid ad-hoc `FileReader` usage when the shared helper already fits.

## Backend architecture

### Express entrypoint
- `backend/src/index.ts` mounts all API routes and global middleware.
- Middleware stack includes helmet, cors, JSON parsing, morgan, route mounting, and the shared error handler.

### Backend layering
The backend follows a clear split:
- `routes/` — HTTP route declarations
- `controllers/` — thin request/response adapters
- `services/` — business logic and Prisma queries
- `schemas/` — Zod request validation
- `middleware/` — auth, validation, error handling
- `config/` — env and Prisma client bootstrap
- `types/` — shared backend request/response typing

Keep controllers thin; put non-trivial logic in services.

### Database
- Prisma schema lives at `backend/prisma/schema.prisma`.
- Prisma client singleton is in `backend/src/config/db.ts`.
- Environment parsing is centralized in `backend/src/config/env.ts`.

### Current API shape
Backend routes are mounted under `/api/...` and currently include at least:
- `/api/auth`
- `/api/owner`
- `/api/pets`
- `/api/vet`
- `/api/vets`
- `/api/gig`
- `/api/gig-workers`
- `/api/appointments`
- `/api/users`
- `/api/reviews`
- `/api/breeds`
- `/api/health-templates`

When wiring frontend pages, verify the exact mounted path in `backend/src/index.ts` and then check the corresponding `routes/*.ts` file.

## Functional big-picture
This app is a three-sided pet-care platform:
- **Owners** onboard pets and manage health/history/appointments
- **Vets** onboard professional/clinic details and manage patients/appointments/schedule
- **Gig workers** onboard service offerings and manage jobs/earnings/profile

The current codebase uses the **owner onboarding flow as the most evolved reference pattern** for multi-step submission behavior, image handling, and deep-linked step sequencing. When aligning vet/gig flows, compare them against owner before introducing new patterns.

## Important repo-specific notes
- There is no project README at the repo root right now; the code and Makefile are the primary source of truth.
- The repo also contains several generated/working markdown docs (for example onboarding/store notes), but the authoritative implementation wiring is in the actual code paths listed above.
- If a route appears broken, inspect both `src/app/router.tsx` and the matching backend route mount in `backend/src/index.ts` before making assumptions.
