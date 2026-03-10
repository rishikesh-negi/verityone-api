import { model, Schema, type InferSchemaType } from "mongoose";

const deviceSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "The ID of the token recipient is required"],
      refPath: "userType",
    },
    userType: {
      type: String,
      required: [
        true,
        "Please specify the account type ('Employee' or 'Organization')",
      ],
      enum: ["Employee", "Organization"],
    },
    tokenHash: {
      type: String,
      required: [
        true,
        "Refresh token is required to validate the access tokens",
      ],
    },
    userAgent: String,
    ipAddress: String,
    expiresAt: {
      type: Date,
      required: [true, "Please specify the expiry time of the refresh token"],
    },
  },
  { timestamps: true },
);

export type IDeviceSession = InferSchemaType<typeof deviceSessionSchema>;

export const RefreshToken = model<IDeviceSession>(
  "RefreshToken",
  deviceSessionSchema,
);
