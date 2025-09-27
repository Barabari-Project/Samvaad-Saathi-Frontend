import React from "react";
import SectionCard from "./SectionCard";

type PerQuestionAnalysisProps = {
  perQuestion: Array<{
    questionAttemptId: number;
    questionText: string;
    keyTakeaways: string[];
    knowledgeScorePct: number;
    speechScorePct: number;
  }>;
};

const PerQuestionAnalysis: React.FC<PerQuestionAnalysisProps> = ({
  perQuestion,
}) => {
  return (
    <SectionCard title="Per Question Analysis">
      <div className="space-y-4">
        {perQuestion.map((question, index) => (
          <div
            key={question.questionAttemptId}
            className="bg-base-300 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">Question {index + 1}</h4>
              <div className="flex gap-4 text-xs">
                <span className="text-blue-600">
                  Knowledge: {question.knowledgeScorePct}%
                </span>
                <span className="text-green-600">
                  Speech: {question.speechScorePct}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {question.questionText}
            </p>
            <div>
              <h5 className="font-medium text-sm mb-1">Key Takeaways:</h5>
              <ul className="list-disc space-y-1 pl-5 text-xs text-gray-600">
                {question.keyTakeaways.map((takeaway, takeawayIndex) => (
                  <li key={takeawayIndex}>{takeaway}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default PerQuestionAnalysis;
