export interface GenerateQuestionsResponse {
  interviewId: number;
  track: string;
  count: number;
  questions: string[];
  questionIds: number[];
  items: {
    interviewQuestionId: number;
    text: string;
    topic: string;
    difficulty: string | null;
    category: string;
    isFollowUp: boolean;
    parentQuestionId: number | null;
    followUpStrategy: string | null;
    supplement: string | null;
  }[];
  cached: boolean;
  llmModel: string | null;
  llmLatencyMs: number | null;
  llmError: string | null;
}
