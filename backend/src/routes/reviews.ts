import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { createReviewSchema, reviewQuerySchema } from "../schemas/reviewSchemas";

const router = Router();

router.post("/", authMiddleware as any, validate({ body: createReviewSchema }), reviewController.create);
router.get("/", validate({ query: reviewQuerySchema }), reviewController.list);

export default router;
