export interface Option {
  label: string;
  /** 0–4 score contribution */
  value: number;
}

export type Dimension =
  | "adaptability"
  | "skills"
  | "financial"
  | "learning"
  | "outlook";

export interface Question {
  id: string;
  dimension: Dimension;
  prompt: string;
  options: Option[];
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
  adaptability: "Adaptability",
  skills: "Transferable Skills",
  financial: "Financial Readiness",
  learning: "Learning Momentum",
  outlook: "Career Outlook",
};

export const questions: Question[] = [
  {
    id: "q1",
    dimension: "outlook",
    prompt: "How would you describe your current career situation?",
    options: [
      { label: "Growing — my field feels like it's expanding", value: 4 },
      { label: "Stable — things feel steady for now", value: 3 },
      { label: "Uncertain — I'm not sure where my field is heading", value: 1 },
      { label: "At risk — I can see real changes coming to my role", value: 0 },
    ],
  },
  {
    id: "q2",
    dimension: "outlook",
    prompt: "How much of your day-to-day work involves repetitive, rules-based tasks?",
    options: [
      { label: "Very little — mostly judgment, creativity, or people work", value: 4 },
      { label: "Some — a mix of routine and non-routine work", value: 2 },
      { label: "A lot — much of my work follows set procedures", value: 1 },
      { label: "Almost all of it", value: 0 },
    ],
  },
  {
    id: "q3",
    dimension: "skills",
    prompt: "If you had to change careers tomorrow, how confident are you that your skills would transfer?",
    options: [
      { label: "Very confident — my skills apply to many fields", value: 4 },
      { label: "Somewhat confident — some would transfer", value: 3 },
      { label: "Not very confident — my skills feel specialized", value: 1 },
      { label: "I honestly don't know what would transfer", value: 0 },
    ],
  },
  {
    id: "q4",
    dimension: "skills",
    prompt: "Which best describes your comfort with new technology and tools at work?",
    options: [
      { label: "I'm usually one of the first to learn new tools", value: 4 },
      { label: "I adapt once tools are established", value: 3 },
      { label: "I learn only what's required", value: 1 },
      { label: "I tend to avoid new tools when I can", value: 0 },
    ],
  },
  {
    id: "q5",
    dimension: "learning",
    prompt: "When did you last intentionally learn a new skill for your career?",
    options: [
      { label: "Within the last 3 months", value: 4 },
      { label: "Within the last year", value: 3 },
      { label: "1–3 years ago", value: 1 },
      { label: "I can't remember", value: 0 },
    ],
  },
  {
    id: "q6",
    dimension: "learning",
    prompt: "How clear are you on which skills would be most valuable for you to learn next?",
    options: [
      { label: "Very clear — I know exactly what to learn", value: 4 },
      { label: "Somewhat clear — I have a general idea", value: 2 },
      { label: "Unclear — there's too much conflicting advice", value: 1 },
      { label: "No idea — that's why I'm here", value: 0 },
    ],
  },
  {
    id: "q7",
    dimension: "financial",
    prompt: "If your income stopped today, how long could you cover your essential expenses?",
    options: [
      { label: "6+ months", value: 4 },
      { label: "3–6 months", value: 3 },
      { label: "1–3 months", value: 1 },
      { label: "Less than 1 month", value: 0 },
    ],
  },
  {
    id: "q8",
    dimension: "financial",
    prompt: "How many income sources does your household currently have?",
    options: [
      { label: "Multiple, including some independent of my job", value: 4 },
      { label: "Two (e.g., two earners or a side income)", value: 3 },
      { label: "One steady source", value: 2 },
      { label: "One, and it feels unstable", value: 0 },
    ],
  },
  {
    id: "q9",
    dimension: "adaptability",
    prompt: "When your industry or role changes unexpectedly, how do you usually respond?",
    options: [
      { label: "I adapt quickly and often find opportunity in it", value: 4 },
      { label: "I adjust after some initial stress", value: 3 },
      { label: "I find change draining and slow to navigate", value: 1 },
      { label: "I tend to feel stuck or anxious about it", value: 0 },
    ],
  },
  {
    id: "q10",
    dimension: "adaptability",
    prompt: "How strong is your professional network outside your current employer?",
    options: [
      { label: "Strong — I could reach many people for opportunities", value: 4 },
      { label: "Moderate — a handful of useful connections", value: 3 },
      { label: "Weak — mostly limited to current coworkers", value: 1 },
      { label: "Almost nonexistent", value: 0 },
    ],
  },
];
