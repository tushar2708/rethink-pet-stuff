import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import type {
  HealthTemplateQuery,
  CreateHealthRecordInput,
  UpdateHealthRecordInput,
} from "../schemas/healthSchemas";

export async function getHealthTemplates(query: HealthTemplateQuery) {
  const templates = await prisma.healthPlanTemplate.findMany({
    where: { petType: query.petType },
    orderBy: [{ lifeStage: "asc" }, { sortOrder: "asc" }],
  });

  return templates.filter((template) => {
    const condition = template.triggerCondition as Record<string, any> | null;
    if (!condition || Object.keys(condition).length === 0) {
      return true;
    }

    if (condition.lifestyle && query.lifestyle !== condition.lifestyle) {
      return false;
    }
    if (condition.gender && query.gender !== condition.gender) {
      return false;
    }
    if (
      condition.breed &&
      Array.isArray(condition.breed) &&
      query.breed &&
      !condition.breed.includes(query.breed)
    ) {
      return false;
    }
    if (condition.breed && Array.isArray(condition.breed) && !query.breed) {
      return false;
    }

    return true;
  });
}

export async function getHealthTimeline(petId: string, userId: string) {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new AppError(404, "Pet not found");
  }
  if (pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this pet");
  }

  const templates = await getHealthTemplates({
    petType: pet.type,
    lifestyle: (pet as any).lifestyle,
    gender: (pet as any).gender,
    breed: pet.breed ?? undefined,
  });

  let records = await prisma.petPreventiveCare.findMany({
    where: { petId },
    include: { template: true },
  });

  if (records.length === 0) {
    await generateHealthPlan(petId);
    records = await prisma.petPreventiveCare.findMany({
      where: { petId },
      include: { template: true },
    });
  }

  const now = new Date();
  const groups: Record<string, any[]> = {};
  let nextUp: any = null;

  for (const template of templates) {
    const matchingRecord = records.find((r) => r.templateId === template.id);

    let dateDue: Date | null = null;
    if (pet.dateOfBirth && template.recommendedAgeWeeks) {
      dateDue = new Date(pet.dateOfBirth.getTime() + template.recommendedAgeWeeks * 7 * 24 * 60 * 60 * 1000);
    }

    let status = "upcoming";
    if (matchingRecord) {
      status = matchingRecord.status;
    } else if (dateDue && dateDue < now) {
      status = "overdue";
    }

    const item = {
      templateId: template.id,
      name: template.name,
      careType: template.category,
      lifeStage: template.lifeStage,
      recommendedAgeWeeks: template.recommendedAgeWeeks,
      dateDue,
      status,
      record: matchingRecord || null,
    };

    const stage = template.lifeStage || "general";
    if (!groups[stage]) {
      groups[stage] = [];
    }
    groups[stage].push(item);

    if (!nextUp && (status === "overdue" || status === "upcoming")) {
      nextUp = item;
    }
  }

  return {
    ...groups,
    nextUp,
  };
}

export async function getHealthRecords(petId: string) {
  return prisma.petPreventiveCare.findMany({
    where: { petId },
    include: { template: true },
  });
}

export async function createHealthRecord(
  petId: string,
  userId: string,
  data: CreateHealthRecordInput
) {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new AppError(404, "Pet not found");
  }
  if (pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this pet");
  }

  return prisma.petPreventiveCare.create({
    data: {
      petId,
      templateId: data.templateId,
      name: data.name,
      careType: data.careType,
      status: data.status,
      dateDue: data.dateDue ? new Date(data.dateDue) : undefined,
      datePerformed: data.datePerformed ? new Date(data.datePerformed) : undefined,
      details: data.details,
      documentUrl: data.documentUrl,
    },
  });
}

export async function updateHealthRecord(
  recordId: string,
  userId: string,
  data: UpdateHealthRecordInput
) {
  const record = await prisma.petPreventiveCare.findUnique({
    where: { id: recordId },
    include: { pet: true },
  });
  if (!record) {
    throw new AppError(404, "Health record not found");
  }
  if (record.pet.ownerId !== userId) {
    throw new AppError(403, "You do not have access to this record");
  }

  return prisma.petPreventiveCare.update({
    where: { id: recordId },
    data: {
      status: data.status,
      datePerformed: data.datePerformed ? new Date(data.datePerformed) : undefined,
      details: data.details,
      documentUrl: data.documentUrl,
    },
  });
}

export async function generateHealthPlan(petId: string) {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new AppError(404, "Pet not found");
  }

  const templates = await getHealthTemplates({
    petType: pet.type,
    lifestyle: (pet as any).lifestyle,
    gender: (pet as any).gender,
    breed: pet.breed ?? undefined,
  });

  const existingRecords = await prisma.petPreventiveCare.findMany({
    where: { petId },
    select: { templateId: true },
  });
  const existingTemplateIds = new Set(existingRecords.map((r) => r.templateId));

  const newRecords = [];
  for (const template of templates) {
    if (existingTemplateIds.has(template.id)) {
      continue;
    }

    let dateDue: Date | undefined;
    if (pet.dateOfBirth && template.recommendedAgeWeeks) {
      dateDue = new Date(pet.dateOfBirth.getTime() + template.recommendedAgeWeeks * 7 * 24 * 60 * 60 * 1000);
    }

    newRecords.push(
      prisma.petPreventiveCare.create({
        data: {
          petId,
          templateId: template.id,
          name: template.name,
          careType: template.category,
          status: "scheduled",
          dateDue,
        },
      })
    );
  }

  return Promise.all(newRecords);
}
