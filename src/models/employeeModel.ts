import { Schema, model, type InferSchemaType } from "mongoose";
import {
  partialNameValidator,
  passwordValidator,
  usernameValidator,
} from "../utils/stringValidators.js";

const employeeSchema = new Schema({
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
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: [true, "This username is taken. Try a different one"],
    minlength: [3, "Username must have at least 3 characters"],
    maxlength: [25, "Username length cannot exceed 25 characters"],
    validate: {
      validator: usernameValidator,
      message:
        "Only letters, numbers, and underscores allowed. Must contain at least one letter",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required to secure your account"],
    select: false,
    validate: {
      validator: passwordValidator,
      message:
        "Password must contain minimum 8 characters, uppercase and lowercase letter/s, a number, and a special character",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
    immutable: true,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

export type IEmployee = InferSchemaType<typeof employeeSchema>;

export const Employee = model<IEmployee>("Employee", employeeSchema);
