-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'vet', 'gig');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('dog', 'cat', 'bird', 'hamster', 'other');

-- CreateEnum
CREATE TYPE "Temperament" AS ENUM ('calm', 'needs_warming_up');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "VetDegree" AS ENUM ('DVM', 'VMD', 'BVSc', 'other');

-- CreateEnum
CREATE TYPE "VetSpecializationType" AS ENUM ('general', 'surgery', 'dermatology', 'dentistry', 'oncology', 'exotic', 'emergency', 'behavioral', 'nutrition', 'cardiology', 'ophthalmology', 'orthopedics');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

-- CreateEnum
CREATE TYPE "GigServiceType" AS ENUM ('walking', 'sitting', 'grooming', 'taxi', 'training');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('beginner', 'intermediate', 'expert');

-- CreateEnum
CREATE TYPE "TimePref" AS ENUM ('morning', 'afternoon', 'evening', 'flexible');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('vet', 'gig');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "avatarUrl" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PetType" NOT NULL,
    "customType" TEXT,
    "breed" TEXT,
    "ageYears" INTEGER,
    "ageMonths" INTEGER,
    "temperament" "Temperament" NOT NULL,
    "energyLevel" "EnergyLevel" NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vet_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "useDrPrefix" BOOLEAN NOT NULL DEFAULT false,
    "licenseNumber" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    "yearsOfPractice" INTEGER NOT NULL,
    "degree" "VetDegree" NOT NULL,
    "licenseDocUrl" TEXT,
    "bio" VARCHAR(300) NOT NULL,
    "photoUrl" TEXT,
    "consultationDuration" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" UUID NOT NULL,
    "vetProfileId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "zip" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vet_specializations" (
    "vetProfileId" UUID NOT NULL,
    "specialization" "VetSpecializationType" NOT NULL,

    CONSTRAINT "vet_specializations_pkey" PRIMARY KEY ("vetProfileId","specialization")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "vetProfileId" UUID,
    "gigProfileId" UUID,
    "day" "DayOfWeek" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "slots" JSONB NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gig_worker_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "bio" VARCHAR(200) NOT NULL,
    "hasPets" BOOLEAN NOT NULL DEFAULT false,
    "petDetails" TEXT,
    "backgroundCheckConsent" BOOLEAN NOT NULL DEFAULT false,
    "coverageZip" TEXT NOT NULL,
    "coverageRadiusMiles" INTEGER NOT NULL,
    "photoUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gig_worker_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gig_services" (
    "id" UUID NOT NULL,
    "gigProfileId" UUID NOT NULL,
    "type" "GigServiceType" NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "gig_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gig_time_preferences" (
    "gigProfileId" UUID NOT NULL,
    "preference" "TimePref" NOT NULL,

    CONSTRAINT "gig_time_preferences_pkey" PRIMARY KEY ("gigProfileId","preference")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "providerId" UUID NOT NULL,
    "providerType" "ProviderType" NOT NULL,
    "serviceType" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vet_profiles_userId_key" ON "vet_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "gig_worker_profiles_userId_key" ON "gig_worker_profiles"("userId");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vet_profiles" ADD CONSTRAINT "vet_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_vetProfileId_fkey" FOREIGN KEY ("vetProfileId") REFERENCES "vet_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vet_specializations" ADD CONSTRAINT "vet_specializations_vetProfileId_fkey" FOREIGN KEY ("vetProfileId") REFERENCES "vet_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_vetProfileId_fkey" FOREIGN KEY ("vetProfileId") REFERENCES "vet_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_gigProfileId_fkey" FOREIGN KEY ("gigProfileId") REFERENCES "gig_worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gig_worker_profiles" ADD CONSTRAINT "gig_worker_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gig_services" ADD CONSTRAINT "gig_services_gigProfileId_fkey" FOREIGN KEY ("gigProfileId") REFERENCES "gig_worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gig_time_preferences" ADD CONSTRAINT "gig_time_preferences_gigProfileId_fkey" FOREIGN KEY ("gigProfileId") REFERENCES "gig_worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
