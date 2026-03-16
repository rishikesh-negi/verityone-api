import { model, Schema, type InferSchemaType } from "mongoose";
import { DEVICE_SESSION_VALIDITY_IN_SECONDS } from "../utils/constants.js";

const deviceSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "The ID of the token recipient is required"],
      refPath: "userType",
    },
    userType: {
      type: String,
      required: [true, "Please specify the account type ('Employee' or 'Organization')"],
      enum: ["Employee", "Organization"],
    },
    tokenHash: {
      type: String,
      required: [true, "Refresh token is required to validate the access tokens"],
    },
    userAgent: { type: String, default: null },
    ipAddress: { type: String, default: null },
    createdAt: {
      type: Date,
      expires: DEVICE_SESSION_VALIDITY_IN_SECONDS,
      default: Date.now(),
      select: false,
      immutable: true,
    },
  },
  { timestamps: true },
);

export type IDeviceSession = InferSchemaType<typeof deviceSessionSchema>;

export const DeviceSession = model<IDeviceSession>("DeviceSession", deviceSessionSchema);
