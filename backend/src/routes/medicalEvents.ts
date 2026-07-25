import { Router } from "express";
import * as medicalEventController from "../controllers/medicalEventController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  createMedicalEventSchema,
  updateMedicalEventSchema,
} from "../schemas/medicalEventSchemas";

const router = Router();
router.get(
  "/:petId/medical-events",
  authMiddleware as any,
  medicalEventController.list
);
router.post(
  "/:petId/medical-events",
  authMiddleware as any,
  validate({ body: createMedicalEventSchema }),
  medicalEventController.create
);
router.put(
  "/:petId/medical-events/:eventId",
  authMiddleware as any,
  validate({ body: updateMedicalEventSchema }),
  medicalEventController.update
);
router.delete(
  "/:petId/medical-events/:eventId",
  authMiddleware as any,
  medicalEventController.remove
);
export default router;
