import type { NextFunction, Request, Response } from "express";
import type { AsyncRouteHandler, RequestWithUser, UserDocument } from "../types/types.js";

export function catchAsyncError<T extends UserDocument | undefined = undefined>(
  fn: AsyncRouteHandler<T>,
) {
  return function (
    req: T extends UserDocument ? RequestWithUser<T> : Request,
    res: Response,
    next: NextFunction,
  ) {
    fn(req, res, next).catch((err) => next(err));
  };
}
