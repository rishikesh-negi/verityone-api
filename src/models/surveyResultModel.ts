import { model, Schema, type InferSchemaType } from "mongoose";
import { surveyCruxes, surveyMetrics } from "../data/surveyQuestions.js";
import { SurveyResponse } from "./surveyResponseModel.js";

const surveyResultSchema = new Schema(
  {
    survey: {
      type: Schema.Types.ObjectId,
      required: [true, "A survey result must belong to a survey"],
      ref: "Survey",
    },
    participants: { type: Number, required: true },
    cruxResults: {
      type: [
        {
          metric: { type: String, required: true, enum: surveyMetrics },
          crux: { type: String, required: true, enum: surveyCruxes },
          score: {
            type: Number,
            required: true,
            min: [1, "Crux score cannot be less than 1"],
            max: [10, "Crux score cannot be more than 10"],
          },
          remark: {
            type: String,
            required: true,
            enum: ["critical", "poor", "satisfactory", "good", "excellent"],
          },
          suggestions: {
            type: String,
            required: true,
            minLength: [50, "Suggestion is too short"],
            maxLength: [1000, "Suggestion cannot exceed 1000 characters"],
          },
        },
      ],
    },
    metricScores: {
      type: [
        {
          metric: { type: String, required: true, enum: surveyMetrics },
          score: {
            type: Number,
            required: true,
            min: [1, "Metric score cannot be less than 1"],
            max: [10, "Metric score cannot be more than 10"],
          },
        },
      ],
    },
    createdAt: { type: Date, default: Date.now(), immutable: true },
  },
  { timestamps: true },
);

surveyResultSchema.post("save", async function (doc) {
  await SurveyResponse.deleteMany({ survey: doc.survey });
});

export type ISurveyResult = InferSchemaType<typeof surveyResultSchema>;
export const SurveyResult = model<ISurveyResult>("SurveyResult", surveyResultSchema);
