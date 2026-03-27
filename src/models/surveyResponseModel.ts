import { Schema } from "mongoose";

const surveyQuestionsSchema = new Schema({
  socialHarmony: {
    type: {
      unfairDiscrimination: {
        type: {
          label: {
            type: String,
            default: "unfair-discrimination",
            immutable: true,
          },
          question: {
            type: String,
            default:
              "How often do employees experience unfair discrimination from colleagues or superiors at <ORGANIZATION>?",
            immutable: true,
          },
        },
      },
      workplaceIsolation: {
        type: {
          label: {
            type: String,
            default: "workplace-isolation",
            immutable: true,
          },
          question: {
            type: String,
            default:
              "How often do you feel isolated from colleagues or superiors at <ORGANIZATION>?",
            immutable: true,
          },
        },
      },
      officePoliticsPrevalence: {
        type: {
          label: {
            type: String,
            default: "office-politics-prevalence",
            immutable: true,
          },
          question: {
            type: String,
            default: "How common or prevalent is office politics at <ORGANIZATION>?",
            immutable: true,
          },
        },
      },
    },
  },
});
