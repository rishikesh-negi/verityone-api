import { model, Schema, type InferSchemaType } from "mongoose";
import { metrics, numQuestions, questionLabels } from "../data/surveyQuestions.js";

type SurveyQuestionResponse = {
  metric: number;
  label: string;
  response: number;
};

const surveyResponseSchema = new Schema({
  responses: {
    required: true,
    type: [
      {
        metric: { required: true, type: String, enum: metrics },
        label: { required: true, type: String, enum: questionLabels },
        response: {
          required: true,
          type: Number,
          min: [1, "Response score should be at least 1"],
          max: [10, "Response score cannot exceed 10"],
        },
      },
    ],
    validate: {
      validator: function (v: SurveyQuestionResponse[]) {
        return v.length === numQuestions;
      },
    },
  },
});

export type ISurveyResponseSchema = InferSchemaType<typeof surveyResponseSchema>;

export const SurveyResponse = model<ISurveyResponseSchema>("SurveyResponse", surveyResponseSchema);
