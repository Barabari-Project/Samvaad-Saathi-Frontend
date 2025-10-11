"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { SCREEN_VIEW } from "@/lib/posthog/events";
import { trackScreenView } from "@/lib/posthog/tracking.utils";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ActionableSteps from "./_components/ActionableSteps";
import FinalSummary from "./_components/FinalSummary";
import OverallScoreSummary from "./_components/OverallScoreSummary";
import PerQuestionAnalysis from "./_components/PerQuestionAnalysis";
import SkeletonLoader from "./_components/SkeletonLoader";
import SummaryOverview from "./_components/SummaryOverview";
import { ReportResponse } from "./_components/types";

type ReportTab = "per-question" | "final-summary";

const ReportSummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ReportTab>("per-question");

  const apiClient = createApiClient(APIService.ANALYSIS);

  const scrollToSection = (sectionId: string, tab: ReportTab) => {
    setActiveTab(tab);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

      <div
        role="tablist"
        className="tabs tabs-box mb-3 w-full bg-gray-200 p-2 font-bold text-2xl"
      >
        <a
          role="tab"
          className={`tab flex-1 ${
            activeTab === "per-question"
              ? "tab-active shadow-2xl rounded-xl"
              : ""
          }`}
          onClick={() =>
            scrollToSection("per-question-analysis", "per-question")
          }
        >
          Per Question Analysis
        </a>
        <a
          role="tab"
          className={`tab flex-1 ${
            activeTab === "final-summary"
              ? "tab-active shadow-2xl rounded-xl"
              : ""
          }`}
          onClick={() => scrollToSection("final-summary", "final-summary")}
        >
          Speech Summary
        </a>
      </div>

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
