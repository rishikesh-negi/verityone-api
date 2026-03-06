import { model, Query, Schema, type InferSchemaType } from "mongoose";
import {
  createPaswordResetToken,
  hashPasswordPreSave,
  matchPasswords,
  passwordChangedAfter,
  setPasswordChangeTimestampPreSave,
} from "../middleware/passwordManagementMiddleware.js";
import {
  emailAddressFormatValidator,
  organizationNameValidator,
  passwordValidator,
  usernameValidator,
} from "../utils/stringValidators.js";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [
        true,
        "Please provide the name of the organization to create an account",
      ],
      validate: {
        validator: organizationNameValidator,
        message:
          "Organization name can contain: letters (at least one required), numbers, apostrophes, hyphens, and periods (consecutive special characters not allowed)",
      },
      minLength: [2, "The name must contain at least 2 characters"],
      maxLength: [50, "The name cannot exceed 50 characters"],
    },
    slug: String,
    username: {
      type: String,
      trim: true,
      required: [true, "Enter a valid and unique username"],
      minLength: [3, "The username must contain at least 3 characters"],
      maxLength: [25, "The username cannot exceed 25 characters"],
      unique: [true, "This username is taken. Try a different one"],
      validate: {
        validator: usernameValidator,
        message:
          "Only letters, numbers, and userscores allowed (must contain at least one letter)",
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
    postalCode: {
      type: String,
      trim: true,
      required: [true, "Postal code is required"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "City name is required"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "Country name is required"],
      minLength: [4, "Invalid country name"],
      maxLength: [32, "Only valid common names of countries allowed"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      set: (val: number) => (val > 1 || val < 5 ? val.toFixed(1) : val),
    },
    numRatings: { type: Number, default: 0 },
    password: {
      type: String,
      required: [true, "Password is required to secure your account"],
      select: false,
      validate: {
        validator: passwordValidator,
        message:
          "Password must contain minimum 8 characters, uppercase and lowercase letters, and at least one number and special character",
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

organizationSchema.pre("save", hashPasswordPreSave);
organizationSchema.pre("save", setPasswordChangeTimestampPreSave);

organizationSchema.pre(
  /^find/,
  async function (this: Query<unknown, IOrganization>) {
    if (this.getOptions()["includeInactive"]) return;
    this.where({ active: { $ne: false } });
  },
);

organizationSchema.pre(
  /^find/,
  async function (this: Query<unknown, IOrganization>) {
    if (this.getOptions()["includeUnverified"]) return;
    this.where({ emailIsVerified: { $ne: false } });
  },
);

organizationSchema.methods["matchPasswords"] = matchPasswords;
organizationSchema.methods["passwordChangedAfter"] = passwordChangedAfter;
organizationSchema.methods["createPasswordResetToken"] =
  createPaswordResetToken;

export type IOrganization = InferSchemaType<typeof organizationSchema>;

export const Organization = model<IOrganization>(
  "Organization",
  organizationSchema,
);
