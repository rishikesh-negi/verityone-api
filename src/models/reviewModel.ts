import { model, Schema, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema({
  anonymousId: { type: Schema.Types.UUID, required: [true, "An anonymous review ID is required"] },
  organization: {
    type: Schema.ObjectId,
    ref: "Organization",
    required: [true, "A review must be for an organization"],
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

reviewSchema.index({ organization: 1, anonymousId: 1 }, { unique: true });

export type IReview = InferSchemaType<typeof reviewSchema>;

export const Review = model<IReview>("Review", reviewSchema);
