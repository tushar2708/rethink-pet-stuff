import { Request, Response, NextFunction } from "express";
import * as petService from "../services/petService";
import { AuthenticatedRequest } from "../types";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await petService.createPet(authReq.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const ownerId = (req.query.ownerId as string) ?? authReq.user.userId;
    const result = await petService.getPetsByOwner(ownerId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await petService.getPetById(req.params.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await petService.updatePet(
      req.params.id as string,
      authReq.user.userId,
      req.body,
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    await petService.deletePet(req.params.id as string, authReq.user.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function ownerOnboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await petService.ownerOnboard(authReq.user.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
