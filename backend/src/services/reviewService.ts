import { prisma } from "../config/db";
import { AppError } from "../middleware/errorHandler";
import type { CreateReviewInput, ReviewQuery } from "../schemas/reviewSchemas";

export async function createReview(reviewerId: string, data: CreateReviewInput) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
  });
  if (!appointment) throw new AppError(404, "Appointment not found");
  if (appointment.status !== "completed") throw new AppError(400, "Can only review completed appointments");
  if (appointment.ownerId !== reviewerId) throw new AppError(403, "Only the pet owner can leave a review");

  const revieweeId = appointment.providerId;

  const review = await prisma.review.create({
    data: {
      appointmentId: data.appointmentId,
      reviewerId,
      revieweeId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      reviewer: { select: { id: true, name: true } },
    },
  });

  const agg = await prisma.review.aggregate({
    where: { revieweeId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  if (appointment.providerType === "vet") {
    await prisma.vetProfile.updateMany({
      where: { userId: revieweeId },
      data: { rating: agg._avg.rating, reviewCount: agg._count.rating },
    });
  } else {
    await prisma.gigWorkerProfile.updateMany({
      where: { userId: revieweeId },
      data: { rating: agg._avg.rating, reviewCount: agg._count.rating },
    });
  }

  return review;
}

export async function getReviews(query: ReviewQuery) {
  const where = {
    ...(query.revieweeId ? { revieweeId: query.revieweeId } : {}),
  };
  const skip = (query.page - 1) * query.limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
        appointment: { select: { id: true, serviceType: true, scheduledAt: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, total, page: query.page, limit: query.limit };
}
