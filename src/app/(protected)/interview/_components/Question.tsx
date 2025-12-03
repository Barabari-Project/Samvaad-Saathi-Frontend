"use client";

import { GenerateQuestionsResponse } from "../types";

interface QuestionProps {
  isLoading: boolean;
  question: GenerateQuestionsResponse["items"][number] | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const Question = ({
  isLoading,
  question,
  currentQuestionIndex = 0,
  totalQuestions = 0,
}: QuestionProps) => {
  if (isLoading) {
    return (
      <div className="w-full py-6 animate-pulse">
        {/* Top Row with Counter Skeleton */}
        <div className="flex justify-end mb-2">
          <div className="h-6 w-8 bg-slate-200 rounded"></div>
        </div>

        {/* Question Text Skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-6 bg-slate-200 rounded w-full"></div>
          <div className="h-6 bg-slate-200 rounded w-5/6"></div>
          <div className="h-6 bg-slate-200 rounded w-4/6"></div>
        </div>

        {/* Tag Skeleton */}
        <div className="flex">
          <div className="h-8 w-32 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="w-full py-6">
      {/* Top Row with Counter */}
      <div className="flex justify-end mb-2">
        <span className="text-lg text-slate-900 font-medium">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <p className="text-xl leading-[1.4] text-slate-900 font-normal">
          {question.text}
        </p>
      </div>

      {/* Tag */}
      <div className="flex">
        <span className="badge badge-lg badge-warning capitalize">
          {question.category}
        </span>
      </div>
    </div>
  );
};

export default Question;
