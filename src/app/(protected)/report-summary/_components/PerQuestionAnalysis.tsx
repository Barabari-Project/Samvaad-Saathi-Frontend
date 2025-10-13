import React from "react";
import { PerQuestionAnalysisProps } from "./types";

const PerQuestionAnalysis: React.FC<PerQuestionAnalysisProps> = ({
  questionAnalysis,
}) => {
  const getQuestionTypeBadgeClass = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("technical question")) {
      return "badge-primary";
    } else if (lowerType.includes("technical allied")) {
      return "badge-success";
    } else if (lowerType.includes("behavioral")) {
      return "badge-warning";
    }
    return "badge-secondary";
  };

  return (
    <div className="space-y-4" id="per-question-analysis">
      {questionAnalysis.map((question, index) => {
        const hasFeedback = question.feedback !== null;

        return (
          <div
            key={question.id}
            className="collapse collapse-arrow bg-base-100 border border-base-300 shadow-2xl"
          >
            <input type="radio" name="question-accordion" />
            <div className="collapse-title min-w-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span
                    className={`badge badge-xs ${getQuestionTypeBadgeClass(
                      question.type
                    )}`}
                  >
                    {question.type.toUpperCase()}
                  </span>
                  <span className="text-sm text-base-content/70">
                    {index + 1}/{question.totalQuestions}
                  </span>
                </div>
              </div>
              <div className="mt-2 min-w-0">
                <p className="text-sm text-base-content break-words overflow-wrap-anywhere whitespace-normal">
                  {question.question}
                </p>
              </div>
              <div className="divider" />
            </div>

            <div className="collapse-content">
              {hasFeedback ? (
                <div className="space-y-6">
                  {/* Strengths */}
                  {question.feedback!.knowledgeRelated.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg text-green-700 mb-2">
                        Strengths
                      </h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        {question.feedback!.knowledgeRelated.strengths.map(
                          (item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Areas of Improvement */}
                  {question.feedback!.knowledgeRelated.areasOfImprovement
                    .length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-error mb-2">
                        Areas of Improvement
                      </h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        {question.feedback!.knowledgeRelated.areasOfImprovement.map(
                          (item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Actionable Insights */}
                  {question.feedback!.knowledgeRelated.actionableInsights
                    .length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg text-blue-700 mb-2">
                        Actionable Insights
                      </h4>
                      <div className="space-y-3">
                        {question.feedback!.knowledgeRelated.actionableInsights.map(
                          (insight, insightIndex) => (
                            <div key={insightIndex} className="">
                              <h5 className="font-semibold  mb-1">
                                {insight.title}
                              </h5>
                              <ul className="list-disc space-y-1 pl-5 text-sm">
                                <li className="text-sm text-gray-700">
                                  {insight.description}
                                </li>
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className=" text-center text-gray-500">
                  <p className="text-sm">
                    No report available — question not attempted.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerQuestionAnalysis;
