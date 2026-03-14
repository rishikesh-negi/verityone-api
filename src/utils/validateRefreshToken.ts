import crypto from "crypto";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { DeviceSession } from "../models/deviceSessionModel.js";
import type { EmployeeDocument } from "../models/employeeModel.js";
import type { OrganizationDocument } from "../models/organizationModel.js";
import { verifyAuthJWT } from "./jwt.js";
import {
  triggerRefreshJWTCookieRemoval,
  sendInvalidTokenResponse,
  sendReloginAfterPasswordChangeResponse,
  sendSessionCompromisedResponse,
  sendSessionExpiredResponse,
  sendUserNotFoundResponse,
} from "./userAuthorizationResponses.js";

export async function validateRefreshToken(
  req: Request,
  res: Response,
  refreshToken: string,
): Promise<boolean> {
  const { id, accountType, ...decoded } = await verifyAuthJWT(refreshToken, "refresh");
  if (!id || !accountType || !decoded.iat || !decoded.exp) {
    await DeviceSession.deleteMany({ userId: new mongoose.Types.ObjectId(id) });
    triggerRefreshJWTCookieRemoval(req, res);
    sendInvalidTokenResponse(res);
    return false;
  }

  if (accountType !== "Employee" && accountType !== "Organization") {
    await DeviceSession.deleteMany({ userId: new mongoose.Types.ObjectId(id) });
    triggerRefreshJWTCookieRemoval(req, res);
    sendInvalidTokenResponse(res);
    return false;
  }

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const UserModel = mongoose.model(accountType);
  const userId = new mongoose.Types.ObjectId(id);
  const session = await DeviceSession.findOne({ userId, tokenHash });
  const user = (await UserModel.findById(userId).setOptions({
    includeUnverified: true,
  })) as EmployeeDocument | OrganizationDocument;

  if (!session || !user) {
    // Possible token theft or reuse attack, so log the user out of all devices:
    await DeviceSession.deleteMany({ userId });
    triggerRefreshJWTCookieRemoval(req, res);
    if (!session) sendSessionCompromisedResponse(res);
    if (!user) sendUserNotFoundResponse(res);
    return false;
  }

  if (Date.now() > decoded.exp * 1000) {
    await session.deleteOne();
    triggerRefreshJWTCookieRemoval(req, res);
    sendSessionExpiredResponse(res);
    return false;
  }

  // Type-casting "user" to EmployeeDocument to get rid of the TS compile-time error raised due to the unavoidable but safe mismatch between the context types of "user" and the .changedPasswordAfter() method:
  if ((user as EmployeeDocument).changedPasswordAfter(decoded.iat)) {
    triggerRefreshJWTCookieRemoval(req, res);
    sendReloginAfterPasswordChangeResponse(res);
    return false;
  }

  await session.deleteOne();
  return true;
}
