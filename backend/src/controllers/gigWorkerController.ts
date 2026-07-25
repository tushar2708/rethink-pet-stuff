import { Request, Response, NextFunction } from "express";
import * as gigWorkerService from "../services/gigWorkerService";
import { AuthenticatedRequest } from "../types";
import type { GigSearchQuery } from "../schemas/gigWorkerSchemas";

export async function onboard(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.onboard(authReq.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await gigWorkerService.search(req.query as unknown as GigSearchQuery);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await gigWorkerService.getById(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.update(req.params.id as string, authReq.user.userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.getByUserId(authReq.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getAvailableJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.getAvailableJobs(authReq.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getActiveJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.getActiveJobs(authReq.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getJobHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.getJobHistory(authReq.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getEarnings(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await gigWorkerService.getEarnings(authReq.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
