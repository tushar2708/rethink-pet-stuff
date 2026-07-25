-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "price" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "isNeutered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lifestyle" TEXT,
ADD COLUMN     "weightKg" DECIMAL(5,2);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "appointmentId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "revieweeId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breed_catalog" (
    "id" UUID NOT NULL,
    "petType" "PetType" NOT NULL,
    "name" TEXT NOT NULL,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "breed_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_plan_templates" (
    "id" UUID NOT NULL,
    "petType" "PetType" NOT NULL,
    "breedGroup" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "triggerCondition" JSONB NOT NULL,
    "lifeStage" TEXT NOT NULL,
    "recommendedAgeWeeks" INTEGER,
    "repeatIntervalWeeks" INTEGER,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "health_plan_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_preventive_care" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "templateId" UUID,
    "name" TEXT NOT NULL,
    "careType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "dateDue" TIMESTAMP(3),
    "datePerformed" TIMESTAMP(3),
    "veterinarianId" UUID,
    "details" JSONB,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_preventive_care_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_medical_events" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOccurred" TIMESTAMP(3),
    "dateResolved" TIMESTAMP(3),
    "veterinarianId" UUID,
    "severity" TEXT,
    "outcome" TEXT,
    "details" JSONB,
    "documentUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_medical_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_appointmentId_reviewerId_key" ON "reviews"("appointmentId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "breed_catalog_petType_name_key" ON "breed_catalog"("petType", "name");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_preventive_care" ADD CONSTRAINT "pet_preventive_care_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_preventive_care" ADD CONSTRAINT "pet_preventive_care_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "health_plan_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_preventive_care" ADD CONSTRAINT "pet_preventive_care_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_medical_events" ADD CONSTRAINT "pet_medical_events_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_medical_events" ADD CONSTRAINT "pet_medical_events_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
