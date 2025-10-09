"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { EVENTS, SCREEN_VIEW } from "@/lib/posthog/events";
import { trackScreenView } from "@/lib/posthog/tracking.utils";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import ActionableSteps from "./_components/ActionableSteps";
import FinalSummary from "./_components/FinalSummary";
import OverallScoreSummary from "./_components/OverallScoreSummary";
import PerQuestionAnalysis from "./_components/PerQuestionAnalysis";
import SkeletonLoader from "./_components/SkeletonLoader";
import SummaryOverview from "./_components/SummaryOverview";
import TopicHighlights from "./_components/TopicHighlights";

// API Response Types
interface ReportResponse {
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

const ReportSummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();

  const apiClient = createApiClient(APIService.ANALYSIS);

  const {
    data: reportData,
    isLoading,
    error,
  } = apiClient.useQuery<ReportResponse>({
    key: ["report", interviewId],
    url: ENDPOINTS.ANALYSIS.GET_SUMMARY_REPORT(interviewId || ""),
    enabled: !!interviewId,
  });

  useEffect(() => {
    trackScreenView(SCREEN_VIEW.OVERALL_REPORT_PAGE, interviewId || "");
  }, [interviewId]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error || !reportData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Error</h1>
          <p className="text-base-content/70">Failed to load report data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 sm:py-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {reportData?.track
            ? `${reportData?.track} Interview Summary Report`
            : "Web Development Interview Summary Report"}
        </h1>
      </div>

      <SummaryOverview
        interviewId={reportData.interviewId}
        candidateName={user?.authorizedUser?.name || "Unknown"}
        role={reportData?.track ?? "Web Developer"}
        date={reportData?.metadata?.generatedAt ?? ""}
      />

      <OverallScoreSummary
        knowledgeCompetence={reportData.metrics.knowledgeCompetence}
        speechStructure={reportData.metrics.speechStructure}
      />

      <PerQuestionAnalysis
        perQuestionAnalysis={reportData.perQuestionAnalysis}
      />

      <FinalSummary
        strengths={reportData.strengths}
        areasOfImprovement={reportData.areasOfImprovement}
      />

      <ActionableSteps actionableInsights={reportData.actionableInsights} />
    </div>
  );
};

export default ReportSummaryPage;
