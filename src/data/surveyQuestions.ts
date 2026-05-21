export type CruxRatingOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SurveyQuestion = {
  metric: string;
  crux: string;
  question: string;
};

export type SurveyAnswer = Omit<SurveyQuestion, "question"> & {
  answer: CruxRatingOptions;
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    metric: "social-harmony",
    crux: "unfair-discrimination",
    question:
      "Rate the extent to which your colleagues and managers foster a workplace free from unfair discrimination.",
  },
  {
    metric: "social-harmony",
    crux: "workplace-isolation",
    question: "Rate how often you feel isolated from team members or superiors at work.",
  },
  {
    metric: "social-harmony",
    crux: "fair-equal-treatment",
    question:
      "Rate the fairness and equality in how employees—including your subordinates, colleagues, and superiors—are generally treated at work.",
  },
  {
    metric: "social-harmony",
    crux: "office-politics-prevalence",
    question: "Rate how common or prevalent office politics is at work.",
  },
  {
    metric: "social-harmony",
    crux: "office-politics-negative-impact",
    question:
      "Rate the extent to which office politics negatively impacts the workplace at <ORGANIZATION>.",
  },

  {
    metric: "leadership-competence",
    crux: "managers-general-efficacy",
    question: "Rate the general effectiveness and efficacy of your direct managers.",
  },
  {
    metric: "leadership-competence",
    crux: "managers-tasks-efficacy",
    question: "Rate how effective your managers are at ensuring tasks are completed by the team.",
  },
  {
    metric: "leadership-competence",
    crux: "mentorship-frequency",
    question:
      "Rate how often you receive support, guidance, or mentorship from your superiors at work.",
  },
  {
    metric: "leadership-competence",
    crux: "mentorship-quality",
    question:
      "Rate the quality of support, guidance, or mentorship you receive from your superiors at work.",
  },
  {
    metric: "leadership-competence",
    crux: "task-clarity-frequency",
    question: "Rate how often your leaders or managers provide clear tasks and expectations.",
  },

  {
    metric: "leadership-communication-effectiveness",
    crux: "leadership-communication-frequency",
    question: "Rate how often you receive communication from leadership.",
  },
  {
    metric: "leadership-communication-effectiveness",
    crux: "leadership-communication-quality",
    question: "Rate the quality of communication you receive from leadership.",
  },
  {
    metric: "leadership-communication-effectiveness",
    crux: "feedback-frequency",
    question: "Rate how often you receive feedback from leadership.",
  },
  {
    metric: "leadership-communication-effectiveness",
    crux: "feedback-quality",
    question: "Rate the quality of feedback you receive from leadership.",
  },

  {
    metric: "leadership-transparency-fairness",
    crux: "leadership-transparency",
    question:
      "Rate the level of transparency and honesty demonstrated by your leaders or managers towards you and your team.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "leadership-accountability",
    question:
      "Rate the extent of accountability and ownership demonstrated by upper management and leadership.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "fair-evaluation",
    question: "Rate how fair leadership is when evaluating employees' performance.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "employee-included-decision-making",
    question:
      "Rate how much say employees have in leadership's decisions that directly or indirectly affect them.",
  },
  {
    metric: "leadership-transparency-fairness",
    crux: "workload-distribution",
    question:
      "Rate how fairly and evenly workload is distributed within your team at <ORGANIZATION>.",
  },

  {
    metric: "perceived-team-competence",
    crux: "team-general-efficacy",
    question: "Rate the general effectiveness and efficacy of your team members.",
  },
  {
    metric: "perceived-team-competence",
    crux: "team-tasks-efficacy",
    question: "Rate how effective your team members are at ensuring tasks are completed on time.",
  },
  {
    metric: "perceived-team-competence",
    crux: "team-collaboration",
    question: "Rate how collaborative and supportive your team members are at work.",
  },
  {
    metric: "perceived-team-competence",
    crux: "team-members-accountability",
    question: "Rate the extent of accountability and ownership demonstrated by your team members.",
  },

  {
    metric: "team-communication-effectiveness",
    crux: "team-communication-frequency",
    question: "Rate how often you receive communication from colleagues or team members?",
  },
  {
    metric: "team-communication-effectiveness",
    crux: "team-communication-quality",
    question: "Rate the quality of communication you receive from colleagues or team members.",
  },
  {
    metric: "team-communication-effectiveness",
    crux: "team-responsiveness",
    question: "Rate how responsive your team members are to your communication.",
  },

  {
    metric: "career-clarity-direction",
    crux: "work-skills-alignment",
    question:
      "Rate the extent to which your daily work aligns with your role and the core skill set you were hired for.",
  },
  {
    metric: "career-clarity-direction",
    crux: "career-growth-path-clarity",
    question: "Rate how clear your career growth path is at <ORGANIZATION>.",
  },
  {
    metric: "career-clarity-direction",
    crux: "career-goals-support",
    question: "Rate how well leadership supports your long-term career goals.",
  },

  {
    metric: "employee-autonomy",
    crux: "employee-micromanagement",
    question: "Rate how often managers micromanage employees at work.",
  },
  {
    metric: "employee-autonomy",
    crux: "employee-autonomy",
    question:
      "Rate how much autonomy and individual decision-making power you have at <ORGANIZATION>.",
  },
  {
    metric: "employee-autonomy",
    crux: "leadership-trust-in-employee-decisions",
    question: "Rate how much leadership trusts employees to make right decisions.",
  },

  {
    metric: "compensation-satisfaction",
    crux: "salary-satisfaction",
    question: "Rate your level of satisfaction with your current salary.",
  },
  {
    metric: "compensation-satisfaction",
    crux: "total-compensation-fairness",
    question:
      "Rate the fairness of your total compensation (including salary, benefits, and other perks) compared to the industry standards for your role.",
  },
  {
    metric: "compensation-satisfaction",
    crux: "perks-benefits",
    question: "Rate the perks and benefits available in your role at <ORGANIZATION>.",
  },
  {
    metric: "compensation-satisfaction",
    crux: "career-growth-satisfaction",
    question:
      "Rate your level of satisfaction with the promotions and career progression you've experienced at <ORGANIZATION>.",
  },

  {
    metric: "upskilling-opportunities",
    crux: "learning-opportunities-frequency",
    question:
      "Rate how often learning and skill development opportunities are available in your role at <ORGANIZATION>.",
  },
  {
    metric: "upskilling-opportunities",
    crux: "learning-opportunities-quality",
    question:
      "Rate how often learning and skill development opportunities are available in your role at <ORGANIZATION>.",
  },
  {
    metric: "upskilling-opportunities",
    crux: "growth-after-upskilling",
    question:
      "Rate the extent to which <ORGANIZATION> supports career growth for employees who upskill.",
  },

  {
    metric: "workload-and-burnout",
    crux: "workload-manageability",
    question: "Rate how manageable your workload usually is.",
  },
  {
    metric: "workload-and-burnout",
    crux: "overwhelming-workload-frequency",
    question: "Rate how often you feel overwhelmed by work.",
  },
  {
    metric: "workload-and-burnout",
    crux: "high-stress-burnout",
    question: "Rate how often you experience high stress or symptoms of burnout at <ORGANIZATION>.",
  },

  {
    metric: "work-life-balance",
    crux: "working-hours-satisfaction",
    question: "Rate your satisfaction with the working hours at <ORGANIZATION>.",
  },
  {
    metric: "work-life-balance",
    crux: "flexibility-level",
    question: "Rate the level of flexibility provided by <ORGANIZATION>.",
  },
  {
    metric: "work-life-balance",
    crux: "remote-hybrid-support",
    question: "Rate how often remote or hybrid work is supported at <ORGANIZATION>.",
  },
  {
    metric: "work-life-balance",
    crux: "leave-policy-satisfaction",
    question:
      "Rate your satisfaction with the flexibility and adequacy of <ORGANIZATION>'s leave policy.",
  },
  {
    metric: "work-life-balance",
    crux: "employee-personal-time",
    question: "Rate how well <ORGANIZATION> respects employees' personal time.",
  },

  {
    metric: "psychological-safety",
    crux: "comfort-in-sharing-opinions",
    question: "Rate how well <ORGANIZATION> respects employees' personal time.",
  },
  {
    metric: "psychological-safety",
    crux: "contrarian-opinions-backlash-frequency",
    question:
      "Rate how often employees get backlash for sharing contrarian (unpopular) opinions or suggestions at work.",
  },
  {
    metric: "psychological-safety",
    crux: "safety-in-raising-concern",
    question: "Rate how safe you feel raising concerns without fear of negative consequences.",
  },

  {
    metric: "recognition-and-appreciation",
    crux: "employees-appreciation-frequency",
    question: "Rate how often employees are appreciated by leadership for their work.",
  },
  {
    metric: "recognition-and-appreciation",
    crux: "employee-appreciation-perception",
    question: "Rate how appreciated you feel for your work and contributions.",
  },

  {
    metric: "employee-sentiment",
    crux: "voluntary-extra-effort",
    question: "Rate your willingness to volunteer extra effort to complete your tasks effectively.",
  },
  {
    metric: "employee-sentiment",
    crux: "pride-in-organization",
    question: "Rate your willingness to volunteer extra effort to complete your tasks effectively.",
  },
  {
    metric: "employee-sentiment",
    crux: "overall-satisfaction",
    question: "Rate your level of satisfaction with your current job.",
  },

  {
    metric: "employee-retention",
    crux: "approximate-employee-tenure",
    question:
      "Approximately how many more years do you intend to remain employed at <ORGANIZATION>?",
  },
];

export const surveyMetrics = [...new Set(surveyQuestions.map((q) => q.metric))];
export const surveyCruxes = surveyQuestions.map((q) => q.crux);
export const numQuestions = surveyQuestions.length;

export const generateRemarksForCruxes = (
  cruxesWithScores: Record<
    string,
    {
      metric: string;
      crux: string;
      score: number;
    } & { [K: string]: unknown }
  >,
) => {
  Object.values(cruxesWithScores).forEach((cruxResult) => {
    if (cruxResult.crux === "unfair-discrimination") {
      switch (true) {
        case cruxResult.score <= 2:
          cruxResult["remark"] = "Very poor";
          cruxResult["suggestions"] =
            "This score points to a severe breakdown in workplace safety and inclusivity, indicating that unfair discrimination is actively harming your workforce. Leadership must intervene immediately by conducting external, confidential audits and enforcing a zero-tolerance policy. Team building exercises could prove effective in uprooting personal differences or grudges. Addressing this right away is critical to stop toxic behavior, protect your employees' mental well-being, foster an amicable workplace environment, and prevent costly legal liabilities or a total collapse in talent retention.";
          break;
        case cruxResult.score <= 4:
          cruxResult["remark"] = "Poor";
          cruxResult["suggestions"] =
            "This score highlights significant gaps in fairness, suggesting that bias or discriminatory behavior is noticeably affecting the daily employee experience to a great extent. Leadership needs to implement mandatory, actionable anti-bias training while establishing clear, safe reporting channels. Rooting out these shortcomings will rebuild trust, make employees feel valued, and significantly reduce the turnover and burnout caused by an unsupportive environment.";
          break;
        case cruxResult.score <= 6:
          cruxResult["remark"] = "Satisfactory";
          cruxResult["suggestions"] =
            'While the workplace is baseline compliant, a mediocre score here shows that subtle biases, passive-aggressive interactions, or microaggressions are likely keeping the environment from being truly amicable and supportive. Actively leveling up by hosting open-door feedback forums and reviewing promotion fairness will transform the culture from just "tolerable" to genuinely supportive. This proactive push will boost overall team morale, spark greater collaboration, and help employees fully engage with their work.';
          break;
        case cruxResult.score <= 8:
          cruxResult["remark"] = "Good";
          cruxResult["suggestions"] =
            "The workplace is doing well in preventing discrimination, but there is still room to fine-tune the culture. Leadership could optionally consider introducing voluntary mentorship programs, employee-led team coordination exercises, etc., to further strengthen community bonds. These extra steps can elevate a healthy workplace into a highly attractive, premium environment for top-tier talent.";
          break;
        case cruxResult.score <= 10:
          cruxResult["remark"] = "Excellent";
          cruxResult["suggestions"] =
            "An outstanding score here proves that your managers and teams have successfully built a safe, equitable, and deeply respectful culture. Leadership should maintain the status quo and keep up the great work by continuing to champion these exact values in everyday operations. Your current approach is a major asset for retaining your best people—keep doing exactly what you are doing.";
          break;
      }
    }

    if (cruxResult.crux === "workplace-isolation") {
      switch (true) {
        case cruxResult.score <= 2:
          cruxResult["remark"] = "Very poor";
          cruxResult["suggestions"] =
            "This score signals a severe crisis, meaning employees feel deeply cut off and invisible to their teams and managers. Leadership must treat this with absolute urgency and immediately establish mandatory one-on-one check-ins and structured team touchpoints. Recreational team-building activities are highly advised. Breaking through this extreme isolation right away will rescue plummeting morale, protect employee mental health, and prevent a wave of sudden resignations.";
          break;
        case cruxResult.score <= 4:
          cruxResult["remark"] = "Poor";
          cruxResult["suggestions"] =
            "This score shows noticeable gaps in workplace connection, indicating that a lack of communication or fragmented remote/hybrid setups are leaving employees out in the cold. Leadership should introduce regular team syncs and clear communication guidelines to bridge these gaps. Actively fixing these shortcomings will rebuild team cohesion, reduce the anxiety of working in a vacuum, and noticeably improve talent retention.";
          break;
        case cruxResult.score <= 6:
          cruxResult["remark"] = "Satisfactory";
          cruxResult["suggestions"] =
            "While employees aren't entirely stranded, communication is likely purely transactional, leaving them feeling only loosely tied to the organization. Intentionally improving this aspect by organizing cross-functional projects or casual virtual coffee chats will strengthen professional relationships. Stepping up connection here will unlock better collaboration, make people feel like they belong, and boost overall job satisfaction.";
          break;
        case cruxResult.score <= 8:
          cruxResult["remark"] = "Good";
          cruxResult["suggestions"] =
            "The workplace has a healthy level of connection, but leadership could optionally introduce a few creative tweaks to make it even better. For instance, you might consider setting up voluntary peer-buddy systems for new hires or hosting occasional informal team-building events. These optional actions can further solidify work friendships and turn a good environment into an incredibly sticky one for top performers.";
          break;
        case cruxResult.score <= 10:
          cruxResult["remark"] = "Excellent";
          cruxResult["suggestions"] =
            "An outstanding score here proves your workplace is a highly connected community where employees feel deeply supported and included by peers and superiors alike. Leadership should maintain the status quo, protect the open culture you have built, and keep it up. Your current approach is highly effective at making people feel valued and keeping talent from looking elsewhere.";
          break;
      }
    }

    if (cruxResult.crux === "fair-equal-treatment") {
      switch (true) {
        case cruxResult.score <= 2:
          cruxResult["remark"] = "Very poor";
          cruxResult["suggestions"] =
            "This score indicates a critical crisis where favoritism, bias, or glaring inequality are deeply entrenched in the daily workplace experience. Leadership must treat this with immediate urgency by launching an independent review of internal practices and standardizing how promotions, workloads, and disciplinary actions are handled. Correcting these severe flaws right away is vital to stop rapidly spreading resentment, avoid legal risks, and halt a costly mass exodus of talent.";
          break;
        case cruxResult.score <= 4:
          cruxResult["remark"] = "Poor";
          cruxResult["suggestions"] =
            "A score in this range highlights significant shortcomings, showing that employees widely perceive inconsistencies and unfairness in how people are treated. Leadership needs to establish transparent guidelines for performance evaluations and ensure objective metrics are used across all teams. Remedying these gaps will restore broken trust, boost lagging morale, and significantly improve talent retention by showing the team that hard work—not politics—matters.";
          break;
        case cruxResult.score <= 6:
          cruxResult["remark"] = "Satisfactory";
          cruxResult["suggestions"] =
            "While there are no blatant violations, a mediocre score here suggests that subtle biases or inconsistent management styles are keeping the playing field from being truly level. Improving this aspect by introducing regular, standardized check-ins and objective criteria for workplace rewards will make the environment noticeably fairer. Elevating your equity practices here will unlock higher motivation, foster healthier collaboration, and increase overall job satisfaction.";
          break;
        case cruxResult.score <= 8:
          cruxResult["remark"] = "Good";
          cruxResult["suggestions"] =
            "The organization generally does a good job of maintaining fairness, but there are optional steps that could refine the experience even further. Leadership might consider offering voluntary leadership workshops focused on objective decision-making, or creating an employee advisory panel to regularly review internal policies. These extra steps can help polish a good culture into an industry-leading standard for fairness.";
          break;
        case cruxResult.score <= 10:
          cruxResult["remark"] = "Excellent";
          cruxResult["suggestions"] =
            "An outstanding score demonstrates that your workplace has successfully built a deeply rooted culture of genuine equality and respect across all levels of the hierarchy. Leadership should maintain the status quo, continue reinforcing these transparent practices, and keep up the fantastic work. Your commitment to fairness is a massive competitive advantage for retaining your best people and attracting top-tier talent.";
          break;
      }
    }
  });
};
