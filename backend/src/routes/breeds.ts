import { Router } from "express";
import * as breedController from "../controllers/breedController";
import { validate } from "../middleware/validate";
import { breedQuerySchema } from "../schemas/breedSchemas";

const router = Router();
router.get("/", validate({ query: breedQuerySchema }), breedController.list);
export default router;
