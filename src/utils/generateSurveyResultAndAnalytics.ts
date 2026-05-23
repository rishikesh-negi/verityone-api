import type { HydratedDocument } from "mongoose";
import { surveyCruxes, surveyMetrics } from "../data/surveyQuestions.js";
import type { ISurveyResponse } from "../models/surveyResponseModel.js";

const kebabToCamelCase = (str: string) =>
  str
    .split("-")
    .map((word, i) => (i === 0 ? word : `${word[0]!.toUpperCase()}${word.slice(1)}`))
    .join("");

export const generateSurveyResult = (responses: HydratedDocument<ISurveyResponse>[]) => {
  const allAnswers = responses.flatMap((res) => res.answers);

  // 0.  TO DO: Create a model for survey results

  // 1. Compute the average score for all cruxes:
  const cruxAverages = Object.fromEntries(
    surveyCruxes.map((crux) => [
      kebabToCamelCase(crux),
      allAnswers
        .filter((answer) => answer.crux === crux)
        .reduce(
          (accum, curr, i, arr) => ({
            metric: curr.metric,
            crux: curr.crux,
            score:
              i < arr.length - 1
                ? curr.answer + accum.score
                : (curr.answer + accum.score) / arr.length,
            remark:
              i === arr.length - 1
                ? (curr.answer + accum.score) / arr.length > 8
                  ? "excellent"
                  : (curr.answer + accum.score) / arr.length > 6
                    ? "good"
                    : (curr.answer + accum.score) / arr.length > 4
                      ? "satisfactory"
                      : (curr.answer + accum.score) / arr.length > 2
                        ? "poor"
                        : "critical"
                : "",
          }),
          { metric: "", crux: "", score: 0, remark: "" },
        ),
    ]),
  );

  // 2. Compute the average score for all metrics:
  const metricAverages = Object.fromEntries(
    surveyMetrics.map((metric) => [
      kebabToCamelCase(metric),
      Object.values(cruxAverages)
        .filter((cruxScore) => cruxScore.metric === metric)
        .reduce(
          (accum, curr, i, arr) => ({
            metric: curr.metric,
            score:
              i < arr.length - 1
                ? curr.score + accum.score
                : (curr.score + accum.score) / arr.length,
          }),
          {
            metric: "",
            score: 0,
          },
        ),
    ]),
  );

  // 3. Add remarks/suggestions for each crux and metric. Store the the final result in the DB:
};
