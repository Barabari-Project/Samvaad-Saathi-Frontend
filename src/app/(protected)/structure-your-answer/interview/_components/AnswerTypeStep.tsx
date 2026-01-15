"use client";

import { ArrowRightIcon, MicrophoneIcon } from "@heroicons/react/24/solid";
import { AnswerType, getAnswerTypeLabel } from "../types";

interface AnswerTypeStepProps {
  questionText: string;
  category: string;
  currentAnswerType: AnswerType;
  currentStep: number;
  totalSteps: number;
  onComplete: () => void;
}

const AnswerTypeStep = ({
  questionText,
  category,
  currentAnswerType,
  onComplete,
}: AnswerTypeStepProps) => {
  const answerTypeLabel = getAnswerTypeLabel(currentAnswerType);

  return (
    <div className="flex flex-col px-6 py-8">
      {/* Answer Type Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {answerTypeLabel}
        </h2>
        <p className="text-sm text-gray-600">
          Provide your answer for the {answerTypeLabel.toLowerCase()} aspect
        </p>
      </div>

      {/* Question Text */}
      <div className="mb-8 bg-gray-50 rounded-lg p-4">
        <p className="text-lg leading-relaxed text-gray-900">{questionText}</p>
      </div>

      {/* Category Tag */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-yellow-100 text-gray-800 text-sm rounded">
          {category?.toUpperCase()}
        </span>
      </div>

      {/* Done Button */}
      <div className="flex justify-end mt-auto pt-6">
        <button onClick={onComplete} className="btn btn-neutral">
          Record {answerTypeLabel}
          <MicrophoneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AnswerTypeStep;
