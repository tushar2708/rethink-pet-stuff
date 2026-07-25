import { Request, Response, NextFunction } from "express";
import * as medicalEventService from "../services/medicalEventService";
import { AuthenticatedRequest } from "../types";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await medicalEventService.getEvents(
      req.params.petId as string,
      authReq.user.userId
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await medicalEventService.createEvent(
      req.params.petId as string,
      authReq.user.userId,
      req.body
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await medicalEventService.updateEvent(
      req.params.eventId as string,
      authReq.user.userId,
      req.body
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    await medicalEventService.deleteEvent(
      req.params.eventId as string,
      authReq.user.userId
    );
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}
