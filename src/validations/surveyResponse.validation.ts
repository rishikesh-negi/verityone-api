import z from "zod";
import { surveyMetrics, numQuestions, surveyCruxes } from "../data/surveyQuestions.js";

const answerSchema = z.object({
  metric: z.enum(surveyMetrics),
  crux: z.enum(surveyCruxes),
  response: z
    .number()
    .min(1, "Response score should be at least 1")
    .max(10, "Response score cannot exceed 10"),
});

export const responseSchema = z.object({
  body: z.object({
    responses: z.array(answerSchema).refine((answers) => {
      const answerCruxes = new Set(answers.map((answer) => answer.crux));
      return (
        answers.length === numQuestions &&
        answerCruxes.size === numQuestions &&
        surveyCruxes.every((crux) => answerCruxes.has(crux))
      );
    }),
  }),
});
export type SurveyResponseData = z.infer<typeof responseSchema>;
