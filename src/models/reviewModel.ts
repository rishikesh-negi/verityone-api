import { model, Query, Schema, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema({
  anonymousId: {
    type: Schema.Types.UUID,
    required: [true, "An anonymous review ID is required"],
    ref: "UserIdentityVault",
    index: true,
  },
  workplace: {
    type: Schema.Types.ObjectId,
    ref: "Workplace",
    required: [true, "A review must be for an workplace"],
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: [1, "Rating cannot be below 1"],
    max: [10, "Rating cannot exceed 10"],
  },
  reviewText: {
    type: String,
    trim: true,
    minLength: [20, "Review length should be at least 20 characters"],
    maxLength: [1000, "Review cannot exceed 1000 characters"],
  },
  biased: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now(), select: false, immutable: true },
});

reviewSchema.index({ workplace: 1, anonymousId: 1 }, { unique: true });

reviewSchema.pre(/^find/, async function (this: Query<unknown, IReview>) {
  this.populate({
    path: "workplace",
    select: "name city",
  });
});

export type IReview = InferSchemaType<typeof reviewSchema>;

export const Review = model<IReview>("Review", reviewSchema);
