import type { NextFunction, Request, Response } from "express";
import z from "zod";
import type { AppError } from "../errors/AppError.js";
import type { ParsedUrlQuery } from "querystring";

type RawRequestComponents =
  | {
      body: Record<string, unknown>;
      query?: ParsedUrlQuery;
      params?: { [key: string]: string };
    }
  | {
      body?: Record<string, unknown>;
      query: ParsedUrlQuery;
      params?: { [key: string]: string };
    }
  | {
      body?: Record<string, unknown>;
      query?: ParsedUrlQuery;
      params: { [key: string]: string };
    };

export const validateRequest =
  (schema: z.ZodType<RawRequestComponents>, error?: Error | AppError) =>
  (req: Request & { [K: string]: unknown }, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success)
      return error
        ? next(error)
        : res.status(400).json({
            message: "fail",
            errors: z.flattenError(result.error),
          });

    if ("body" in result.data) req.body = result.data.body;
    if ("query" in result.data) req.query = result.data.query;
    if ("params" in result.data) req.params = result.data.params;

    next();
  };
