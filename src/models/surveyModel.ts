import { model, Schema, type InferSchemaType } from "mongoose";
import {
  numQuestions,
  surveyCruxes,
  surveyQuestions,
  type SurveyQuestion,
} from "../data/surveyQuestions.js";
import { surveyDurationInDaysOptions } from "../utils/constants.js";

const surveySchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "A survey must belong to an organization"],
      index: true,
    },
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
        validator(qns: SurveyQuestion[]) {
          if (!this.isModified("questions")) return true;
          const cruxes = qns.map((q) => q.crux);
          return qns.length === numQuestions && surveyCruxes.every((crux) => cruxes.includes(crux));
        },
      },
    },
    surveyDurationInDays: { type: Number, required: true, enum: surveyDurationInDaysOptions },
    hasConcluded: { type: Boolean, required: true, default: false },
    numParticipants: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now(), immutable: true },
    concludedAt: { type: Date, required: true, immutable: true },
  },
  { timestamps: true },
);

export type ISurvey = InferSchemaType<typeof surveySchema>;

export const Survey = model<ISurvey>("Survey", surveySchema);
