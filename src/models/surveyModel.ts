import { model, Schema, type InferSchemaType } from "mongoose";
import {
  numQuestions,
  surveyCruxes,
  surveyQuestions,
  type SurveyQuestion,
} from "../data/surveyQuestions.js";

const surveySchema = new Schema(
  {
    questions: {
      type: [
        {
          metric: { type: String, trim: true, required: true },
          crux: { type: String, trim: true, required: true },
          question: { type: String, trim: true, required: true },
        },
      ],
      required: true,
      default: surveyQuestions,
      immutable: true,
      validate: {
        validator: (qns: SurveyQuestion[]) => {
          const cruxes = qns.map((q) => q.crux);
          return qns.length === numQuestions && surveyCruxes.every((crux) => cruxes.includes(crux));
        },
      },
    },
    numParticipants: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now(), immutable: true },
    concludesAt: { type: Date, immutable: true },
  },
  { timestamps: true },
);

export type ISurvey = InferSchemaType<typeof surveySchema>;

export const Survey = model<ISurvey>("Survey", surveySchema);
