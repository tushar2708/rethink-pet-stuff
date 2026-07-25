import { Request, Response, NextFunction } from "express";
import * as breedService from "../services/breedService";
import type { BreedQuery } from "../schemas/breedSchemas";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await breedService.getBreeds(req.query as unknown as BreedQuery);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
