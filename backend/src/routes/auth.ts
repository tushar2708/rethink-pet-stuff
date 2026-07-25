import { Router } from "express";
import * as authController from "../controllers/authController";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { signupSchema, loginSchema } from "../schemas/authSchemas";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), authController.signup);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.get("/me", authMiddleware as any, authController.getMe);

export default router;
