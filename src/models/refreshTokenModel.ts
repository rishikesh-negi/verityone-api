import { model, Schema, type InferSchemaType } from "mongoose";

const refreshTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "The ID of the refresh token recipient is required"],
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
  expiresAt: {
    type: Date,
    required: [true, "Please specify the expiry time of the refresh token"],
  },
});

export type IRefreshToken = InferSchemaType<typeof refreshTokenSchema>;

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
