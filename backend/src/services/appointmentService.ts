import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { toDbStatus, toApiStatus } from "../lib/enumMappers";
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentQuery,
} from "../schemas/appointmentSchemas";
import type { AppointmentStatus } from "@prisma/client";

const appointmentInclude = {
  pet: {
    select: {
      id: true,
      name: true,
      type: true,
    },
  },
  owner: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  provider: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} as const;

function sanitizeAppointment(appointment: any) {
  return {
    ...appointment,
    status: toApiStatus(appointment.status),
  };
}

export async function create(ownerId: string, data: CreateAppointmentInput) {
  const pet = await prisma.pet.findFirst({
    where: {
      id: data.petId,
      ownerId,
    },
  });

  if (!pet) {
    throw new AppError(404, "Pet not found or not yours");
  }

  const provider = await prisma.user.findUnique({
    where: {
      id: data.providerId,
    },
  });

  if (!provider) {
    throw new AppError(404, "Provider not found");
  }

  if (provider.role !== data.providerType) {
    throw new AppError(400, "Provider type mismatch");
  }

  const appointment = await prisma.appointment.create({
    data: {
      petId: data.petId,
      ownerId,
      providerId: data.providerId,
      providerType: data.providerType,
      serviceType: data.serviceType,
      scheduledAt: new Date(data.scheduledAt),
      durationMinutes: data.durationMinutes,
      notes: data.notes,
      price: data.price,
    },
    include: appointmentInclude,
  });

  return sanitizeAppointment(appointment);
}

export async function getFiltered(userId: string, query: AppointmentQuery) {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;

  const where = {
    OR: [{ ownerId: userId }, { providerId: userId }],
    ...(query.status ? { status: toDbStatus(query.status) } : {}),
    ...(query.ownerId ? { ownerId: query.ownerId } : {}),
    ...(query.providerId ? { providerId: query.providerId } : {}),
  };

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: appointmentInclude,
      orderBy: {
        scheduledAt: "asc",
      },
      skip,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    appointments: appointments.map(sanitizeAppointment),
    total,
    page,
    limit,
  };
}

export async function getById(id: string, userId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: appointmentInclude,
  });

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  if (appointment.ownerId !== userId && appointment.providerId !== userId) {
    throw new AppError(403, "Access denied");
  }

  return sanitizeAppointment(appointment);
}

const allowedTransitions: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  pending: "confirmed",
  confirmed: "in_progress",
  in_progress: "completed",
};

export async function updateStatus(id: string, userId: string, data: UpdateAppointmentInput) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: appointmentInclude,
  });

  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  const isOwner = appointment.ownerId === userId;
  const isProvider = appointment.providerId === userId;

  if (!isOwner && !isProvider) {
    throw new AppError(403, "Access denied");
  }

  const newStatus = toDbStatus(data.status);
  const currentStatus = appointment.status;

  if (currentStatus === "completed" || currentStatus === "cancelled") {
    throw new AppError(
      400,
      `Cannot modify a ${toApiStatus(currentStatus)} appointment`
    );
  }

  if (newStatus !== "cancelled" && !isProvider) {
    throw new AppError(403, "Only the provider can perform this action");
  }

  const isValidTransition =
    newStatus === "cancelled" || allowedTransitions[currentStatus] === newStatus;

  if (!isValidTransition) {
    throw new AppError(
      400,
      `Cannot transition from ${toApiStatus(currentStatus)} to ${toApiStatus(newStatus)}`
    );
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      status: newStatus,
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
    },
    include: appointmentInclude,
  });

  return sanitizeAppointment(updatedAppointment);
}
