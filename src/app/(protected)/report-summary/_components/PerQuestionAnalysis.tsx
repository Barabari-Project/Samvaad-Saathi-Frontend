import React from "react";
import { PerQuestionAnalysisProps } from "./types";

const PerQuestionAnalysis: React.FC<PerQuestionAnalysisProps> = ({
  perQuestionAnalysis,
}) => {
  return (
    <>
      <div className="space-y-4">
        {perQuestionAnalysis.map((question, index) => {
          return (
            <div
              key={question.questionAttemptId}
              className="collapse collapse-arrow bg-base-100 border border-base-300 shadow-2xl"
            >
              <input type="radio" name="question-accordion" />
              <div className="collapse-title min-w-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span
                      className={`badge badge-xs ${
                        question.questionCategory?.toLowerCase() === "tech"
                          ? "badge-primary"
                          : question.questionCategory?.toLowerCase() ===
                            "behavioral"
                          ? "badge-warning"
                          : question.questionCategory?.toLowerCase() ===
                            "tech_allied"
                          ? "badge-success"
                          : "badge-secondary"
                      }`}
                    >
                      {question.questionCategory
                        ? question.questionCategory
                            .replaceAll("_", " ")
                            .toUpperCase()
                        : "QUESTION"}
                    </span>
                    <span className="text-sm text-base-content/70">
                      {index + 1}/{perQuestionAnalysis.length}
                    </span>
                  </div>
                </div>
                <div className="mt-2 min-w-0">
                  <p className="text-sm text-base-content break-words overflow-wrap-anywhere whitespace-normal">
                    {question.questionText}
                  </p>
                </div>
              </div>

              <div className="collapse-content">
                <div className="space-y-6 pt-4">
                  {/* Key Takeaways */}
                  {question.keyTakeaways.length > 0 && (
                    <div>
                      <h4 className="font-medium text-base-content mb-2">
                        Key Takeaways
                      </h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-base-content/80">
                        {question.keyTakeaways.map(
                          (takeaway, takeawayIndex) => (
                            <li key={takeawayIndex}>{takeaway}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {question.strengths.groups.some(
                    (group) => group.items.length > 0
                  ) && (
                    <div>
                      <h4 className="font-semibold text-success mb-2">
                        {question.strengths.heading}
                      </h4>
                      {question.strengths.subtitle && (
                        <p className="text-sm text-base-content/70 mb-3 font-bold">
                          {question.strengths.subtitle}
                        </p>
                      )}
                      <div className="space-y-3">
                        {question.strengths.groups.map(
                          (group, groupIndex) =>
                            group.items.length > 0 && (
                              <div key={groupIndex}>
                                <h5 className="font-bold text-base-content/70 mb-1">
                                  {group.label}
                                </h5>
                                <ul className="list-disc space-y-1 pl-5 text-sm">
                                  {group.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Areas of Improvement */}
                  <div>
                    <h4 className="font-semibold text-error mb-2">
                      {question.areasOfImprovement.heading}
                    </h4>
                    {question.areasOfImprovement.subtitle && (
                      <p className="text-sm text-base-content/70 mb-3 font-bold">
                        {question.areasOfImprovement.subtitle}
                      </p>
                    )}
                    <div className="space-y-3">
                      {question.areasOfImprovement.groups.map(
                        (group, groupIndex) => (
                          <div key={groupIndex}>
                            <h5 className="font-bold text-base-content/70 mb-1">
                              {group.label}
                            </h5>
                            <ul className="list-disc space-y-1 pl-5 text-sm">
                              {group.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Actionable Insights */}
                  <div>
                    <h4 className="font-semibold text-info mb-2">
                      {question.actionableInsights.heading}
                    </h4>
                    {question.actionableInsights.subtitle && (
                      <p className="text-sm text-base-content/70 mb-3 font-bold">
                        {question.actionableInsights.subtitle}
                      </p>
                    )}
                    <div className="space-y-3">
                      {question.actionableInsights.groups.map(
                        (group, groupIndex) => (
                          <div key={groupIndex}>
                            <h5 className="font-bold text-base-content/70 mb-1">
                              {group.label}
                            </h5>
                            <ul className="list-disc space-y-1 pl-5 text-sm">
                              {group.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PerQuestionAnalysis;
