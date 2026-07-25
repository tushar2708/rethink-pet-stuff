import { Request } from "express";

export interface AuthPayload {
  userId: string;
  email: string;
  role: "owner" | "vet" | "gig";
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
