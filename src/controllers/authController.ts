import crypto from "crypto";
import mongoose from "mongoose";

import { isAfter } from "date-fns";
import { AppError } from "../errors/AppError.js";
import { DeviceSession } from "../models/deviceSessionModel.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { Organization, type OrganizationDocument } from "../models/organizationModel.js";
import type { AuthJWTPayload } from "../types/types.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import Email from "../utils/email.js";
import { generateToken } from "../utils/generateToken.js";
import { createAccessToken, createRefreshToken, verifyAuthJWT } from "../utils/jwt.js";
import {
  sendAccessTokenExpiredResponse,
  sendInvalidTokenResponse,
  sendNoAccessTokenResponse,
  sendRefreshTokenExpiredResponse,
  sendReloginAfterPasswordChangeResponse,
  sendSessionCompromisedResponse,
  sendUnverifiedEmailResponse,
  sendUserNotFoundResponse,
  sendVerificationWindowExpiredResponse,
} from "../utils/unauthorizedResponses.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const accountType =
    "firstName" in req.body ? "Employee" : "name" in req.body ? "Organization" : null;

  if (!accountType) return next(new AppError("Sign-Up Failed: Invalid data received", 400));
  const newUser = (await mongoose.model(accountType).create(req.body)) as
    | EmployeeDocument
    | OrganizationDocument;

  const { token: verificationToken, hashedToken: hashedVerificationToken } = generateToken();
  newUser.emailVerificationToken = hashedVerificationToken;
  newUser.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await newUser.save();

  const jwtPayload: AuthJWTPayload = { id: newUser.id, accountType };
  const { refreshToken, tokenHash, refreshTokenExpiry } = createRefreshToken(jwtPayload);
  const { accessToken, accessTokenExpiry } = createAccessToken(jwtPayload);
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  const emailVerificationUrl = `${req.protocol}://${req.get("host")}/verify-email/${verificationToken}`;
  await new Email(newUser, emailVerificationUrl).sendWelcome();

  await DeviceSession.create({
    userId: new mongoose.Types.ObjectId(newUser.id),
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
});

export const login = catchAsyncError(async function (req, res, next) {
  const refreshToken = req.cookies["refresh_token"];

  if (refreshToken) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const { id, accountType, ...decoded } = await verifyAuthJWT(refreshToken, "refresh");
    const UserModel = mongoose.model(accountType);
    const userId = new mongoose.Types.ObjectId(id);
    const session = await DeviceSession.findOne({ userId, tokenHash });
    const user = (await UserModel.findById(userId).setOptions({
      includeUnverified: true,
    })) as EmployeeDocument | OrganizationDocument;
    if (!session || !user) {
      // Possible token reuse attack, so log the user out of all devices:
      await DeviceSession.deleteMany({ userId });
      return !session ? sendSessionCompromisedResponse(res) : sendUserNotFoundResponse(res);
    }

    if (isAfter(new Date(), decoded.exp!)) {
      await DeviceSession.deleteOne({ userId, tokenHash });
      return sendRefreshTokenExpiredResponse(res);
    }

    await session.deleteOne();

    const payload: AuthJWTPayload = { id, accountType };
    const {
      refreshToken: newRefreshToken,
      tokenHash: newTokenHash,
      refreshTokenExpiry,
    } = createRefreshToken(payload);
    const { accessToken, accessTokenExpiry } = createAccessToken(payload);
  }

  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Invalid credentials", 400));

  const user = (
    await Promise.allSettled([Employee.findOne({ email }), Organization.findOne({ email })])
  ).filter((result) => result.status === "fulfilled")?.[0]?.value;

  if (!user) sendUserNotFoundResponse(res);
});

export const protect = catchAsyncError(async function (req, res, next) {
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!accessToken) return sendNoAccessTokenResponse(res);

  const decoded = await verifyAuthJWT(accessToken, "access");
  if (!decoded || !decoded.iat || !decoded.exp) return sendInvalidTokenResponse(res);
  if (decoded.exp < Date.now()) return sendAccessTokenExpiredResponse(res);

  const userId = new mongoose.Types.ObjectId(decoded.id);
  const UserModel = mongoose.model(decoded.accountType);
  const sessionUser = (await UserModel.findById(userId)) as EmployeeDocument | OrganizationDocument;

  if (!sessionUser) return sendUserNotFoundResponse(res);
  if (!sessionUser.emailIsVerified && isAfter(new Date(), sessionUser.emailVerificationExpires!)) {
    await UserModel.deleteOne({ _id: userId });
    await DeviceSession.deleteMany({ userId });
    return sendVerificationWindowExpiredResponse(res);
  }

  if (!sessionUser.emailIsVerified) return sendUnverifiedEmailResponse(res);

  if ((sessionUser as EmployeeDocument).passwordChangedAfter(decoded.iat))
    return sendReloginAfterPasswordChangeResponse(res);

  next();
});
