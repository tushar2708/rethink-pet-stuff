import { Request, Response, NextFunction } from "express";
import * as appointmentService from "../services/appointmentService";
import { AuthenticatedRequest } from "../types";
import type { AppointmentQuery } from "../schemas/appointmentSchemas";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await appointmentService.create(authReq.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await appointmentService.getFiltered(
      authReq.user.userId,
      req.query as unknown as AppointmentQuery,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await appointmentService.getById(
      req.params.id as string,
      authReq.user.userId,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await appointmentService.updateStatus(
      req.params.id as string,
      authReq.user.userId,
      req.body,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
