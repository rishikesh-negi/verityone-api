import type { NextFunction, Request, Response } from "express";
import type { Controller } from "../types/types.js";

export function catchAsyncError(fn: Controller<unknown>) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err) => next(err));
  };
}
