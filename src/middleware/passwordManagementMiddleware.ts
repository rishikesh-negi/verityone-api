import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { HydratedDocument } from "mongoose";
import type { IEmployee } from "../models/employeeModel.js";
import type { IOrganization } from "../models/organizationModel.js";

// The HydratedDocument utility type is used to type a mongoose document:
export async function hashPasswordPreSave(
  this: HydratedDocument<IEmployee | IOrganization>,
): Promise<void> {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
}

export async function setPasswordChangeTimestampPreSave(
  this: HydratedDocument<IEmployee | IOrganization>,
): Promise<void> {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangedAt = new Date(Date.now() - 1000);
}

export async function matchPasswords(
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
}

export function passwordChangedAfter(
  this: HydratedDocument<IEmployee | IOrganization>,
  JWTTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const passwordChangeTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return JWTTimestamp < passwordChangeTimestamp;
  }

  return false;
}

export function createPaswordResetToken(
  this: HydratedDocument<IEmployee | IOrganization>,
): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
}
