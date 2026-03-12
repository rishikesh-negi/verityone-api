import { Query, Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import {
  createPaswordResetToken,
  hashPasswordPreSave,
  matchPasswords,
  passwordChangedAfter,
  setPasswordChangeTimestampPreSave,
  type PasswordManagementSchemaMethods,
} from "../middleware/passwordManagementMiddleware.js";
import {
  emailAddressFormatValidator,
  partialNameValidator,
  passwordValidator,
  usernameValidator,
} from "../utils/stringValidators.js";

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "Invalid first name"],
      maxlength: [40, "First name must not exceed 40 characters"],
      validate: {
        validator: partialNameValidator,
        message: "Please enter a valid first name",
      },
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Invalid last name"],
      maxlength: [40, "Last name must not exceed 40 characters"],
      validate: {
        validator: partialNameValidator,
        message: "Please enter a valid last name",
      },
    },
    fullName: {
      type: String,
      default: function (): string {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: [true, "This username is taken. Try a different one"],
      minlength: [3, "Username must have at least 3 characters"],
      maxlength: [25, "Username length cannot exceed 25 characters"],
      validate: {
        validator: usernameValidator,
        message: "Only letters, numbers, and underscores allowed. Must contain at least one letter",
      },
    },
    email: {
      type: String,
      trim: true,
      required: [true, "A valid email address is required"],
      unique: [true, "An account with this email address already exists"],
      lowercase: true,
      validate: {
        validator: emailAddressFormatValidator,
        message: "Invalid email address format",
      },
      maxLength: [50, "The email address cannot exceed 50 characters"],
      message: "Please provide a valid email address",
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailIsVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "A valid password is required to secure your account"],
      select: false,
      validate: {
        validator: passwordValidator,
        message:
          "Password must contain minimum 8 characters, uppercase and lowercase letters, a number, and a special character",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
      select: false,
      immutable: true,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

employeeSchema.pre("save", hashPasswordPreSave);
employeeSchema.pre("save", setPasswordChangeTimestampPreSave);

employeeSchema.pre(/^find/, async function (this: Query<unknown, IEmployee>) {
  if (this.getOptions()["includeInactive"]) return;
  this.where({ active: { $ne: false } });
});

employeeSchema.pre(/^find/, async function (this: Query<unknown, IEmployee>) {
  if (this.getOptions()["includeUnverified"]) return;
  this.where({ emailIsVerified: { $ne: false } });
});

employeeSchema.methods["matchPasswords"] = matchPasswords;
employeeSchema.methods["passwordChangedAfter"] = passwordChangedAfter;
employeeSchema.methods["createPasswordResetToken"] = createPaswordResetToken;

export type IEmployeeSchema = InferSchemaType<typeof employeeSchema>;
export type IEmployee = IEmployeeSchema & PasswordManagementSchemaMethods<IEmployeeSchema>;
export type EmployeeDocument = HydratedDocument<IEmployee>;

export const Employee = model<IEmployee>("Employee", employeeSchema);
