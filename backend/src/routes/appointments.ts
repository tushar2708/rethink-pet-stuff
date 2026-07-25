import { Router } from "express";
import * as appointmentController from "../controllers/appointmentController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentQuerySchema,
  appointmentIdParamSchema,
} from "../schemas/appointmentSchemas";

const router = Router();

router.use(authMiddleware as any);

router.post("/", validate({ body: createAppointmentSchema }), appointmentController.create);
router.get("/", validate({ query: appointmentQuerySchema }), appointmentController.list);
router.get(
  "/:id",
  validate({ params: appointmentIdParamSchema }),
  appointmentController.getById,
);
router.put(
  "/:id",
  validate({ params: appointmentIdParamSchema, body: updateAppointmentSchema }),
  appointmentController.update,
);

export default router;
