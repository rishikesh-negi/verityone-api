import type { NextFunction, Request, Response } from "express";
import type { AsyncRouteHandler } from "../types/types.js";

export function catchAsyncError(fn: AsyncRouteHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err) => next(err));
  };
}
