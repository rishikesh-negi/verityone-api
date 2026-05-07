import { model, Query, Schema, type InferSchemaType } from "mongoose";
import { INVITE_VALIDITY_SECONDS } from "../utils/constants.js";

const onboardingInviteSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected", "orphaned"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: INVITE_VALIDITY_SECONDS,
      select: false,
      immutable: true,
    },
  },
  { timestamps: true },
);

onboardingInviteSchema.pre(/^find/, async function (this: Query<unknown, IOnboardingInvite>) {
  if (this.getOptions()["includeAllInvites"]) return;
  this.where({ status: "pending" });
});

onboardingInviteSchema.index({ organization: 1, employee: 1 }, { unique: true });

type IOnboardingInvite = InferSchemaType<typeof onboardingInviteSchema>;

export const OnboardingInvite = model<IOnboardingInvite>(
  "OnboardingInvite",
  onboardingInviteSchema,
);
