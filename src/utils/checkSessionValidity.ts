import crypto from "crypto";
import mongoose from "mongoose";
import { DeviceSession } from "../models/deviceSessionModel.js";
import type { EmployeeDocument } from "../models/employeeModel.js";
import type { WorkplaceDocument } from "../models/workplaceModel.js";
import { verifyAuthJWT } from "./jwt.js";

export async function checkSessionValidity(refreshToken: string): Promise<boolean> {
  const { id, accountType, ...decoded } = await verifyAuthJWT(refreshToken, "refresh");
  if (
    !id ||
    !accountType ||
    !decoded.iat ||
    !decoded.exp ||
    (accountType !== "Employee" && accountType !== "Workplace")
  ) {
    await DeviceSession.deleteMany({ userId: new mongoose.Types.ObjectId(id) });
    return false;
  }

  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const userId = new mongoose.Types.ObjectId(id);
  const session = await DeviceSession.findOne({ userId, tokenHash });
  const user = (await mongoose.model(accountType).findById(userId).setOptions({
    includeUnverified: true,
  })) as EmployeeDocument | WorkplaceDocument;

  if (!session || !user) {
    // Possible token theft or reuse attack, so log the user out of all devices and return false to signal the route handler to clear the http-only refresh token cookie on the client:
    await DeviceSession.deleteMany({ userId });
    return false;
  }

  if (Date.now() > decoded.exp * 1000) {
    await session.deleteOne();
    return false;
  }

  // Type casting "user" to EmployeeDocument to get rid of the TS compile-time error raised due to the unavoidable but safe mismatch between the types of contexts of "user" and .changedPasswordAfter() method:
  if ((user as EmployeeDocument).changedPasswordAfter(decoded.iat)) {
    await DeviceSession.deleteMany({ userId });
    return false;
  }

  await session.deleteOne();
  return true;
}
