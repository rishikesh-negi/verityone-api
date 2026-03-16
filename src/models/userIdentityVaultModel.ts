import { model, Schema, type InferSchemaType } from "mongoose";

const userIdentityVaultSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: "Employee",
    required: [true, "User ID is required for creating an anonymous identity"],
  },
  anonymousId: {
    type: Schema.Types.UUID,
    requried: [true, "A UUID is required for mapping reviews to the anonymous identity"],
  },
  tokenHash: {
    type: String,
    required: [true, "A token is required for tokenized access to the anonymous identity"],
  },
  active: { type: Boolean, default: true, select: false },
  createdAt: { type: Date, default: Date.now(), select: false },
});

export type IUserIdentityVault = InferSchemaType<typeof userIdentityVaultSchema>;

export const UserIdentityVault = model<IUserIdentityVault>(
  "UserIdentityVault",
  userIdentityVaultSchema,
);
