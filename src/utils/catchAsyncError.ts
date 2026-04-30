import type { NextFunction, Request, Response } from "express";
import type { AsyncController } from "../types/types.js";

export function catchAsyncError(fn: AsyncController) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err) => next(err));
  };
}
