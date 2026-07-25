import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { AuthenticatedRequest } from "../types";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const user = await authService.getMe(authReq.user.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
