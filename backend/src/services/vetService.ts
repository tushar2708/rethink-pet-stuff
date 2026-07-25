import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import type { VetOnboardingInput, VetUpdateInput, VetSearchQuery } from "../schemas/vetSchemas";
import type { VetDegree, VetSpecializationType, DayOfWeek } from "@prisma/client";

type VetProfileWithRelations = Awaited<ReturnType<typeof getById>>;

const vetProfileInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  clinics: true,
  specializations: true,
  schedules: true,
} as const;

export async function onboard(userId: string, data: VetOnboardingInput) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        onboardingComplete: true,
      },
    });

    const vetProfile = await tx.vetProfile.create({
      data: {
        userId,
        useDrPrefix: data.useDrPrefix,
        licenseNumber: data.licenseNumber,
        issuingAuthority: data.issuingAuthority,
        yearsOfPractice: data.yearsOfPractice,
        degree: data.degree as VetDegree,
        licenseDocUrl: data.licenseDocUrl,
        bio: data.bio,
        photoUrl: data.profilePhotoUrl,
        consultationDuration: data.consultationDuration,
      },
    });

    await tx.clinic.create({
      data: {
        vetProfileId: vetProfile.id,
        name: data.clinicName,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        phone: data.clinicPhone,
        website: data.website || null,
        logoUrl: data.clinicLogoUrl,
      },
    });

    await tx.vetSpecialization.createMany({
      data: data.specializations.map((specialization) => ({
        vetProfileId: vetProfile.id,
        specialization: specialization as VetSpecializationType,
      })),
    });

    await tx.schedule.createMany({
      data: data.schedule.map((schedule) => ({
        vetProfileId: vetProfile.id,
        day: schedule.day as DayOfWeek,
        enabled: schedule.enabled,
        slots: schedule.slots,
      })),
    });

    const createdVetProfile = await tx.vetProfile.findUnique({
      where: { id: vetProfile.id },
      include: vetProfileInclude,
    });

    if (!createdVetProfile) {
      throw new AppError(404, "Vet profile not found");
    }

    return createdVetProfile;
  });
}

export async function getById(id: string) {
  const vetProfile = await prisma.vetProfile.findUnique({
    where: { id },
    include: vetProfileInclude,
  });

  if (!vetProfile) {
    throw new AppError(404, "Vet profile not found");
  }

  return vetProfile;
}

export async function update(id: string, userId: string, data: VetUpdateInput) {
  return prisma.$transaction(async (tx) => {
    const existingVetProfile = await tx.vetProfile.findUnique({
      where: { id },
      include: {
        clinics: true,
      },
    });

    if (!existingVetProfile) {
      throw new AppError(404, "Vet profile not found");
    }

    if (existingVetProfile.userId !== userId) {
      throw new AppError(403, "Access denied");
    }

    if (data.name !== undefined || data.phone !== undefined) {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.phone !== undefined ? { phone: data.phone } : {}),
        },
      });
    }

    await tx.vetProfile.update({
      where: { id },
      data: {
        ...(data.useDrPrefix !== undefined ? { useDrPrefix: data.useDrPrefix } : {}),
        ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
        ...(data.issuingAuthority !== undefined ? { issuingAuthority: data.issuingAuthority } : {}),
        ...(data.yearsOfPractice !== undefined ? { yearsOfPractice: data.yearsOfPractice } : {}),
        ...(data.degree !== undefined ? { degree: data.degree as VetDegree } : {}),
        ...(data.licenseDocUrl !== undefined ? { licenseDocUrl: data.licenseDocUrl } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.profilePhotoUrl !== undefined ? { photoUrl: data.profilePhotoUrl } : {}),
        ...(data.consultationDuration !== undefined
          ? { consultationDuration: data.consultationDuration }
          : {}),
      },
    });

    const clinicUpdateRequested =
      data.clinicName !== undefined ||
      data.street !== undefined ||
      data.city !== undefined ||
      data.state !== undefined ||
      data.zip !== undefined ||
      data.clinicPhone !== undefined ||
      data.website !== undefined ||
      data.clinicLogoUrl !== undefined;

    if (clinicUpdateRequested) {
      const clinic = existingVetProfile.clinics[0];

      if (!clinic) {
        throw new AppError(404, "Clinic not found");
      }

      await tx.clinic.update({
        where: { id: clinic.id },
        data: {
          ...(data.clinicName !== undefined ? { name: data.clinicName } : {}),
          ...(data.street !== undefined ? { street: data.street } : {}),
          ...(data.city !== undefined ? { city: data.city } : {}),
          ...(data.state !== undefined ? { state: data.state } : {}),
          ...(data.zip !== undefined ? { zip: data.zip } : {}),
          ...(data.clinicPhone !== undefined ? { phone: data.clinicPhone } : {}),
          ...(data.website !== undefined ? { website: data.website || null } : {}),
          ...(data.clinicLogoUrl !== undefined ? { logoUrl: data.clinicLogoUrl } : {}),
        },
      });
    }

    if (data.specializations !== undefined) {
      await tx.vetSpecialization.deleteMany({
        where: { vetProfileId: id },
      });

      await tx.vetSpecialization.createMany({
        data: data.specializations.map((specialization) => ({
          vetProfileId: id,
          specialization: specialization as VetSpecializationType,
        })),
      });
    }

    if (data.schedule !== undefined) {
      await tx.schedule.deleteMany({
        where: { vetProfileId: id },
      });

      await tx.schedule.createMany({
        data: data.schedule.map((schedule) => ({
          vetProfileId: id,
          day: schedule.day as DayOfWeek,
          enabled: schedule.enabled,
          slots: schedule.slots,
        })),
      });
    }

    const updatedVetProfile = await tx.vetProfile.findUnique({
      where: { id },
      include: vetProfileInclude,
    });

    if (!updatedVetProfile) {
      throw new AppError(404, "Vet profile not found");
    }

    return updatedVetProfile;
  });
}

export async function search(query: VetSearchQuery): Promise<{
  vets: VetProfileWithRelations[];
  total: number;
  page: number;
  limit: number;
}> {
  const where = {
    ...(query.specialization
      ? {
          specializations: {
            some: {
              specialization: query.specialization as VetSpecializationType,
            },
          },
        }
      : {}),
    ...(query.city || query.state
      ? {
          clinics: {
            some: {
              ...(query.city ? { city: { contains: query.city, mode: "insensitive" as const } } : {}),
              ...(query.state ? { state: { equals: query.state, mode: "insensitive" as const } } : {}),
            },
          },
        }
      : {}),
  };

  const skip = (query.page - 1) * query.limit;
  const take = query.limit;

  const [vets, total] = await Promise.all([
    prisma.vetProfile.findMany({
      where,
      include: vetProfileInclude,
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.vetProfile.count({ where }),
  ]);

  return {
    vets,
    total,
    page: query.page,
    limit: query.limit,
  };
}

export async function getByUserId(userId: string) {
  const vetProfile = await prisma.vetProfile.findUnique({
    where: { userId },
    include: vetProfileInclude,
  });
  if (!vetProfile) {
    throw new AppError(404, "Vet profile not found");
  }
  return vetProfile;
}

export async function getPatients(userId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { providerId: userId, providerType: "vet" },
    include: {
      pet: {
        include: {
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });

  const petMap = new Map<string, (typeof appointments)[number]["pet"]>();
  for (const appt of appointments) {
    if (!petMap.has(appt.pet.id)) {
      petMap.set(appt.pet.id, appt.pet);
    }
  }
  return Array.from(petMap.values());
}

export async function getPatientDetail(userId: string, petId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { providerId: userId, petId, providerType: "vet" },
    include: {
      pet: true,
      owner: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
  if (appointments.length === 0) {
    throw new AppError(404, "No records found for this patient");
  }
  return { pet: appointments[0]!.pet, appointments };
}

export async function updateSchedule(
  userId: string,
  schedule: Array<{ day: string; enabled: boolean; slots: any }>
) {
  const vetProfile = await prisma.vetProfile.findUnique({ where: { userId } });
  if (!vetProfile) throw new AppError(404, "Vet profile not found");

  await prisma.$transaction(async (tx) => {
    await tx.schedule.deleteMany({ where: { vetProfileId: vetProfile.id } });
    await tx.schedule.createMany({
      data: schedule.map((s) => ({
        vetProfileId: vetProfile.id,
        day: s.day as any,
        enabled: s.enabled,
        slots: s.slots,
      })),
    });
  });

  return prisma.vetProfile.findUnique({
    where: { id: vetProfile.id },
    include: vetProfileInclude,
  });
}
