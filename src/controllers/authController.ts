import crypto from "crypto";
import mongoose from "mongoose";

import {
  AccessTokenExpiredError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidEmailVerificationToken,
  InvalidSessionError,
  InvalidSignupDataError,
  InvalidTokenError,
  NoAccessTokenError,
  PasswordChangedReloginError,
  UnverifiedEmailError,
  UsernameTakenError,
  UserNotFoundError,
  VerificationWindowExpiredError,
} from "../errors/AppError.js";
import { DeviceSession } from "../models/deviceSessionModel.js";
import { Employee, type EmployeeDocument } from "../models/employeeModel.js";
import { Organization, type OrganizationDocument } from "../models/organizationModel.js";
import type { AuthJWTPayload } from "../types/types.js";
import { authenticateUser } from "../utils/authenticateUser.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { REFRESH_JWT_COOKIE_NAME } from "../utils/constants.js";
import { verifyAuthJWT } from "../utils/jwt.js";
import { triggerRefreshJWTCookieRemoval } from "../utils/userAuthorizationResponses.js";
import { checkSessionValidity } from "../utils/checkSessionValidity.js";
import { UserAccountRegistry } from "../models/userAccountRegistryModel.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const accountType =
    "firstName" in req.body ? "Employee" : "name" in req.body ? "Organization" : null;

  if (!accountType) return next(new InvalidSignupDataError());

  const emailAlreadyExists = await UserAccountRegistry.findOne({ email: req.body.email });
  if (emailAlreadyExists) return next(new EmailAlreadyExistsError());
  const usernameTaken = await UserAccountRegistry.findOne({ username: req.body.username });
  if (usernameTaken) return next(new UsernameTakenError());

  const session = await mongoose.startSession();
  session.startTransaction();
  const newUser = (await mongoose.model(accountType).create(req.body)) as
    | EmployeeDocument
    | OrganizationDocument;
  await UserAccountRegistry.create({
    userId: newUser._id,
    email: req.body.email,
    username: req.body.username,
    userType: accountType,
  });
  await session.commitTransaction();

  const jwtPayload: AuthJWTPayload = { id: newUser.id, accountType };
  return authenticateUser({ req, res, jwtPayload, user: newUser, authAction: "signup" });
});

export const login = catchAsyncError(async function (req, res, next) {
  const refreshToken = req.cookies[REFRESH_JWT_COOKIE_NAME];

  if (refreshToken) {
    const sessionIsValid = await checkSessionValidity(refreshToken);
    if (!sessionIsValid) {
      triggerRefreshJWTCookieRemoval(req, res);
      return next(new InvalidSessionError());
    }

    if (sessionIsValid) {
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
  if (!email || !password) return next(new InvalidCredentialsError());

  const user = (
    await Promise.allSettled([
      Employee.findOne({ email }).select("+password"),
      Organization.findOne({ email }).select("+password"),
    ])
  ).filter((result) => result.status === "fulfilled")?.[0]?.value;

  const passwordsMatched = await user?.matchPasswords(password, user?.password || "");
  if (!user || !passwordsMatched) return next(new InvalidCredentialsError());

  const accountType = "firstName" in user ? "Employee" : "Organization";
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
    (accountType !== "Employee" && accountType !== "Organization")
  )
    return next(new InvalidTokenError());

  if (Date.now() > decoded.exp * 1000) return next(new AccessTokenExpiredError());

  const userId = new mongoose.Types.ObjectId(id);
  const UserModel = mongoose.model(accountType);
  const sessionUser = (await UserModel.findById(userId)) as EmployeeDocument | OrganizationDocument;

  if (!sessionUser) return next(new UserNotFoundError());
  if (
    !sessionUser.emailIsVerified &&
    Date.now() > sessionUser.emailVerificationExpires!.getTime()
  ) {
    await UserModel.deleteOne({ _id: userId });
    await DeviceSession.deleteMany({ userId });
    return next(new VerificationWindowExpiredError());
  }

  if (!sessionUser.emailIsVerified) return next(new UnverifiedEmailError());

  if ((sessionUser as EmployeeDocument).changedPasswordAfter(decoded.iat)) {
    triggerRefreshJWTCookieRemoval(req, res);
    await DeviceSession.deleteMany({ userId });
    return next(new PasswordChangedReloginError());
  }

  req.user = sessionUser;
  return next();
});

export const verifyEmailAddress = catchAsyncError(async function (req, res, next) {
  const rawToken = req.params["verificationToken"] as string;
  if (!rawToken) return next(new InvalidEmailVerificationToken());

  const emailVerificationToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = (
    await Promise.allSettled([
      Employee.findOne({ emailVerificationToken }),
      Organization.findOne({ emailVerificationToken }),
    ])
  ).filter((result) => result.status === "fulfilled")?.[0]?.value as
    | EmployeeDocument
    | OrganizationDocument;

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
});

export const restrictToVerified = catchAsyncError(async function (req, _res, next) {
  if (!req.user) return next(new UserNotFoundError());
  if (!req.user.emailIsVerified) return next(new UnverifiedEmailError());

  return next();
});

export const logout = catchAsyncError(async function (req, res) {
  const refreshToken = req.cookies[REFRESH_JWT_COOKIE_NAME];
  if (!refreshToken) return res.sendStatus(204);

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const { id } = await verifyAuthJWT(refreshToken, "refresh");
  const userId = new mongoose.Types.ObjectId(id);

  await DeviceSession.deleteOne({ userId, tokenHash });

  triggerRefreshJWTCookieRemoval(req, res);
  return res.sendStatus(204);
});
