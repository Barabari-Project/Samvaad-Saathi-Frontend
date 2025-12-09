"use client";
import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS, ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeView, Footer, Header, Question, Welcome } from "./_components";
import {
  GenerateQuestionsResponse,
  StartQuestionAttemptResponse,
} from "./types";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const InterviewPage = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const useResume = searchParams.get("useResume");
  const role = searchParams.get("role");

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // mic permission utils
  const {
    hasPermission,
    showModal,
    requestPermission,
    showPermissionModal,
    hidePermissionModal,
  } = useMicPermission();

  const apiClient = createApiClient(APIServiceV2.INTERVIEWS);

  const {
    mutateAsync: generateQuestions,
    isPending: isGeneratingQuestions,
    data: generatedQuestions,
  } = apiClient.useMutation<GenerateQuestionsResponse>({
    url: ENDPOINTS_V2.GENERATE_QUESTIONS,
    method: "post",
  });

  const {
    mutateAsync: startQuestionAttempt,
    isPending: isStartingAttempt,
    data: questionAttemptResponse,
  } = apiClient.useMutation<StartQuestionAttemptResponse>({
    url: ENDPOINTS.INTERVIEWS.START_QUESTION_ATTEMPT,
    method: "post",
  });

  useEffect(() => {
    if (generatedQuestions?.items?.[currentQuestionIndex] && interviewId) {
      startQuestionAttempt({
        interviewId: Number(interviewId),
        questionId:
          generatedQuestions.items[currentQuestionIndex].interviewQuestionId,
      });
    }
  }, [
    generatedQuestions,
    interviewId,
    startQuestionAttempt,
    currentQuestionIndex,
  ]);

  const handleInterviewStart = () => {
    if (hasPermission) {
      setHasStarted(true);
      generateQuestions({
        useResume,
      });
    } else {
      showPermissionModal();
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setHasStarted(true);
    }
    return granted;
  };

  const handleNextQuestion = () => {
    if (
      generatedQuestions?.items &&
      currentQuestionIndex < generatedQuestions.items.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const { mutateAsync: completeInterview } = apiClient.useMutation({
    url: ENDPOINTS.INTERVIEWS.COMPLETE,
    method: "post",
    options: {
      onSuccess: () => {
        window.location.href = "/interview-completed";
      },
    },
  });

  const handleInterviewSubmit = () => {
    if (interviewId) {
      completeInterview({
        interviewId: Number(interviewId),
      });
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      {!hasStarted ? (
        <>
          <Welcome role={role || ""} onInterviewStart={handleInterviewStart} />
          <MicPermissionModal
            isOpen={showModal}
            onClose={hidePermissionModal}
            onRequestPermission={handleRequestPermission}
          />
        </>
      ) : (
        <div>
          <Header />

          <div className="w-48 h-48 mx-auto mb-6">
            <DotLottieReact src="/assets/lottie/Speaker.lottie" autoplay loop />
          </div>

          <Question
            isLoading={isGeneratingQuestions}
            question={generatedQuestions?.items?.[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={generatedQuestions?.items?.length || 0}
          />
          <CodeView
            isLoading={isGeneratingQuestions}
            code={
              generatedQuestions?.items?.[currentQuestionIndex]?.supplement
                ?.content || undefined
            }
          />
          <Footer
            isLoading={isGeneratingQuestions}
            disabled={isStartingAttempt}
            question_attempt_id={questionAttemptResponse?.questionAttemptId}
            onNext={handleNextQuestion}
            isLastQuestion={
              generatedQuestions?.items &&
              currentQuestionIndex === generatedQuestions.items.length - 1
            }
            onSubmit={handleInterviewSubmit}
          />
        </div>
      )}
    </div>
  );
};

const SuspendedInterviewPage = () => {
  return (
    <>
      <InterviewPage />
    </>
  );
};

export default SuspendedInterviewPage;
