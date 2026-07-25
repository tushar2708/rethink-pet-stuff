# Type System Documentation

This directory contains all TypeScript type definitions for the PetStuff application.

## Structure

### Core Types (`src/types/`)

- **`common.ts`**: Shared types
  - `DayOfWeek` - Day enumeration (mon-sun)
  - `TimeSlot` - Time range with start/end
  - `DaySchedule` - Availability schedule
  - `Address` - Full address details

- **`user.ts`**: User identity
  - `UserRole` - User type (owner, vet, gig)
  - `User` - User profile with authentication data

- **`pet.ts`**: Pet information
  - `PetType` - Pet species
  - `Temperament` - Behavioral traits
  - `EnergyLevel` - Activity level
  - `Pet` - Complete pet profile

- **`vet.ts`**: Veterinarian profiles
  - `VetSpecialization` - 12 medical specialties
  - `VetDegree` - Educational qualification
  - `ConsultationDuration` - Session lengths (15/30/45/60 min)
  - `VetCredentials` - License and experience
  - `Clinic` - Clinic details
  - `VetProfile` - Full professional profile

- **`gig.ts`**: Gig worker profiles
  - `GigServiceType` - Service offerings
  - `ExperienceLevel` - Skill level
  - `TimePref` - Time availability preference
  - `ServiceDetail` - Individual service offering
  - `GigWorkerProfile` - Full worker profile

- **`appointment.ts`**: Appointment management
  - `AppointmentStatus` - Booking state
  - `Appointment` - Booking record

## Usage

### Import types in components
```typescript
import type { User, UserRole } from "@/types/user";
import type { Pet, PetType } from "@/types/pet";
import type { VetProfile } from "@/types/vet";
import type { GigWorkerProfile } from "@/types/gig";
import type { Appointment } from "@/types/appointment";
```

### Constants and UI options
```typescript
import { PET_TYPES, VET_SPECIALIZATIONS, GIG_SERVICES } from "@/lib/constants";

// All constants include labels and Lucide icon names
PET_TYPES.map(pet => (
  <Option key={pet.value} label={pet.label} icon={pet.icon} />
))
```

### Form validation with Zod
```typescript
import { ownerOnboardingSchema, type OwnerOnboarding } from "@/features/owner/onboarding/schemas";
import { vetOnboardingSchema, type VetOnboarding } from "@/features/vet/onboarding/schemas";
import { gigOnboardingSchema, type GigOnboarding } from "@/features/gig/onboarding/schemas";

// Validate form data
const result = ownerOnboardingSchema.safeParse(formData);
if (result.success) {
  const data: OwnerOnboarding = result.data;
}
```

## Guidelines

### Type safety
- Always use `type` imports for types (not `import`)
- Use `z.infer<typeof schema>` for Zod-derived types
- Leverage TypeScript's strict mode

### Validation
- Use step-based schemas for multi-step forms
- Combined schemas validate entire onboarding flow
- All validation rules are self-documenting in schema definition

### Constants
- Use `const` exports from `constants.ts` for UI options
- Never hardcode enum values in components
- All constants are type-safe using `satisfies` keyword

### Extending types
- Add new fields to existing types if they're in the domain
- Create new type files for new domains
- Update Zod schemas to match type changes
- Update constants when adding new options

## Related Files

- **Form schemas**: `src/features/{role}/onboarding/schemas.ts`
- **UI constants**: `src/lib/constants.ts`
- **API integration**: `src/api/` (to be created)
- **State management**: `src/stores/` (uses these types)
