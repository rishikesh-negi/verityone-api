import type { Request, Response } from "express";
import { REFRESH_JWT_COOKIE_NAME } from "./constants.js";

export const clearClientRefreshToken = (req: Request, res: Response) =>
  res.clearCookie(REFRESH_JWT_COOKIE_NAME, {
    httpOnly: true,
    secure:
      process.env["NODE_ENV"] === "development"
        ? false
        : req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: process.env["NODE_ENV"] === "development" ? "lax" : "strict",
  });
