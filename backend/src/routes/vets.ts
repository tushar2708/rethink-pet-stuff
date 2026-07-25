import { Router } from "express";
import * as vetController from "../controllers/vetController";
import { validate } from "../middleware/validate";
import { authMiddleware, requireRole } from "../middleware/auth";
import {
  vetOnboardingSchema,
  vetUpdateSchema,
  vetSearchQuerySchema,
  idParamSchema,
} from "../schemas/vetSchemas";

export const vetOnboardingRouter = Router();

vetOnboardingRouter.post(
  "/onboarding",
  authMiddleware as any,
  requireRole("vet") as any,
  validate({ body: vetOnboardingSchema }),
  vetController.onboard,
);

export const vetRouter = Router();

vetRouter.get("/search", validate({ query: vetSearchQuerySchema }), vetController.search);
vetRouter.get("/:id", validate({ params: idParamSchema }), vetController.getById);
vetRouter.put(
  "/:id",
  authMiddleware as any,
  requireRole("vet") as any,
  validate({ params: idParamSchema, body: vetUpdateSchema }),
  vetController.update,
);
