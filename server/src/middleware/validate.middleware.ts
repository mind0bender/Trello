import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { failureResponse, type FailureApiResponse } from "../utils/response";
import type { $ZodIssue } from "zod/v4/core";
import logger from "../lib/logger";

type Source = "body" | "params" | "query";

export const validate =
  <T extends z.ZodTypeAny>(schema: T, source: Source = "body") =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<FailureApiResponse> | void => {
    logger.debug({ msg: "Request Body", body: req.body });

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.issues.map(
        (e: $ZodIssue): string => e.message,
      );
      return res.status(400).json(failureResponse(messages));
    }

    req[source] = result.data;
    next();
  };
