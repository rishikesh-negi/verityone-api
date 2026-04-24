import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { emailAddressFormatValidator, usernameValidator } from "../utils/stringValidators.js";

const userAccountRegistrySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    refPath: "userType",
    required: [true, "Account registry must belong to a user account"],
    index: true,
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    unique: true,
    index: true,
    validate: { validator: emailAddressFormatValidator, message: "Invalid email address format" },
  },
  username: {
    type: String,
    required: true,
    immutable: true,
    unique: [true, "This username is taken. Try a different one"],
    index: true,
    validate: {
      validator: usernameValidator,
      message: "Only letters, numbers, and underscores allowed. Must contain at least one letter",
    },
  },
  userType: { type: String, required: true, immutable: true, enum: ["Employee", "Organization"] },
});

type IUserAccountRegistry = InferSchemaType<typeof userAccountRegistrySchema>;

export const UserAccountRegistry = mongoose.model<IUserAccountRegistry>(
  "UserAccountRegistry",
  userAccountRegistrySchema,
);
