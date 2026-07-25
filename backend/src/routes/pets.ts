import { Router } from "express";
import * as petController from "../controllers/petController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import {
  createPetSchema,
  updatePetSchema,
  petIdParamSchema,
  petQuerySchema,
} from "../schemas/petSchemas";

const router = Router();

router.use(authMiddleware as any);

router.post("/", validate({ body: createPetSchema }), petController.create);
router.get("/", validate({ query: petQuerySchema }), petController.list);
router.get("/:id", validate({ params: petIdParamSchema }), petController.getById);
router.put(
  "/:id",
  validate({ params: petIdParamSchema, body: updatePetSchema }),
  petController.update,
);
router.delete("/:id", validate({ params: petIdParamSchema }), petController.remove);

// Nested health + medical routes
import healthRoutes from "./health";
import medicalEventRoutes from "./medicalEvents";
router.use("/", healthRoutes);
router.use("/", medicalEventRoutes);

export default router;
