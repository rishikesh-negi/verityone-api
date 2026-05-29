import z from "zod";
import { surveyMetrics, numQuestions, surveyCruxes } from "../data/surveyQuestions.js";

const answerSchema = z.object({
  metric: z.enum(surveyMetrics),
  crux: z.enum(surveyCruxes),
  response: z
    .number()
    .min(1, "Response score cannot be less than 1")
    .max(10, "Response score cannot exceed 10"),
});

export const surveyResponseZSchema = z.object({
  body: z.object({
    answers: z.array(answerSchema).refine((answers) => {
      const answerCruxes = new Set(answers.map((answer) => answer.crux));
      return (
        answers.length === numQuestions &&
        answerCruxes.size === numQuestions &&
        surveyCruxes.every((crux) => answerCruxes.has(crux))
      );
    }),
  }),
});
export type SurveyResponseData = z.infer<typeof surveyResponseZSchema>;
