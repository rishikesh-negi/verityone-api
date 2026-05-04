import { model, Schema, type InferSchemaType } from "mongoose";
import { metrics, numQuestions, questionCruxes } from "../data/surveyQuestions.js";

type SurveyQuestionResponse = {
  metric: number;
  crux: string;
  response: number;
};

const surveyResponseSchema = new Schema({
  responses: {
    required: true,
    type: [
      {
        metric: { required: true, type: String, enum: metrics },
        crux: { required: true, type: String, enum: questionCruxes },
        response: {
          required: true,
          type: Number,
          min: [1, "Response score should be at least 1"],
          max: [10, "Response score cannot exceed 10"],
        },
      },
    ],
    validate: {
      validator: (v: SurveyQuestionResponse[]) => {
        if (v.length !== numQuestions) return false;
        const responseCruxesSet = new Set(v.map((answer) => answer.crux));
        if (responseCruxesSet.size !== numQuestions) return false;
        if (!questionCruxes.every((crux) => responseCruxesSet.has(crux))) return false;
        return true;
      },
    },
  },
});

export type ISurveyResponseSchema = InferSchemaType<typeof surveyResponseSchema>;

export const SurveyResponse = model<ISurveyResponseSchema>("SurveyResponse", surveyResponseSchema);
