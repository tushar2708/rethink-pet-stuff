import {
  type DayOfWeek,
  type ExperienceLevel,
  type GigServiceType,
  type TimePref,
} from "@prisma/client";
import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import type {
  GigOnboardingInput,
  GigSearchQuery,
  GigUpdateInput,
} from "../schemas/gigWorkerSchemas";

const gigWorkerInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  services: true,
  timePreferences: true,
  schedules: true,
} as const;

function normalizeProfile<T extends { services: Array<{ hourlyRate: unknown }> }>(profile: T) {
  return {
    ...profile,
    services: profile.services.map((service) => ({
      ...service,
      hourlyRate: Number(service.hourlyRate),
    })),
  };
}

function buildServicesData(
  services: Array<{
    type: GigServiceType;
    experienceLevel: ExperienceLevel;
    hourlyRate: number;
  }>,
  gigProfileId: string
) {
  return services.map((service) => ({
    gigProfileId,
    type: service.type,
    experienceLevel: service.experienceLevel,
    hourlyRate: service.hourlyRate,
  }));
}

function buildTimePreferencesData(
  timePreferences: TimePref[],
  gigProfileId: string
) {
  return timePreferences.map((preference) => ({
    gigProfileId,
    preference,
  }));
}

function buildSchedulesData(
  schedule: Array<{
    day: DayOfWeek;
    enabled: boolean;
    slots: Array<{ start: string; end: string }>;
  }>,
  gigProfileId: string
) {
  return schedule.map((entry) => ({
    gigProfileId,
    day: entry.day,
    enabled: entry.enabled,
    slots: entry.slots,
  }));
}

export async function onboard(userId: string, data: GigOnboardingInput) {
  const profile = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        name: data.firstName,
        phone: data.phone,
        onboardingComplete: true,
      },
    });

    const gigProfile = await tx.gigWorkerProfile.create({
      data: {
        userId,
        firstName: data.firstName,
        bio: data.bio,
        hasPets: data.hasPets,
        petDetails: data.petDetails,
        backgroundCheckConsent: data.backgroundCheckConsent,
        coverageZip: data.coverageZip,
        coverageRadiusMiles: data.coverageRadiusMiles,
        photoUrl: data.photoUrl,
      },
    });

    await tx.gigService.createMany({
      data: buildServicesData(data.services, gigProfile.id),
    });

    await tx.gigTimePreference.createMany({
      data: buildTimePreferencesData(data.timePreferences, gigProfile.id),
    });

    await tx.schedule.createMany({
      data: buildSchedulesData(data.schedule, gigProfile.id),
    });

    return tx.gigWorkerProfile.findUnique({
      where: { id: gigProfile.id },
      include: gigWorkerInclude,
    });
  });

  if (!profile) {
    throw new AppError(500, "Failed to create gig worker profile");
  }

  return normalizeProfile(profile);
}

export async function getById(id: string) {
  const profile = await prisma.gigWorkerProfile.findUnique({
    where: { id },
    include: gigWorkerInclude,
  });

  if (!profile) {
    throw new AppError(404, "Gig worker profile not found");
  }

  return normalizeProfile(profile);
}

export async function update(id: string, userId: string, data: GigUpdateInput) {
  const existingProfile = await prisma.gigWorkerProfile.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!existingProfile) {
    throw new AppError(404, "Gig worker profile not found");
  }

  if (existingProfile.userId !== userId) {
    throw new AppError(403, "Access denied");
  }

  const profile = await prisma.$transaction(async (tx) => {
    if (data.firstName !== undefined || data.phone !== undefined) {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(data.firstName !== undefined ? { name: data.firstName } : {}),
          ...(data.phone !== undefined ? { phone: data.phone } : {}),
        },
      });
    }

    await tx.gigWorkerProfile.update({
      where: { id },
      data: {
        ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.hasPets !== undefined ? { hasPets: data.hasPets } : {}),
        ...(data.petDetails !== undefined ? { petDetails: data.petDetails } : {}),
        ...(data.backgroundCheckConsent !== undefined
          ? { backgroundCheckConsent: data.backgroundCheckConsent }
          : {}),
        ...(data.coverageZip !== undefined ? { coverageZip: data.coverageZip } : {}),
        ...(data.coverageRadiusMiles !== undefined
          ? { coverageRadiusMiles: data.coverageRadiusMiles }
          : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
      },
    });

    if (data.services !== undefined) {
      await tx.gigService.deleteMany({ where: { gigProfileId: id } });
      await tx.gigService.createMany({
        data: buildServicesData(data.services, id),
      });
    }

    if (data.timePreferences !== undefined) {
      await tx.gigTimePreference.deleteMany({ where: { gigProfileId: id } });
      await tx.gigTimePreference.createMany({
        data: buildTimePreferencesData(data.timePreferences, id),
      });
    }

    if (data.schedule !== undefined) {
      await tx.schedule.deleteMany({ where: { gigProfileId: id } });
      await tx.schedule.createMany({
        data: buildSchedulesData(data.schedule, id),
      });
    }

    return tx.gigWorkerProfile.findUnique({
      where: { id },
      include: gigWorkerInclude,
    });
  });

  if (!profile) {
    throw new AppError(500, "Failed to update gig worker profile");
  }

  return normalizeProfile(profile);
}

export async function search(query: GigSearchQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const where = {
    ...(query.serviceType
      ? {
          services: {
            some: {
              type: query.serviceType,
            },
          },
        }
      : {}),
    ...(query.zip
      ? {
          coverageZip: query.zip,
        }
      : {}),
  };

  const [workers, total] = await prisma.$transaction([
    prisma.gigWorkerProfile.findMany({
      where,
      include: gigWorkerInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.gigWorkerProfile.count({ where }),
  ]);

  return {
    workers: workers.map((worker) => normalizeProfile(worker)),
    total,
    page,
    limit,
  };
}

export async function getByUserId(userId: string) {
  const profile = await prisma.gigWorkerProfile.findUnique({
    where: { userId },
    include: gigWorkerInclude,
  });
  if (!profile) {
    throw new AppError(404, "Gig worker profile not found");
  }
  return normalizeProfile(profile);
}

export async function getAvailableJobs(userId: string) {
  const profile = await prisma.gigWorkerProfile.findUnique({
    where: { userId },
    include: { services: true },
  });
  if (!profile) throw new AppError(404, "Gig worker profile not found");

  const serviceTypes = profile.services.map((s) => s.type);

  const jobs = await prisma.appointment.findMany({
    where: {
      providerType: "gig",
      status: "pending",
      serviceType: { in: serviceTypes },
    },
    include: {
      pet: { select: { id: true, name: true, type: true, breed: true } },
      owner: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });
  return jobs;
}

export async function getActiveJobs(userId: string) {
  const jobs = await prisma.appointment.findMany({
    where: {
      providerId: userId,
      providerType: "gig",
      status: { in: ["confirmed", "in_progress"] },
    },
    include: {
      pet: { select: { id: true, name: true, type: true, breed: true } },
      owner: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });
  return jobs;
}

export async function getJobHistory(userId: string) {
  const jobs = await prisma.appointment.findMany({
    where: {
      providerId: userId,
      providerType: "gig",
      status: { in: ["completed", "cancelled"] },
    },
    include: {
      pet: { select: { id: true, name: true, type: true } },
      owner: { select: { id: true, name: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
  return jobs;
}

export async function getEarnings(userId: string) {
  const completed = await prisma.appointment.findMany({
    where: {
      providerId: userId,
      providerType: "gig",
      status: "completed",
    },
    select: { price: true, durationMinutes: true, serviceType: true, scheduledAt: true },
  });

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let total = 0;
  let thisWeek = 0;
  let thisMonth = 0;

  for (const job of completed) {
    const amount = job.price ? Number(job.price) : 0;
    total += amount;
    if (job.scheduledAt >= startOfMonth) thisMonth += amount;
    if (job.scheduledAt >= startOfWeek) thisWeek += amount;
  }

  return { total, thisWeek, thisMonth, completedJobs: completed.length };
}
