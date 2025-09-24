"use client";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { useSearchParams } from "next/navigation";
import React from "react";

// API Response Types
interface ReportResponse {
  interviewId: number;
  knowledgeCompetence: {
    averageDomainScore: number;
    coverageTopics: string[];
    details: Record<string, unknown>;
    improvements: string[];
    strengths: string[];
  };
  message: string;
  overallScore: number;
  saved: boolean;
  speechStructureFluency: {
    averageCommunicationScore: number;
    averagePaceScore: number;
    averagePauseScore: number;
    clarity: number;
    details: Record<string, unknown>;
    grammar: number;
    recommendations: string[];
    structure: number;
    vocabulary: number;
  };
  summary: {
    overview: string;
    perQuestion: Array<{
      communicationScore: number;
      domainScore: number;
      improvements: string[];
      paceScore: number;
      pauseScore: number;
      questionAttemptId: number;
      questionText: string;
      strengths: string[];
    }>;
    title: string;
  };
}

type ScoreBarProps = {
  label: string;
  score: number; // 0-100 percentage
};

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-base-content">{label}</span>
        <span className="font-medium text-base-content">
          {Math.round(score)}%
        </span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={Math.min(100, Math.max(0, score))}
        max="100"
      />
    </div>
  );
};

const SectionCard: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-lg font-semibold">{title}</h2>
      <div className="text-base-content">{children}</div>
    </div>
  </div>
);

const ReportSummaryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");

  const apiClient = createApiClient(APIService.ANALYSIS);

  const {
    data: reportData,
    isLoading,
    error,
  } = apiClient.useQuery<ReportResponse>({
    key: ["report", interviewId],
    url: ENDPOINTS.ANALYSIS.FETCH_REPORT(interviewId || ""),
    enabled: !!interviewId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
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
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Web Development</h1>
      </div>

      {/* Summary Overview */}
      <SectionCard title="Summary Overview">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500">Candidate Name</div>
          <div className="text-right font-medium">
            Interview #{reportData.interviewId}
          </div>

          <div className="text-gray-500">Interview Date</div>
          <div className="text-right font-medium">
            {new Date().toLocaleDateString()}
          </div>

          <div className="text-gray-500">Role/Topic</div>
          <div className="text-right font-medium">Frontend Development</div>
        </div>
      </SectionCard>

      {/* Overall Score Summary */}
      <SectionCard title="Overall Score Summary">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="font-medium">Knowledge Competence</h3>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {Math.round(reportData.knowledgeCompetence.averageDomainScore)}%
              </span>
            </div>
            <ScoreBar
              label="Average"
              score={reportData.knowledgeCompetence.averageDomainScore}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">Speech & Structure</h3>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {Math.round(
                  reportData.speechStructureFluency.averageCommunicationScore
                )}
                %
              </span>
            </div>
            <ScoreBar
              label="Average"
              score={
                reportData.speechStructureFluency.averageCommunicationScore
              }
            />
          </div>
        </div>
      </SectionCard>

      {/* Final Summary */}
      <SectionCard title="Final Summary">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-green-700">Strengths</h4>
            <div className="space-y-2">
              <h5 className="font-medium text-green-600">Knowledge-Related</h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {reportData.knowledgeCompetence.strengths.map(
                  (strength, index) => (
                    <li key={index}>{strength}</li>
                  )
                )}
              </ul>
            </div>
            <div className="space-y-2 mt-4">
              <h5 className="font-medium text-green-600">
                Communication-Related
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>Clear and structured responses</li>
                <li>Good use of technical terminology</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-red-700">
              Areas Of Improvement
            </h4>
            <div className="space-y-2">
              <h5 className="font-medium text-red-600">Knowledge-Related</h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {reportData.knowledgeCompetence.improvements.map(
                  (improvement, index) => (
                    <li key={index}>{improvement}</li>
                  )
                )}
              </ul>
            </div>
            <div className="space-y-2 mt-4">
              <h5 className="font-medium text-red-600">
                Communication-Related
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {reportData.speechStructureFluency.recommendations.map(
                  (rec, index) => (
                    <li key={index}>{rec}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default ReportSummaryPage;
