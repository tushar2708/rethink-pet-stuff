import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import { AuthenticatedRequest } from "../types";

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const result = await userService.updateProfile(authReq.user.userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
