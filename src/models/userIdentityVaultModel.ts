import { model, Schema, type InferSchemaType } from "mongoose";

const userIdentityVaultSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    immutable: true,
    ref: "Employee",
    required: [true, "User ID is required for creating an anonymous identity"],
  },
  anonymousId: {
    type: Schema.Types.UUID,
    immutable: true,
    requried: [true, "A UUID is required to create the user identity vault"],
  },
  tokenHash: {
    type: String,
    immutable: true,
    required: [true, "A token is required to authorize review creation"],
  },
  active: { type: Boolean, default: true, select: false },
  createdAt: { type: Date, default: Date.now(), select: false },
});

export type IUserIdentityVault = InferSchemaType<typeof userIdentityVaultSchema>;

export const UserIdentityVault = model<IUserIdentityVault>(
  "UserIdentityVault",
  userIdentityVaultSchema,
);
