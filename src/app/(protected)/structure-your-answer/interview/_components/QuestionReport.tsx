"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  LightBulbIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

interface FrameworkSection {
  name: string;
  status: string;
  answerRecorded: boolean;
  timeSpentSeconds: number;
}

interface FrameworkProgress {
  frameworkName: string;
  sections: FrameworkSection[];
  completionPercentage: number;
  sectionsComplete: number;
  totalSections: number;
  progressMessage: string;
}

interface TimePerSection {
  sectionName: string;
  seconds: number;
}

interface QuestionReportResponse {
  answerId: number;
  practiceId: number;
  questionIndex: number;
  frameworkProgress: FrameworkProgress;
  timePerSection: TimePerSection[];
  keyInsight: string;
  analyzedAt: string;
  llmModel: string;
  llmLatencyMs: number;
}

interface QuestionReportProps {
  practiceId: string;
  questionIndex: number;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

const getSectionIcon = (sectionName: string) => {
  const name = sectionName.toLowerCase();
  if (name.includes("context")) {
    return ChatBubbleLeftRightIcon;
  }
  if (name.includes("theory")) {
    return BookOpenIcon;
  }
  if (name.includes("example")) {
    return LightBulbIcon;
  }
  if (name.includes("tradeoff") || name.includes("trade-off")) {
    return ScaleIcon;
  }
  if (name.includes("decision")) {
    return AcademicCapIcon;
  }
  return LightBulbIcon;
};

const formatTime = (seconds: number): string => {
  return `${seconds}s`;
};

const QuestionReport = ({
  practiceId,
  questionIndex,
  onNextQuestion,
  isLastQuestion,
}: QuestionReportProps) => {
  const apiClient = createApiClient(APIServiceV2.INTERVIEWS);

  const { data: analysisData, isLoading } =
    apiClient.useQuery<QuestionReportResponse>({
      key: ["structured-practice-analysis", practiceId, questionIndex],
      url: ENDPOINTS_V2.ANALYSE_STRUCTURED_PRACTICE_AUDIO(
        practiceId,
        questionIndex
      ),
      method: "get",
      enabled: !!practiceId && questionIndex !== undefined,
    });

  if (isLoading) {
    return (
      <div className="flex flex-col px-6 py-8 min-h-screen">
        <div className="mb-8">
          <p className="text-sm text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex flex-col px-6 py-8 min-h-screen">
        <div className="mb-8">
          <p className="text-sm text-gray-600">No analysis data available.</p>
        </div>
        <div className="flex justify-end mt-auto pt-6">
          <button onClick={onNextQuestion} className="btn btn-primary">
            {isLastQuestion ? "Finish Practice" : "Next Question"}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  const { frameworkProgress, timePerSection, keyInsight } = analysisData;

  return (
    <div className="flex flex-col px-6 py-8 min-h-screen bg-gray-50">
      {/* Overall Progress Section */}
      <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Overall Progress
        </h2>
        <p className="text-sm text-gray-600 mb-4">Framework Completion</p>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${frameworkProgress.completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <span className="text-lg font-bold text-green-600">
              {frameworkProgress.completionPercentage}%
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {frameworkProgress.sectionsComplete} of{" "}
            {frameworkProgress.totalSections} complete
          </span>
          <span className="text-sm font-medium text-green-600">
            {frameworkProgress.progressMessage}
          </span>
        </div>
      </div>

      {/* Framework Progress Section */}
      <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Framework Progress ({frameworkProgress.frameworkName})
        </h2>
        <div className="space-y-3">
          {frameworkProgress.sections.map((section, index) => {
            const IconComponent = getSectionIcon(section.name);
            const isComplete = section.answerRecorded;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-lg p-4 ${
                  isComplete
                    ? "bg-white border border-gray-200"
                    : "bg-orange-50 border border-orange-200"
                }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    isComplete ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{section.name}</p>
                  <p
                    className={`text-sm ${
                      isComplete ? "text-gray-600" : "text-orange-600"
                    }`}
                  >
                    {section.status}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {isComplete ? (
                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                  ) : (
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Spent Per Section */}
      <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Time Spent Per Section
          </h2>
        </div>
        <div className="space-y-2">
          {timePerSection.map((item, index) => {
            const section = frameworkProgress.sections.find(
              (s) => s.name.toLowerCase() === item.sectionName.toLowerCase()
            );
            const isIncomplete = section && !section.answerRecorded;

            return (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <span
                  className={`text-sm ${
                    isIncomplete ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {item.sectionName}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isIncomplete ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {formatTime(item.seconds)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KEY INSIGHT Section */}
      {keyInsight && (
        <div className="mb-6 bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <LightBulbIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">KEY INSIGHT</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{keyInsight}</p>
        </div>
      )}

      {/* Next Question Button */}
      <div className="flex justify-end mt-auto pt-6">
        <button
          onClick={onNextQuestion}
          className="btn btn-primary bg-gray-900 hover:bg-gray-800 text-white border-none"
        >
          {isLastQuestion ? "Finish Practice" : "Next Question"}
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionReport;
