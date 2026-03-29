import type { Request, Response, NextFunction } from "express";
import { failureResponse, type FailureApiResponse } from "../utils/response";
import logger from "../lib/logger";

const extractZodErrors = (err: any): string[] => {
  const formatted = err.format() as Record<string, any>;

  return Object.values(formatted)
    .flatMap((v) => (Array.isArray(v) ? v : v._errors || []))
    .filter(Boolean);
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response<FailureApiResponse> => {
  if (err.code === "P2025") {
    return res.status(404).json(failureResponse(["Resource not found"]));
  }

  if (err.name === "ZodError") {
    return res.status(400).json(failureResponse(extractZodErrors(err)));
  }

  logger.error(err);

  return res.status(500).json(failureResponse(["Internal server error"]));
};
