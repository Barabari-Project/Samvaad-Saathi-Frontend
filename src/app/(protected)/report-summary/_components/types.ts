// API Response Types
export interface ReportResponse {
  interviewId: number;
  track: string;
  metrics: {
    knowledgeCompetence: {
      average5pt: number;
      averagePct: number;
      breakdown: {
        accuracy: number;
        depth: number;
        coverage: number;
        relevance: number;
      };
    };
    speechStructure: {
      average5pt: number;
      averagePct: number;
      breakdown: {
        pacing: number;
        structure: number;
        pauses: number;
        grammar: number;
      };
    };
  };
  strengths: {
    heading: string;
    subtitle: string | null;
    groups: Array<{
      label: string;
      items: string[];
    }>;
  };
  areasOfImprovement: {
    heading: string;
    subtitle: string | null;
    groups: Array<{
      label: string;
      items: string[];
    }>;
  };
  actionableInsights: {
    heading: string;
    subtitle: string | null;
    groups: Array<{
      label: string;
      items: string[];
    }>;
  };
  metadata: {
    totalQuestions: number;
    usedQuestions: number;
    model: string;
    latencyMs: number;
    generatedAt: string;
    resumeUsed: boolean;
  };
  perQuestion: Array<{
    questionAttemptId: number;
    questionText: string;
    keyTakeaways: string[];
    knowledgeScorePct: number;
    speechScorePct: number;
  }>;
  perQuestionAnalysis: Array<{
    questionAttemptId: number;
    questionText: string;
    keyTakeaways: string[];
    knowledgeScorePct: number | null;
    speechScorePct: number;
    questionCategory: string;
    strengths: {
      heading: string;
      subtitle: string;
      groups: Array<{
        label: string;
        items: string[];
      }>;
    };
    areasOfImprovement: {
      heading: string;
      subtitle: string;
      groups: Array<{
        label: string;
        items: string[];
      }>;
    };
    actionableInsights: {
      heading: string;
      subtitle: string;
      groups: Array<{
        label: string;
        items: string[];
      }>;
    };
  }>;
  topicHighlights: {
    strengthsTopics: string[];
    improvementTopics: string[];
  };
}

export type PerQuestionAnalysisProps = {
  perQuestionAnalysis: ReportResponse["perQuestionAnalysis"];
};
