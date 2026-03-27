export const surveyQuestions = {
  socialHarmony: {
    unfairDiscrimination: {
      aspect: "Social Harmony",
      label: "unfair-discrimination",
      question:
        "Rate how often employees experience unfair discrimination from colleagues or superiors at work.",
    },
    workplaceIsolation: {
      aspect: "Social Harmony",
      label: "workplace-isolation",
      question: "Rate how often you feel isolated from team members or superiors at work.",
    },
    fairAndEqualTreatment: {
      aspect: "Social Harmony",
      label: "fair-equal-treatment",
      question:
        "Rate the fairness and equality in how employees—including your subordinates, colleagues, and superiors—are generally treated at work.",
    },
    officePoliticsPrevalence: {
      aspect: "Social Harmony",
      label: "office-politics-prevalence",
      question: "Rate how common or prevalent office politics is at work.",
    },
    officePoliticsNegativeImpact: {
      aspect: "Social Harmony",
      label: "office-politics-negative-impact",
      question:
        "Rate the extent to which office politics negatively impacts the workplace at <ORGANIZATION>.",
    },
  },

  leadershipCompetence: {
    managersGeneralEfficacy: {
      aspect: "Leadership Competence",
      label: "managers-general-efficacy",
      question: "Rate the general effectiveness and efficacy of your direct managers.",
    },
    managersTasksEfficacy: {
      aspect: "Leadership Competence",
      label: "managers-tasks-efficacy",
      question: "Rate how effective your managers are at ensuring tasks are completed by the team.",
    },
    mentorshipFrequency: {
      aspect: "Leadership Competence",
      label: "mentorship-frequency",
      question:
        "Rate how often you receive support, guidance, or mentorship from your superiors at work.",
    },
    mentorshipQuality: {
      aspect: "Leadership Competence",
      label: "mentorship-quality",
      question:
        "Rate the quality of support, guidance, or mentorship you receive from your superiors at work.",
    },
    taskClarityFrequency: {
      aspect: "Leadership Competence",
      label: "task-clarity-frequency",
      question: "Rate how often your leaders or managers provide clear tasks and expectations.",
    },
  },

  leadershipCommunicationEffectiveness: {
    leadershipCommunicationFrequency: {
      aspect: "Leadership Communication Effectiveness",
      label: "leadership-communication-frequency",
      question: "Rate how often you receive communication from leadership.",
    },
    leadershipCommunicationQuality: {
      aspect: "Leadership Communication Effectiveness",
      label: "leadership-communication-quality",
      question: "Rate the quality of communication you receive from leadership.",
    },
    feedbackFrequency: {
      aspect: "Leadership Communication Effectiveness",
      label: "feedback-frequency",
      question: "Rate how often you receive feedback from leadership.",
    },
    feedbackQuality: {
      aspect: "Leadership Communication Effectiveness",
      label: "feedback-quality",
      question: "Rate the quality of feedback you receive from leadership.",
    },
  },

  leadershipTransparencyAndFairness: {
    leadershipTransparency: {
      aspect: "Leadership Transparency & Fairness",
      label: "leadership-transparency",
      question:
        "Rate the level of transparency and honesty demonstrated by your leaders or managers towards you and your team.",
    },
    leadershipAccountability: {
      aspect: "Leadership Transparency & Fairness",
      label: "leadership-accountability",
      question:
        "Rate the extent of accountability and ownership demonstrated by upper management and leadership.",
    },
    fairEvaluation: {
      aspect: "Leadership Transparency & Fairness",
      label: "fair-evaluation",
      question: "Rate how fair leadership is when evaluating employees’ performance.",
    },
    employeeIncludedDecisionMaking: {
      aspect: "Leadership Transparency & Fairness",
      label: "employee-included-decision-making",
      question:
        "Rate how much say employees have in leadership’s decisions that directly or indirectly affect them.",
    },
    workloadDistribution: {
      aspect: "Leadership Transparency & Fairness",
      label: "workload-distribution",
      question:
        "Rate how fairly and evenly workload is distributed within your team at <ORGANIZATION>.",
    },
  },

  teamCompetence: {
    teamGeneralEfficacy: {
      aspect: "Team Competence",
      label: "team-general-efficacy",
      question: "Rate the general effectiveness and efficacy of your team members.",
    },
    teamTasksEfficacy: {
      aspect: "Team Competence",
      label: "team-tasks-efficacy",
      question: "Rate how effective your team members are at ensuring tasks are completed on time.",
    },
    teamCollaboration: {
      aspect: "Team Competence",
      label: "team-collaboration",
      question: "Rate how collaborative and supportive your team members are at work.",
    },
    teamMembersAccountability: {
      aspect: "Team Competence",
      label: "team-members-accountability",
      question:
        "Rate the extent of accountability and ownership demonstrated by your team members.",
    },
  },

  teamCommunicationEffectiveness: {
    teamCommunicationFrequency: {
      aspect: "Team Communication Effectiveness",
      label: "team-communication-frequency",
      question: "Rate how often you receive communication from colleagues or team members?",
    },
    teamCommunicationQuality: {
      aspect: "Team Communication Effectiveness",
      label: "team-communication-quality",
      question: "Rate the quality of communication you receive from colleagues or team members.",
    },
    teamResponsiveness: {
      aspect: "Team Communication Effectiveness",
      label: "team-responsiveness",
      question: "Rate how responsive your team members are to your communication.",
    },
  },

  careerClarityAndDirection: {
    workSkillsAlignment: {
      aspect: "Career Clarity & Direction",
      label: "work-skills-alignment",
      question:
        "Rate the extent to which your daily work aligns with your role and the core skill set you were hired for.",
    },
    careerGrowthPathClarity: {
      aspect: "Career Clarity & Direction",
      label: "career-growth-path-clarity",
      question: "Rate how clear your career growth path is at <ORGANIZATION>.",
    },
    careerGoalsSupport: {
      aspect: "Career Clarity & Direction",
      label: "career-goals-support",
      question: "Rate how well leadership supports your long-term career goals.",
    },
  },

  employeeAutonomy: {
    employeeMicromanagement: {
      aspect: "Employee Autonomy",
      label: "employee-micromanagement",
      question: "Rate how often managers micromanage employees at work.",
    },
    employeeAutonomy: {
      aspect: "Employee Autonomy",
      label: "employee-autonomy",
      question:
        "Rate how much autonomy and individual decision-making power you have at <ORGANIZATION>.",
    },
    leadershipTrustInEmployeeDecisions: {
      aspect: "Employee Autonomy",
      label: "leadership-trust-in-employee-decisions",
      question: "Rate how much leadership trusts employees to make right decisions.",
    },
  },

  compensationSatisfaction: {
    salarySatisfaction: {
      aspect: "Compensation Satisfaction",
      label: "salary-satisfaction",
      question: "Rate your level of satisfaction with your current salary.",
    },
    totalCompensationFairness: {
      aspect: "Compensation Satisfaction",
      label: "total-compensation-fairness",
      question:
        "Rate the fairness of your total compensation (including salary, benefits, and other perks) compared to the industry standards for your role.",
    },
    perksBenefits: {
      aspect: "Compensation Satisfaction",
      label: "perks-benefits",
      question: "Rate the perks and benefits available in your role at <ORGANIZATION>.",
    },
    careerGrowthSatisfaction: {
      aspect: "Compensation Satisfaction",
      label: "career-growth-satisfaction",
      question:
        "Rate your level of satisfaction with the promotions and career progression you’ve experienced at <ORGANIZATION>.",
    },
  },
};
