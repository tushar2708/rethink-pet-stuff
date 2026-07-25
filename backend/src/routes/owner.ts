import { Router } from "express";
import * as petController from "../controllers/petController";
import { validate } from "../middleware/validate";
import { authMiddleware, requireRole } from "../middleware/auth";
import { ownerOnboardingSchema } from "../schemas/petSchemas";

const router = Router();

router.post(
  "/onboarding",
  authMiddleware as any,
  requireRole("owner") as any,
  validate({ body: ownerOnboardingSchema }),
  petController.ownerOnboard,
);

export default router;
