import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import type {
  CreateMedicalEventInput,
  UpdateMedicalEventInput,
} from "../schemas/medicalEventSchemas";

export async function getEvents(petId: string, userId: string) {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new AppError(404, "Pet not found");
  }
  if (pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this pet");
  }

  return prisma.petMedicalEvent.findMany({
    where: { petId },
    include: { veterinarian: true },
    orderBy: { dateOccurred: "desc" },
  });
}

export async function createEvent(
  petId: string,
  userId: string,
  data: CreateMedicalEventInput
) {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new AppError(404, "Pet not found");
  }
  if (pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this pet");
  }

  return prisma.petMedicalEvent.create({
    data: {
      petId,
      eventType: data.eventType,
      name: data.name,
      dateOccurred: data.dateOccurred ? new Date(data.dateOccurred) : undefined,
      severity: data.severity,
      outcome: data.outcome,
      details: data.details,
      documentUrl: data.documentUrl,
      notes: data.notes,
    },
  });
}

export async function updateEvent(
  eventId: string,
  userId: string,
  data: UpdateMedicalEventInput
) {
  const event = await prisma.petMedicalEvent.findUnique({
    where: { id: eventId },
    include: { pet: true },
  });
  if (!event) {
    throw new AppError(404, "Medical event not found");
  }
  if (event.pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this event");
  }

  return prisma.petMedicalEvent.update({
    where: { id: eventId },
    data: {
      eventType: data.eventType,
      name: data.name,
      dateOccurred: data.dateOccurred ? new Date(data.dateOccurred) : undefined,
      severity: data.severity,
      outcome: data.outcome,
      details: data.details,
      documentUrl: data.documentUrl,
      notes: data.notes,
    },
  });
}

export async function deleteEvent(eventId: string, userId: string) {
  const event = await prisma.petMedicalEvent.findUnique({
    where: { id: eventId },
    include: { pet: true },
  });
  if (!event) {
    throw new AppError(404, "Medical event not found");
  }
  if (event.pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this event");
  }

  return prisma.petMedicalEvent.delete({ where: { id: eventId } });
}
