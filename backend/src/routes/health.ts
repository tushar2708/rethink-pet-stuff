import { Router } from "express";
import * as healthController from "../controllers/healthController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  createHealthRecordSchema,
  updateHealthRecordSchema,
} from "../schemas/healthSchemas";

const router = Router();

router.get(
  "/:petId/health-timeline",
  authMiddleware as any,
  healthController.getTimeline
);
router.get(
  "/:petId/health-records",
  authMiddleware as any,
  healthController.getRecords
);
router.post(
  "/:petId/health-records",
  authMiddleware as any,
  validate({ body: createHealthRecordSchema }),
  healthController.createRecord
);
router.put(
  "/:petId/health-records/:recordId",
  authMiddleware as any,
  validate({ body: updateHealthRecordSchema }),
  healthController.updateRecord
);

export default router;
