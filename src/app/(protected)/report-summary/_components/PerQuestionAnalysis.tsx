import React from "react";
import SectionCard from "./SectionCard";

type PerQuestionAnalysisProps = {
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
};

const PerQuestionAnalysis: React.FC<PerQuestionAnalysisProps> = ({
  perQuestionAnalysis,
}) => {
  const getQuestionTypeColor = (questionText: string) => {
    const lowerText = questionText.toLowerCase();
    if (
      lowerText.includes("describe") ||
      lowerText.includes("specific instance") ||
      lowerText.includes("feedback")
    ) {
      return "badge-warning"; // Behavioral question
    } else if (
      lowerText.includes("react") ||
      lowerText.includes("javascript") ||
      lowerText.includes("css") ||
      lowerText.includes("api")
    ) {
      return "badge-info"; // Technical question
    } else {
      return "badge-success"; // Technical Allied question
    }
  };

  const getQuestionTypeLabel = (questionText: string) => {
    const lowerText = questionText.toLowerCase();
    if (
      lowerText.includes("describe") ||
      lowerText.includes("specific instance") ||
      lowerText.includes("feedback")
    ) {
      return "Behavioral question";
    } else if (
      lowerText.includes("react") ||
      lowerText.includes("javascript") ||
      lowerText.includes("css") ||
      lowerText.includes("api")
    ) {
      return "Technical question";
    } else {
      return "Technical Allied question";
    }
  };

  return (
    <>
      <div className="space-y-4">
        {perQuestionAnalysis.map((question, index) => {
          const questionTypeColor = getQuestionTypeColor(question.questionText);
          const questionTypeLabel = getQuestionTypeLabel(question.questionText);

          return (
            <div
              key={question.questionAttemptId}
              className="collapse collapse-arrow bg-base-100 border border-base-300 shadow-2xl"
            >
              <input type="radio" name="question-accordion" />
              <div className="collapse-title">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`badge ${questionTypeColor}`}>
                      {questionTypeLabel}
                    </div>
                    <span className="text-sm text-base-content/70">
                      {index + 1}/{perQuestionAnalysis.length}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-base-content">
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
                        <p className="text-sm text-base-content/70 mb-3">
                          {question.strengths.subtitle}
                        </p>
                      )}
                      <div className="space-y-3">
                        {question.strengths.groups.map(
                          (group, groupIndex) =>
                            group.items.length > 0 && (
                              <div key={groupIndex}>
                                <h5 className="font-medium text-success/80 mb-1">
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
                      <p className="text-sm text-base-content/70 mb-3">
                        {question.areasOfImprovement.subtitle}
                      </p>
                    )}
                    <div className="space-y-3">
                      {question.areasOfImprovement.groups.map(
                        (group, groupIndex) => (
                          <div key={groupIndex}>
                            <h5 className="font-medium text-error/80 mb-1">
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
                      <p className="text-sm text-base-content/70 mb-3">
                        {question.actionableInsights.subtitle}
                      </p>
                    )}
                    <div className="space-y-3">
                      {question.actionableInsights.groups.map(
                        (group, groupIndex) => (
                          <div key={groupIndex}>
                            <h5 className="font-medium text-info/80 mb-1">
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
