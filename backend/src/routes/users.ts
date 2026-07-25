import { Router } from "express";
import * as userController from "../controllers/userController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { updateProfileSchema } from "../schemas/userSchemas";

const router = Router();

router.use(authMiddleware as any);

router.put("/me", validate({ body: updateProfileSchema }), userController.updateProfile);

export default router;
