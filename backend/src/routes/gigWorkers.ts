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
