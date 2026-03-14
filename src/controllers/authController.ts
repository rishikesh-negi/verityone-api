import mongoose from "mongoose";

import { isAfter } from "date-fns";
import { AppError } from "../errors/AppError.js";
import { DeviceSession } from "../models/deviceSessionModel.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { Organization, type OrganizationDocument } from "../models/organizationModel.js";
import type { AuthJWTPayload } from "../types/types.js";
import { authenticateUser } from "../utils/authenticateUser.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { verifyAuthJWT } from "../utils/jwt.js";
import {
  sendAccessTokenExpiredResponse,
  sendInvalidCredentialsResponse,
  sendInvalidTokenResponse,
  sendNoAccessTokenResponse,
  sendReloginAfterPasswordChangeResponse,
  sendUnverifiedEmailResponse,
  sendUserNotFoundResponse,
  sendVerificationWindowExpiredResponse,
} from "../utils/userAuthorizationResponses.js";
import { validateRefreshToken } from "../utils/validateRefreshToken.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const accountType =
    "firstName" in req.body ? "Employee" : "name" in req.body ? "Organization" : null;

  if (!accountType) return next(new AppError("Sign-Up Failed: Invalid data received", 400));
  const newUser = (await mongoose.model(accountType).create(req.body)) as
    | EmployeeDocument
    | OrganizationDocument;

  const jwtPayload: AuthJWTPayload = { id: newUser.id, accountType };
  return authenticateUser({ req, res, jwtPayload, user: newUser, authAction: "signup" });
});

export const login = catchAsyncError(async function (req, res, next) {
  const refreshToken = req.cookies["refresh_token"];

  if (refreshToken) {
    const refreshTokenIsValid = await validateRefreshToken(req, res, refreshToken);
    if (!refreshTokenIsValid) return;

    if (refreshTokenIsValid) {
      const { id, accountType } = await verifyAuthJWT(refreshToken, "refresh");
      const UserModel = mongoose.model(accountType);
      const userId = new mongoose.Types.ObjectId(id);
      const user = (await UserModel.findOne({ _id: userId }).setOptions({
        includeUnverified: true,
      })) as EmployeeDocument | OrganizationDocument;
      const jwtPayload: AuthJWTPayload = { id, accountType };
      return authenticateUser({ req, res, jwtPayload, user, authAction: "login" });
    }
  }

  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Invalid credentials", 400));

  const user = (
    await Promise.allSettled([
      Employee.findOne({ email }).select("+password"),
      Organization.findOne({ email }).select("+password"),
    ])
  ).filter((result) => result.status === "fulfilled")?.[0]?.value;

  const passwordsMatched = await user?.matchPasswords(password, user?.password || "");
  if (!user || !passwordsMatched) return sendInvalidCredentialsResponse(res);

  const accountType = "firstName" in user ? "Employee" : "Organization";
  const jwtPayload: AuthJWTPayload = { id: user.id, accountType };
  authenticateUser({ req, res, jwtPayload, user, authAction: "login" });
});

export const protect = catchAsyncError(async function (req, res, next) {
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!accessToken) return sendNoAccessTokenResponse(res);

  const decoded = await verifyAuthJWT(accessToken, "access");
  if (!decoded || !decoded.iat || !decoded.exp) return sendInvalidTokenResponse(res);
  if (decoded.exp * 1000 < Date.now()) return sendAccessTokenExpiredResponse(res);

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

  if ((sessionUser as EmployeeDocument).changedPasswordAfter(decoded.iat))
    return sendReloginAfterPasswordChangeResponse(res);

  return next();
});
