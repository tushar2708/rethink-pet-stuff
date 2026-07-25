import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { toDbTemperament, toApiTemperament } from "../lib/enumMappers";
import type {
  CreatePetInput,
  UpdatePetInput,
  OwnerOnboardingInput,
} from "../schemas/petSchemas";
import type { EnergyLevel, PetType } from "@prisma/client";

function sanitizePet(pet: any) {
  return {
    ...pet,
    temperament: toApiTemperament(pet.temperament),
  };
}

export async function createPet(ownerId: string, data: CreatePetInput) {
  const pet = await prisma.pet.create({
    data: {
      ownerId,
      name: data.name,
      type: data.type as PetType,
      customType: data.customType,
      breed: data.breed,
      ageYears: data.ageYears,
      ageMonths: data.ageMonths,
      temperament: toDbTemperament(data.temperament),
      energyLevel: data.energyLevel as EnergyLevel,
      photoUrl: data.photoUrl,
    },
  });

  return sanitizePet(pet);
}

export async function getPetsByOwner(ownerId: string) {
  const pets = await prisma.pet.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });

  return pets.map(sanitizePet);
}

export async function getPetById(id: string) {
  const pet = await prisma.pet.findUnique({ where: { id } });

  if (!pet) {
    throw new AppError(404, "Pet not found");
  }

  return sanitizePet(pet);
}

export async function updatePet(id: string, ownerId: string, data: UpdatePetInput) {
  const existingPet = await prisma.pet.findUnique({ where: { id } });

  if (!existingPet) {
    throw new AppError(404, "Pet not found");
  }

  if (existingPet.ownerId !== ownerId) {
    throw new AppError(403, "Not your pet");
  }

  const updatedPet = await prisma.pet.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.type !== undefined ? { type: data.type as PetType } : {}),
      ...(data.customType !== undefined ? { customType: data.customType } : {}),
      ...(data.breed !== undefined ? { breed: data.breed } : {}),
      ...(data.ageYears !== undefined ? { ageYears: data.ageYears } : {}),
      ...(data.ageMonths !== undefined ? { ageMonths: data.ageMonths } : {}),
      ...(data.temperament !== undefined
        ? { temperament: toDbTemperament(data.temperament) }
        : {}),
      ...(data.energyLevel !== undefined
        ? { energyLevel: data.energyLevel as EnergyLevel }
        : {}),
      ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
    },
  });

  return sanitizePet(updatedPet);
}

export async function deletePet(id: string, ownerId: string) {
  const existingPet = await prisma.pet.findUnique({ where: { id } });

  if (!existingPet) {
    throw new AppError(404, "Pet not found");
  }

  if (existingPet.ownerId !== ownerId) {
    throw new AppError(403, "Not your pet");
  }

  await prisma.pet.delete({ where: { id } });
}

export async function ownerOnboard(userId: string, data: OwnerOnboardingInput) {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        onboardingComplete: true,
      },
    });

    const pet = await tx.pet.create({
      data: {
        ownerId: userId,
        name: data.petName,
        type: data.petType as PetType,
        customType: data.customType,
        breed: data.breed,
        ageYears: data.ageYears,
        ageMonths: data.ageMonths,
        temperament: toDbTemperament(data.temperament),
        energyLevel: data.energyLevel as EnergyLevel,
        photoUrl: data.petPhoto,
      },
    });

    return { user, pet };
  });

  const { passwordHash, ...sanitizedUser } = result.user;

  return {
    user: sanitizedUser,
    pet: sanitizePet(result.pet),
  };
}
