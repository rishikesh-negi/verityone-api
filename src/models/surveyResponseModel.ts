import { model, Schema, type InferSchemaType } from "mongoose";
import { numQuestions, surveyCruxes, surveyMetrics } from "../data/surveyQuestions.js";

type SurveyQuestionAnswer = {
  metric: number;
  crux: string;
  answer: number;
};

const surveyResponseSchema = new Schema(
  {
    survey: {
      type: Schema.Types.ObjectId,
      ref: "Survey",
      required: [true, "A response must belong to a survey"],
      immutable: true,
      index: true,
    },
    anonymousId: {
      type: Schema.Types.UUID,
      ref: "UserIdentityVault",
      required: [true, "This field is required to verify genuine employee participation"],
      immutable: true,
      index: true,
    },
    answers: {
      required: [true, "Cannot create a survey response without answers"],
      type: [
        {
          metric: { type: String, required: true, enum: surveyMetrics },
          crux: { type: String, required: true, enum: surveyCruxes },
          answer: {
            type: Number,
            required: true,
            min: [1, "Answer cannot be less than 1"],
            max: [10, "Answer cannot exceed 10"],
          },
        },
      ],
      validate: {
        validator: (v: SurveyQuestionAnswer[]) => {
          if (v.length !== numQuestions) return false;
          const responseCruxesSet = new Set(v.map((answer) => answer.crux));
          if (responseCruxesSet.size !== numQuestions) return false;
          if (!surveyCruxes.every((crux) => responseCruxesSet.has(crux))) return false;
          return true;
        },
        message: "Invalid or unprocessable survey response",
      },
    },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

surveyResponseSchema.index({ anonymousId: 1, survey: 1 }, { unique: true });

export type ISurveyResponse = InferSchemaType<typeof surveyResponseSchema>;

export const SurveyResponse = model<ISurveyResponse>("SurveyResponse", surveyResponseSchema);
