import bcrypt from "bcryptjs";
import type { HydratedDocument } from "mongoose";
import type { EmployeeDocument } from "../models/employeeModel.js";
import type { OrganizationDocument } from "../models/organizationModel.js";
import { generateToken } from "../utils/generateToken.js";

export type PasswordManagementSchemaMethods<T> = {
  hashPasswordPreSave(this: HydratedDocument<T>): Promise<void>;

  setPasswordChangeTimestampPreSave(this: HydratedDocument<T>): Promise<void>;

  matchPasswords(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;

  passwordChangedAfter(
    this: HydratedDocument<T>,
    JWTTimestamp: number,
  ): boolean;

  createPaswordResetToken(this: HydratedDocument<T>): string;
};

// The HydratedDocument utility type is used to type a mongoose document:
export async function hashPasswordPreSave(
  this: EmployeeDocument | OrganizationDocument,
): Promise<void> {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
}

export async function setPasswordChangeTimestampPreSave(
  this: EmployeeDocument | OrganizationDocument,
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
  this: EmployeeDocument | OrganizationDocument,
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
  this: EmployeeDocument | OrganizationDocument,
): string {
  const { token, hashedToken } = generateToken();
  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return token;
}
