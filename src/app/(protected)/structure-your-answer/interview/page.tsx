"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { AnswerTypeStep, QuestionReport } from "./_components";
import { AnswerType, getFrameworkForCategory } from "./types";

interface StructuredPracticeItem {
  interviewQuestionId: number;
  text: string;
  topic: string;
  difficulty: string | null;
  category: string;
  isFollowUp: boolean;
  parentQuestionId: number | null;
  followUpStrategy: string | null;
  supplement: string | null;
  structureHint: string;
}

interface StructuredPracticeResponse {
  interviewId: number | null;
  track: string;
  count: number;
  questions: string[];
  questionIds: number[] | null;
  items: StructuredPracticeItem[];
  llmModel: string | null;
  llmLatencyMs: number | null;
  llmError: string | null;
  cached: boolean;
}

const StructureYourAnswerInterviewPage = () => {
  const [structuredPractice, setStructuredPractice] =
    useState<StructuredPracticeResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswerTypeIndex, setCurrentAnswerTypeIndex] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [hasStartedPractice, setHasStartedPractice] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const apiClient = createApiClient(APIServiceV2.INTERVIEWS);

  const { mutateAsync: generateStructuredPractice } = apiClient.useMutation<
    StructuredPracticeResponse,
    Record<string, never>
  >({
    url: ENDPOINTS_V2.GENERATE_STRUCTURED_PRACTICE,
    method: "post",
  });

  useEffect(() => {
    const callApi = async () => {
      try {
        setIsLoading(true);
        const response = await generateStructuredPractice({});
        setStructuredPractice(response);
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    callApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide welcome screen after 2 seconds when loading completes
  useEffect(() => {
    if (!isLoading && showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, showWelcome]);

  // Reset answer type index and practice state when question changes
  useEffect(() => {
    setCurrentAnswerTypeIndex(0);
    setShowReport(false);
    setHasStartedPractice(false);
  }, [currentQuestionIndex]);

  const currentQuestion = structuredPractice?.items[currentQuestionIndex];

  // Get framework for current question's category
  const getCurrentFramework = (): AnswerType[] => {
    if (!currentQuestion) return [];
    return getFrameworkForCategory(currentQuestion.category);
  };

  const currentFramework = getCurrentFramework();
  const currentAnswerType = currentFramework[currentAnswerTypeIndex];
  const totalAnswerTypes = currentFramework.length;

  // Handle completion of current answer type
  const handleAnswerTypeComplete = () => {
    if (currentAnswerTypeIndex < totalAnswerTypes - 1) {
      // Move to next answer type
      setCurrentAnswerTypeIndex((prev) => prev + 1);
    } else {
      // All answer types completed, show report
      setShowReport(true);
    }
  };

  // Handle starting practice for current question
  const handleStartPractice = () => {
    setHasStartedPractice(true);
  };

  // Handle moving to next question after report
  const handleNextQuestion = () => {
    if (
      structuredPractice &&
      currentQuestionIndex < structuredPractice.items.length - 1
    ) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswerTypeIndex(0);
      setShowReport(false);
      setHasStartedPractice(false);
    } else {
      // All questions completed - could redirect to completion page
      // For now, just show a message or redirect
      console.log("All questions completed!");
    }
  };

  // Welcome screen component (shown during loading and after loading)
  const WelcomeScreen = ({ isLoading }: { isLoading: boolean }) => (
    <div className="flex flex-col h-[80vh] items-center justify-center p-6">
      <div className="relative max-w-md w-full">
        {/* Gradient border using wrapper */}
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-2xl p-[2px] shadow-lg">
          <div className="bg-white rounded-xl p-8">
            <div className="text-gray-800 text-xl font-medium text-center">
              {isLoading
                ? "Generating your practice questions..."
                : "Hi ! Lets start your practice 👋"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show welcome screen during loading or if welcome state is true
  if (isLoading || showWelcome) {
    return <WelcomeScreen isLoading={isLoading} />;
  }

  if (!structuredPractice || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center pt-10 gap-4">
        <p>No questions available.</p>
      </div>
    );
  }

  // If no framework found for category, show error
  if (currentFramework.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-10 gap-4">
        <p>No framework found for category: {currentQuestion.category}</p>
      </div>
    );
  }

  // Show report if all answer types are completed
  if (showReport) {
    return (
      <QuestionReport
        questionText={currentQuestion.text}
        category={currentQuestion.category}
        completedAnswerTypes={currentFramework}
        practiceId={structuredPractice?.interviewId?.toString() || ""}
        questionIndex={currentQuestionIndex}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={
          currentQuestionIndex === structuredPractice.items.length - 1
        }
      />
    );
  }

  // Show question overview with Start Practice button if practice hasn't started
  if (!hasStartedPractice) {
    return (
      <div className="flex flex-col px-6 py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Today&apos;s Interview Practice
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / structuredPractice.count) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-700 whitespace-nowrap">
              {currentQuestionIndex + 1}/{structuredPractice.count}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <p className="text-lg leading-relaxed text-gray-900">
            {currentQuestion.text}
          </p>
        </div>

        {/* Category Tag */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-yellow-100 text-gray-800 text-sm rounded">
            {currentQuestion.category?.toUpperCase()}
          </span>
        </div>

        {/* Framework Hint */}
        {currentQuestion.structureHint && (
          <div className="mb-8">
            <p className="text-sm text-gray-700">
              {currentQuestion.structureHint}
            </p>
          </div>
        )}

        {/* Start Practice Button */}
        <div className="flex justify-end mt-auto">
          <button onClick={handleStartPractice} className="btn btn-primary">
            Start Practice
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Show answer type step after practice has started
  return (
    <AnswerTypeStep
      questionText={currentQuestion.text}
      category={currentQuestion.category}
      currentAnswerType={currentAnswerType}
      currentStep={currentAnswerTypeIndex + 1}
      totalSteps={totalAnswerTypes}
      practiceId={structuredPractice?.interviewId?.toString() || ""}
      questionIndex={currentQuestionIndex}
      answerTypeIndex={currentAnswerTypeIndex}
      onComplete={handleAnswerTypeComplete}
    />
  );
};

export default StructureYourAnswerInterviewPage;
