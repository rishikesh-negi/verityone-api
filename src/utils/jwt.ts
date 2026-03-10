import jwt, { type Secret } from "jsonwebtoken";
import ms from "ms";
import crypto from "crypto";
import type { CreateSendAuthJWTOptions } from "../types/types.js";
import { RefreshToken } from "../models/deviceSessionModel.js";
import { AppError } from "../errors/AppError.js";

const ACCESS_JWT_SECRET: string = process.env["ACCESS_JWT_SECRET"]!;
const REFRESH_JWT_SECRET: string = process.env["REFREST_JWT_SECRET"]!;

export function signAuthJWT(payload: object, tokenType: "access" | "refresh") {
  const jwtSecret: Secret =
    tokenType === "access" ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET;

  const expiresIn: ms.StringValue = (
    tokenType === "access"
      ? process.env["ACCESS_JWT_EXPIRES_IN"]
      : process.env["REFRESH_JWT_EXPIRES_IN"]
  ) as ms.StringValue;

  return jwt.sign(payload, jwtSecret, {
    expiresIn,
  });
}

export function verifyAuthJWT(token: string, type: "access" | "refresh") {
  const SECRET = type === "access" ? ACCESS_JWT_SECRET : REFRESH_JWT_SECRET;
  return jwt.verify(token, SECRET);
}

export async function createAndSendAuthJWT({
  tokenType,
  user,
  statusCode,
  req,
  res,
  sendUserData = false,
}: CreateSendAuthJWTOptions) {
  try {
    const payload = {
      id: user.id,
      userType: "firstName" in user ? "employee" : "organization",
    };
    const token = signAuthJWT(payload, tokenType);

    if (tokenType === "refresh") {
      const expiresAt: Date = new Date(
        Date.now() +
          Number.parseInt(process.env["REFRESH_JWT_EXPIRES_IN"]!) *
            24 *
            60 *
            60 *
            1000,
      );

      const userType = "firstName" in user ? "Employee" : "Organization";
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await RefreshToken.create({
        userId: user.id,
        userType,
        tokenHash,
        expiresAt,
      });

      res.cookie("refreshToken", token, {
        expires: expiresAt,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        httpOnly: true,
        sameSite: "strict",
      });
    }

    res.status(statusCode).json({
      status: "success",
      token,
      ...(sendUserData && { data: user }),
    });
  } catch {
    throw new AppError("Error creating and sending token!", 500);
  }
}
