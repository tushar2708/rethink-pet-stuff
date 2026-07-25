import { Router } from "express";
import * as gigWorkerController from "../controllers/gigWorkerController";
import { validate } from "../middleware/validate";
import { authMiddleware, requireRole } from "../middleware/auth";
import {
  gigOnboardingSchema,
  gigUpdateSchema,
  gigSearchQuerySchema,
} from "../schemas/gigWorkerSchemas";
import { idParamSchema } from "../schemas/vetSchemas";

export const gigOnboardingRouter = Router();

gigOnboardingRouter.post(
  "/onboarding",
  authMiddleware as any,
  requireRole("gig") as any,
  validate({ body: gigOnboardingSchema }),
  gigWorkerController.onboard,
);

export const gigWorkerRouter = Router();

// Authenticated gig worker's own endpoints — MUST be before /:id
gigWorkerRouter.get("/me", authMiddleware as any, requireRole("gig") as any, gigWorkerController.getMyProfile);
gigWorkerRouter.get("/me/jobs/available", authMiddleware as any, requireRole("gig") as any, gigWorkerController.getAvailableJobs);
gigWorkerRouter.get("/me/jobs/active", authMiddleware as any, requireRole("gig") as any, gigWorkerController.getActiveJobs);
gigWorkerRouter.get("/me/jobs/history", authMiddleware as any, requireRole("gig") as any, gigWorkerController.getJobHistory);
gigWorkerRouter.get("/me/earnings", authMiddleware as any, requireRole("gig") as any, gigWorkerController.getEarnings);

gigWorkerRouter.get(
  "/search",
  validate({ query: gigSearchQuerySchema }),
  gigWorkerController.search,
);
gigWorkerRouter.get("/:id", validate({ params: idParamSchema }), gigWorkerController.getById);
gigWorkerRouter.put(
  "/:id",
  authMiddleware as any,
  requireRole("gig") as any,
  validate({ params: idParamSchema, body: gigUpdateSchema }),
  gigWorkerController.update,
);
