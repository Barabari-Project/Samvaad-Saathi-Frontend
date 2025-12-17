"use client";
import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS, ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeView, Footer, Header, Question, Welcome } from "./_components";
import {
  GenerateQuestionsResponse,
  StartQuestionAttemptResponse,
} from "./types";

const InterviewPage = () => {
  const router = useRouter();

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
    hidePermissionModal,
    showPermissionModal,
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
        useResume: useResume === "true",
      });
    } else {
      showPermissionModal();
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setHasStarted(true);
      generateQuestions({
        useResume: useResume === "true",
      });
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
        // Clear timer on completion
        if (interviewId) {
          sessionStorage.removeItem(`interviewEndTime_${interviewId}`);
        }
        router.push(
          `/interview-completed?interviewId=${interviewId}&role=${
            role || "Interview"
          }`
        );
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
          <Header
            role={role || ""}
            hasStarted={!!generatedQuestions}
            interviewId={interviewId}
          />

          <div className="size-24 mx-auto mb-6">
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
            supplement={
              generatedQuestions?.items?.[currentQuestionIndex]?.supplement ||
              null
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
