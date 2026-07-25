import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/reviewService";
import { AuthenticatedRequest } from "../types";
import type { ReviewQuery } from "../schemas/reviewSchemas";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await reviewService.createReview(authReq.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reviewService.getReviews(req.query as unknown as ReviewQuery);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
