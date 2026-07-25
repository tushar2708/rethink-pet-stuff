# PetStuff

Full-stack pet care platform with three user portals:
- **Pet Owners** — onboarding, pets, health timeline, appointments, services
- **Veterinarians** — onboarding, patients, appointments, schedule, profile
- **Gig Workers** — onboarding, jobs, earnings, profile

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, React Query, Zustand, Zod, Tailwind CSS v4 |
| Backend | Express, TypeScript, Prisma, PostgreSQL |
| Database | PostgreSQL via Prisma |
| Dev tooling | Makefile, Vitest, ESLint |

## Repository layout

```text
.
├── src/                  # Frontend app
│   ├── app/              # App bootstrap + router
│   ├── components/       # Shared UI and primitives
│   ├── features/         # Owner / Vet / Gig / Auth / Landing feature areas
│   ├── hooks/            # React Query + app hooks
│   ├── layouts/          # Root/Auth/Onboarding/Portal layouts
│   ├── lib/              # API client, helpers, shared utilities
│   ├── stores/           # Zustand persisted stores
│   └── styles/           # Global styles
├── backend/              # Express + Prisma backend
│   ├── prisma/           # Prisma schema and migrations
│   └── src/
│       ├── config/       # Env + Prisma client
│       ├── controllers/  # Thin request handlers
│       ├── middleware/   # Auth / validation / error handling
│       ├── routes/       # API route declarations
│       ├── schemas/      # Zod request schemas
│       └── services/     # Business logic + Prisma access
├── public/               # Static assets
├── mock/                 # Mock HTML/design references
└── Makefile              # Main operational entrypoint
```

## Run locally

### Quick start

```bash
make install
cp backend/.env.example backend/.env
make dev
```

If this is your first time setting up the project, complete the environment setup steps below before running `make dev`.

### 1. Install

```bash
make install
```

### 2. Set up the backend environment

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Then open `backend/.env` and fill in the required values.

#### Database setup

You need a PostgreSQL database connection string for `DATABASE_URL`.

A simple way to get one:
- create a project in **Neon** and create a Postgres database, or
- create a project in **Supabase** and use its Postgres connection details

After creating the database:
1. copy the Postgres connection string
2. paste it into `backend/.env` as `DATABASE_URL`

Example:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=replace-this-with-your-own-secret-eg-4f9b2d8c7a1e5f0a9c3d6b8e1f2a4c7d
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Generate your own JWT secret and paste it into `JWT_SECRET`.
A simple option is: `https://randomkeygen.com/jwt-secret`
Do not use the example string as-is.

### 3. Prepare Prisma

After `backend/.env` is filled in, run:

```bash
make db-generate
make db-push
```

### 4. Start both apps

```bash
make dev
```

URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Common commands

### Development

```bash
make dev
make dev-frontend
make dev-backend
make stop
```

### Build

```bash
make build
make build-frontend
make build-backend
```

### Typecheck

```bash
make typecheck
make typecheck-frontend
make typecheck-backend
```

### Lint

```bash
make lint
make lint-frontend
```

### Frontend tests

```bash
npm run test
npm run test:watch
npx vitest run src/path/to/file.test.ts
npx vitest run -t "test name"
```

### Prisma / database

```bash
make db-generate
make db-migrate
make db-migrate-create NAME=my_change
make db-migrate-status
make db-push
make db-studio
make db-reset
```

## Architecture notes

## Frontend

### Routing
The app uses `createBrowserRouter` with separate route trees for:
- `/owner/...`
- `/vet/...`
- `/gig/...`

Important layout types:
- `RootLayout`
- `AuthLayout`
- `OnboardingLayout`
- `OwnerLayout`
- `VetLayout`
- `GigLayout`

### State model
Two state categories are used:
- **Server state** — React Query
- **Flow/session state** — Zustand persist stores

Key stores:
- `authStore`
- `ownerOnboardingStore`
- `vetOnboardingStore`
- `gigOnboardingStore`
- `addPetStore`

### Onboarding pattern
The onboarding flows use a shared route-driven pattern:
1. signup/create account first
2. persist intermediate step state in Zustand
3. validate per step with Zod
4. submit near the end of the flow
5. show a passive completion screen

The most evolved reference flow is currently the **owner onboarding flow**.

### API access
All frontend HTTP calls should go through:
- `src/lib/api.ts`

## Backend

### Layering
Backend responsibilities are split by folder:
- `routes/` — route declarations
- `controllers/` — request/response adapters
- `services/` — business logic
- `schemas/` — Zod validation
- `middleware/` — auth, validation, errors
- `config/` — env + DB bootstrap

### Database access
- Prisma schema: `backend/prisma/schema.prisma`
- Prisma client singleton: `backend/src/config/db.ts`

### API mounting
See `backend/src/index.ts` for the actual mounted route prefixes.
Current API groups include:
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

## Current product areas

### Owner
- multi-step pet onboarding
- add pet flow
- pet detail / edit
- health timeline / medical history
- vet and worker discovery
- appointments / bookings

### Vet
- onboarding
- dashboard
- appointments
- patients
- schedule
- profile/settings

### Gig Worker
- onboarding
- dashboard
- jobs
- earnings
- profile/settings

## Deployment

The repo includes:
- `Dockerfile`
- `railway.json`
- Make targets for Railway deployment

Use:

```bash
make deploy
```

or the lower-level deploy targets in the `Makefile`.
