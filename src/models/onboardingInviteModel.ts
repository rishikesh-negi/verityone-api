import { model, Schema, type InferSchemaType } from "mongoose";

const onboardingInviteSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 6 * 30.5 * 24 * 60 * 60,
      select: false,
      immutable: true,
    },
  },
  { timestamps: true },
);

onboardingInviteSchema.index({ organization: 1, employee: 1 }, { unique: true });

type IOnboardingInvite = InferSchemaType<typeof onboardingInviteSchema>;

export const OnboardingInvite = model<IOnboardingInvite>(
  "OnboardingInvite",
  onboardingInviteSchema,
);
