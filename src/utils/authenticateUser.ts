import type { Request, Response } from "express";
import type { AuthJWTPayload } from "../types/types.js";
import { createAccessToken, createRefreshToken } from "./jwt.js";
import type { EmployeeDocument } from "../models/employeeModel.js";
import type { OrganizationDocument } from "../models/organizationModel.js";
import { generateToken } from "./generateToken.js";
import Email from "./email.js";
import { DeviceSession } from "../models/deviceSessionModel.js";
import mongoose from "mongoose";

export type AuthCreatorFunctionParams = {
  req: Request;
  res: Response;
  jwtPayload: AuthJWTPayload;
  user: EmployeeDocument | OrganizationDocument;
  authAction: "signup" | "login";
};

export async function authenticateUser(authParams: AuthCreatorFunctionParams) {
  const { req, res, jwtPayload, user, authAction } = authParams;
  const { accountType } = jwtPayload;

  const { refreshToken, tokenHash, refreshTokenExpiry } = createRefreshToken(jwtPayload);
  const { accessToken, accessTokenExpiry } = createAccessToken(jwtPayload);
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  await DeviceSession.create({
    userId: new mongoose.Types.ObjectId(user.id),
    userType: accountType,
    tokenHash,
    ...(userAgent ? { userAgent } : {}),
    ...(ipAddress ? { ipAddress } : {}),
  });

  res.cookie("refresh_token", refreshToken, {
    expires: refreshTokenExpiry,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(201).json({
    message: "success",
    accessToken,
    tokenExpiresAt: accessTokenExpiry,
  });

  if (authAction === "signup") {
    const { token, hashedToken } = generateToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const emailVerificationUrl = `${req.protocol}://${req.get("host")}/verify-email/${token}`;
    await new Email(user, emailVerificationUrl).sendWelcome();
  }
}
