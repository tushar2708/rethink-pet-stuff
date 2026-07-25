import { Request, Response, NextFunction } from "express";
import * as vetService from "../services/vetService";
import { AuthenticatedRequest } from "../types";
import type { VetSearchQuery } from "../schemas/vetSchemas";

export async function onboard(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await vetService.onboard(authReq.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vetService.search(req.query as unknown as VetSearchQuery);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vetService.getById(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await vetService.update(
      req.params.id as string,
      authReq.user.userId,
      req.body,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
