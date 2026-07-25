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

// Authenticated vet's own profile — MUST be before /:id
vetRouter.get("/me", authMiddleware as any, requireRole("vet") as any, vetController.getMyProfile);
vetRouter.get("/me/patients", authMiddleware as any, requireRole("vet") as any, vetController.getPatients);
vetRouter.get("/me/patients/:petId", authMiddleware as any, requireRole("vet") as any, vetController.getPatientDetail);
vetRouter.put("/me/schedule", authMiddleware as any, requireRole("vet") as any, vetController.updateSchedule);

vetRouter.get("/search", validate({ query: vetSearchQuerySchema }), vetController.search);
vetRouter.get("/:id", validate({ params: idParamSchema }), vetController.getById);
vetRouter.put(
  "/:id",
  authMiddleware as any,
  requireRole("vet") as any,
  validate({ params: idParamSchema, body: vetUpdateSchema }),
  vetController.update,
);
