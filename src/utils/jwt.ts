import type { Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import ms from "ms";
import type { IEmployee } from "../models/employeeModel.js";
import type { IOrganization } from "../models/organizationModel.js";

const ACCESS_JWT_SECRET: string = process.env["ACCESS_JWT_SECRET"]!;
const REFRESH_JWT_SECRET: string = process.env["REFREST_JWT_SECRET"]!;

export function signAuthJWT(payload: object, tokenType: "access" | "refresh") {
  const jwtSecret: Secret =
    tokenType === "access"
      ? process.env["ACCESS_JWT_SECRET"]!
      : process.env["REFRESH_JWT_SECRET"]!;

  const expiresIn: ms.StringValue = (
    tokenType === "access"
      ? process.env["ACCESS_JWT_EXPIRES_IN"]
      : process.env["REFRESH_JWT_EXPIRES_IN"]
  ) as ms.StringValue;

  jwt.sign(payload, jwtSecret, {
    expiresIn,
  });
}

export function verifyAuthJWT(token: string, type: "access" | "refresh") {
  const SECRET = type === "access" ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET;
  return jwt.verify(token, SECRET);
}

export function createAndSendAuthJWT(
  user: HydratedDocument<IEmployee | IOrganization>,
  statusCode: number,
  req: Request<unknown>,
  res: Response,
  sendUserData: boolean = false,
) {
  const token = signAuthJWT({ id: user._id }, "access");
  const jwtExpiresIn: number =
    Number.parseInt(process.env["AUTH_JWT_COOKIE_EXPIRES_IN"]!) *
    24 *
    60 *
    60 *
    1000;

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + jwtExpiresIn),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    ...(sendUserData && { data: user }),
  });
}
