"use client";

import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { AnswerType, getAnswerTypeLabel } from "../types";

interface QuestionReportProps {
  questionText: string;
  category: string;
  completedAnswerTypes: AnswerType[];
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

const QuestionReport = ({
  questionText,
  category,
  completedAnswerTypes,
  onNextQuestion,
  isLastQuestion,
}: QuestionReportProps) => {
  return (
    <div className="flex flex-col px-6 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Question Complete!
        </h1>
        <p className="text-sm text-gray-600">
          You&apos;ve completed all answer types for this question.
        </p>
      </div>

      {/* Question Summary */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <p className="text-lg leading-relaxed text-gray-900">{questionText}</p>
        <div className="mt-3">
          <span className="inline-block px-3 py-1 bg-yellow-100 text-gray-800 text-sm rounded">
            {category?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Completed Answer Types */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Completed Steps
        </h2>
        <div className="space-y-3">
          {completedAnswerTypes.map((answerType, index) => (
            <div
              key={answerType}
              className="flex items-center gap-3 bg-green-50 rounded-lg p-4"
            >
              <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {index + 1}. {getAnswerTypeLabel(answerType)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Great Work!
        </h3>
        <p className="text-sm text-gray-700">
          You&apos;ve successfully structured your answer using the{" "}
          {category.replace("_", " ").toUpperCase()} framework. Review your
          responses and continue to the next question.
        </p>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-auto pt-6">
        <button onClick={onNextQuestion} className="btn btn-primary">
          {isLastQuestion ? "Finish Practice" : "Next Question"}
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionReport;
