export type AnswerType =
  // Tech
  | "context"
  | "theory"
  | "example"
  | "tradeoffs"
  | "decision"
  // Tech Allied
  | "goal"
  | "constraints"
  | "decision"
  | "implementation"
  | "outcome"
  // Behavioral
  | "situation"
  | "task"
  | "action"
  | "result";

export const FRAMEWORKS: Record<string, AnswerType[]> = {
  tech: ["context", "theory", "example", "tradeoffs", "decision"],
  tech_allied: ["goal", "constraints", "decision", "implementation", "outcome"],
  behavioral: ["situation", "task", "action", "result"],
};

export const getFrameworkForCategory = (category: string): AnswerType[] => {
  const normalizedCategory = category.toLowerCase();
  return FRAMEWORKS[normalizedCategory] || [];
};

export const getAnswerTypeLabel = (answerType: AnswerType): string => {
  const labels: Record<AnswerType, string> = {
    context: "Context",
    theory: "Theory",
    example: "Example",
    tradeoffs: "Tradeoffs",
    decision: "Decision",
    goal: "Goal",
    constraints: "Constraints",
    implementation: "Implementation",
    outcome: "Outcome",
    situation: "Situation",
    task: "Task",
    action: "Action",
    result: "Result",
  };
  return labels[answerType] || answerType;
};
