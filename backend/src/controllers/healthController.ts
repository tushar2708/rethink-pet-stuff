import { Request, Response, NextFunction } from "express";
import * as healthService from "../services/healthService";
import { AuthenticatedRequest } from "../types";
import type { HealthTemplateQuery } from "../schemas/healthSchemas";

export async function getTemplates(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await healthService.getHealthTemplates(
      req.query as unknown as HealthTemplateQuery
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await healthService.getHealthTimeline(
      req.params.petId as string,
      authReq.user.userId
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getRecords(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await healthService.getHealthRecords(req.params.petId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createRecord(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await healthService.createHealthRecord(
      req.params.petId as string,
      authReq.user.userId,
      req.body
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateRecord(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await healthService.updateHealthRecord(
      req.params.recordId as string,
      authReq.user.userId,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
