import crypto from "crypto";
import mongoose from "mongoose";

import type { NextFunction, Response } from "express";
import {
  AccessTokenExpiredError,
  AppError,
  EmailAlreadyExistsError,
  ForbiddebAccessError,
  InvalidCredentialsError,
  InvalidEmailVerificationToken,
  InvalidSessionError,
  InvalidSignupDataError,
  InvalidTokenError,
  NoAccessTokenError,
  ReloginRequiredError,
  UnverifiedEmailError,
  UsernameTakenError,
  UserNotFoundError,
  VerificationWindowExpiredError,
} from "../errors/AppError.js";
import { DeviceSession } from "../models/deviceSessionModel.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { UserAccountsRegistry } from "../models/userAccountsRegistryModel.js";
import { Workplace, type WorkplaceDocument } from "../models/workplaceModel.js";
import type { AuthJWTPayload, RequestWithUser, UserDocument } from "../types/types.js";
import { authenticateUser } from "../utils/authenticateUser.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { checkSessionValidity } from "../utils/checkSessionValidity.js";
import { clearClientRefreshToken } from "../utils/clearClientRefreshToken.js";
import { REFRESH_JWT_COOKIE_NAME } from "../utils/constants.js";
import { verifyAuthJWT } from "../utils/jwt.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const accountType =
    "firstName" in req.body ? "Employee" : "name" in req.body ? "Workplace" : null;

  if (!accountType) return next(new InvalidSignupDataError());

  const emailAlreadyExists = await UserAccountsRegistry.findOne({ email: req.body.email });
  if (emailAlreadyExists) return next(new EmailAlreadyExistsError());
  const usernameTaken = await UserAccountsRegistry.findOne({ username: req.body.username });
  if (usernameTaken) return next(new UsernameTakenError());

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newUser] = (await mongoose.model(accountType).create([req.body], { session })) as
      | EmployeeDocument[]
      | WorkplaceDocument[];
    if (!newUser) throw new Error();

    await UserAccountsRegistry.create(
      [
        {
          userId: newUser._id,
          email: req.body.email,
          username: req.body.username,
          userType: accountType,
        },
      ],
      { session },
    );
    await session.commitTransaction();

    const jwtPayload: AuthJWTPayload = { id: newUser.id, accountType };
    return authenticateUser({ req, res, jwtPayload, user: newUser, authAction: "signup" });
  } catch {
    await session.abortTransaction();
    return next(new AppError("Signup failed. Something went wrong", 500));
  } finally {
    await session.endSession();
  }
});

export const login = catchAsyncError(async function (req, res, next) {
  const refreshToken = req.cookies[REFRESH_JWT_COOKIE_NAME];

  if (refreshToken) {
    const sessionIsValid = await checkSessionValidity(refreshToken);
    if (!sessionIsValid) {
      clearClientRefreshToken(req, res);
      return next(new InvalidSessionError());
    }

    if (sessionIsValid) {
      const { id, accountType } = await verifyAuthJWT(refreshToken, "refresh");
      const user = (await mongoose.model(accountType).findOne({ _id: id }).setOptions({
        includeUnverified: true,
      })) as UserDocument;
      const jwtPayload: AuthJWTPayload = { id, accountType };
      return authenticateUser({ req, res, jwtPayload, user, authAction: "login" });
    }
  }

  const { email, username, password } = req.body;
  if (!(email || username) || !password) return next(new InvalidCredentialsError());

  const user = (
    await Promise.allSettled([
      Employee.findOne({ $or: [{ email }, { username }] }).select("+password"),
      Workplace.findOne({ $or: [{ email }, { username }] }).select("+password"),
    ])
  ).filter((result) => result.status === "fulfilled")?.[0]?.value;

  const passwordsMatched = await user?.matchPasswords(password, user?.password || "");
  if (!user || !passwordsMatched) return next(new InvalidCredentialsError());

  const accountType = "firstName" in user ? "Employee" : "Workplace";
  const jwtPayload: AuthJWTPayload = { id: user.id, accountType };
  return await authenticateUser({ req, res, jwtPayload, user, authAction: "login" });
});

export const protect = catchAsyncError(async function (req, res, next) {
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!accessToken) return next(new NoAccessTokenError());

  const { id, accountType, ...decoded } = await verifyAuthJWT(accessToken, "access");
  if (
    !id ||
    !accountType ||
    !decoded.iat ||
    !decoded.exp ||
    (accountType !== "Employee" && accountType !== "Workplace")
  )
    return next(new InvalidTokenError());

  if (Date.now() > decoded.exp * 1000) return next(new AccessTokenExpiredError());

  const userId = new mongoose.Types.ObjectId(id);
  const UserModel = mongoose.model(accountType);
  const sessionUser = (await UserModel.findById(userId)) as UserDocument;

  if (!sessionUser) return next(new UserNotFoundError());
  if (!sessionUser.emailIsVerified) {
    if (Date.now() > sessionUser.emailVerificationExpires!.getTime()) {
      await UserModel.deleteOne({ _id: userId });
      await DeviceSession.deleteMany({ userId });
      return next(new VerificationWindowExpiredError());
    }

    return next(new UnverifiedEmailError());
  }

  if ((sessionUser as EmployeeDocument).changedPasswordAfter(decoded.iat)) {
    clearClientRefreshToken(req, res);
    await DeviceSession.deleteMany({ userId });
    return next(new ReloginRequiredError());
  }

  (req as RequestWithUser).user = sessionUser;
  return next();
});

export const verifyEmailAddress = catchAsyncError(async function (req, res, next) {
  const rawToken = req.params["verificationToken"] as string;
  if (!rawToken) return next(new InvalidEmailVerificationToken());

  const emailVerificationToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = (
    await Promise.allSettled([
      Employee.findOne({ emailVerificationToken }),
      Workplace.findOne({ emailVerificationToken }),
    ])
  ).filter((result) => result.status === "fulfilled")?.[0]?.value as
    | EmployeeDocument
    | WorkplaceDocument;

  if (!user) return next(new InvalidEmailVerificationToken());

  if (Date.now() > user.emailVerificationExpires!.getTime()) {
    await mongoose.model(user.userType).deleteOne({ _id: user.id });
    await DeviceSession.deleteMany({ userId: user.id });
    return next(new VerificationWindowExpiredError());
  }

  user.emailIsVerified = true;
  user.emailVerificationExpires = null;
  user.emailVerificationToken = null;
  await user.save();
  return res.redirect(301, `${req.protocol}://${req.get("host")}/`);
});

export const restrictToVerified = catchAsyncError<UserDocument>(async function (req, _res, next) {
  if (!req.user) return next(new UserNotFoundError());
  if (!req.user.emailIsVerified) return next(new UnverifiedEmailError());

  return next();
});

export const restrictTo =
  (role: "Employee" | "Workplace") =>
  (req: RequestWithUser<UserDocument>, _res: Response, next: NextFunction) => {
    if (role !== req.user?.userType) return next(new ForbiddebAccessError());
    next();
  };

export const logout = catchAsyncError(async function (req, res) {
  const refreshToken = req.cookies[REFRESH_JWT_COOKIE_NAME];
  if (!refreshToken) return res.sendStatus(204);

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const { id } = await verifyAuthJWT(refreshToken, "refresh");
  const userId = new mongoose.Types.ObjectId(id);

  await DeviceSession.deleteOne({ userId, tokenHash });

  clearClientRefreshToken(req, res);
  return res.sendStatus(204);
});
