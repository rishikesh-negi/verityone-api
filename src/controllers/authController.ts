import mongoose from "mongoose";

import { AppError } from "../errors/AppError.js";
import { DeviceSession } from "../models/deviceSessionModel.js";
import type { EmployeeDocument } from "../models/employeeModel.js";
import type { OrganizationDocument } from "../models/organizationModel.js";
import type { AuthJWTPayload } from "../types/types.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import Email from "../utils/email.js";
import { generateToken } from "../utils/generateToken.js";
import { createAccessToken, createRefreshToken, verifyAuthJWT } from "../utils/jwt.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const accountType =
    "firstName" in req.body ? "Employee" : "name" in req.body ? "Organization" : null;

  if (!accountType) return next(new AppError("Sign-up failed. Invalid data received", 401));
  const newUser = await mongoose.model(accountType).create(req.body);

  const { token, hashedToken } = generateToken();
  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await newUser.save();

  const jwtPayload: AuthJWTPayload = {
    id: newUser.id,
    accountType,
  };
  const { refreshToken, tokenHash, refreshTokenExpiry } = createRefreshToken(jwtPayload);
  const { accessToken, accessTokenExpiry } = createAccessToken(jwtPayload);
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  const emailVerificationUrl = `${req.protocol}://${req.get("host")}/verify-email/${token}`;
  await new Email(newUser, emailVerificationUrl).sendWelcome();

  await DeviceSession.create({
    userId: new mongoose.Types.ObjectId(newUser.id),
    userType: "Employee",
    tokenHash,
    ...(userAgent ? { userAgent } : {}),
    ...(ipAddress ? { ipAddress } : {}),
    expiresAt: refreshTokenExpiry,
  });

  res.cookie("refresh-token", refreshToken, {
    expires: refreshTokenExpiry,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    httpOnly: true,
    sameSite: true,
  });

  res.status(201).json({
    message: "success",
    accessToken,
    tokenExpiresAt: accessTokenExpiry,
  });
});

export const protect = catchAsyncError(async function (req, res, next) {
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!accessToken) return next(new AppError("Unauthorized Access", 401));

  const decoded = await verifyAuthJWT(accessToken, "access");
  if (!decoded || !decoded.iat || !decoded.exp)
    return next(new AppError("Unauthorized Access: Invalid access token", 401));
  if (decoded.exp < Date.now())
    return next(new AppError("Unauthorized Access: Token expired", 401));

  const userId = new mongoose.Types.ObjectId(decoded.id);
  const UserModel = mongoose.model(decoded.accountType);
  const sessionUser = (await UserModel.findById(userId)) as EmployeeDocument | OrganizationDocument;

  if (!sessionUser) return next(new AppError("Unauthorized Access: User not found", 401));
  if (
    !sessionUser.emailIsVerified &&
    Date.now() > new Date(sessionUser.emailVerificationExpires!).getTime()
  ) {
    await UserModel.deleteOne({ _id: new mongoose.Types.ObjectId(decoded.id) });
    return next(new AppError("Email verification window has expired. Please sign up again.", 401));
  }

  if (!sessionUser.emailIsVerified)
    return next(new AppError("Please verify your email address to access this route", 401));

  if ((sessionUser as EmployeeDocument).passwordChangedAfter(decoded.iat)) {
    return next(new AppError("Token Expired: Log in again with the updated password", 401));
  }
});
