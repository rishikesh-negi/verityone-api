import bcrypt from "bcryptjs";
import type { HydratedDocument } from "mongoose";
import type { IEmployee } from "../models/employeeModel.js";
import type { IOrganization } from "../models/organizationModel.js";
import crypto from "crypto";

// The HydratedDocument utility type is used to type a mongoose document:
export const hashPasswordPreSave = (
  doc: HydratedDocument<IEmployee | IOrganization>,
) =>
  async function (): Promise<void> {
    if (!doc.isModified("password")) return;
    doc.password = await bcrypt.hash(doc.password, 12);
  };

export const setPasswordChangeTimestampPreSave = (
  doc: HydratedDocument<IEmployee | IOrganization>,
) =>
  async function (): Promise<void> {
    if (!doc.isModified("password") || doc.isNew) return;
    doc.passwordChangedAt = new Date(Date.now() - 1000);
  };

export async function matchPasswords(
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
}

export const passwordChangedAfter = (
  doc: HydratedDocument<IEmployee | IOrganization>,
  JWTTimestamp: number,
) =>
  function (): boolean {
    if (doc.passwordChangedAt) {
      const passwordChangeTimestamp = Math.floor(
        doc.passwordChangedAt.getTime() / 1000,
      );
      return JWTTimestamp < passwordChangeTimestamp;
    }

    return false;
  };

export const createPaswordResetToken = (
  doc: HydratedDocument<IEmployee | IOrganization>,
) =>
  function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    doc.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    doc.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
  };
