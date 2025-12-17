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
  FollowUpQuestion,
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
  const [questions, setQuestions] = useState<
    GenerateQuestionsResponse["items"]
  >([]);

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

  // Update local questions state when generatedQuestions changes
  useEffect(() => {
    if (generatedQuestions?.items) {
      setQuestions(generatedQuestions.items);
    }
  }, [generatedQuestions?.items?.length]);

  useEffect(() => {
    if (questions?.[currentQuestionIndex] && interviewId) {
      startQuestionAttempt({
        interviewId: Number(interviewId),
        questionId: questions[currentQuestionIndex].interviewQuestionId,
      });
    }
  }, [questions, interviewId, currentQuestionIndex]);

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
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleFollowUpQuestion = (followUpQuestion: FollowUpQuestion) => {
    // Transform the follow-up question to match the items structure
    const transformedQuestion: GenerateQuestionsResponse["items"][0] = {
      interviewQuestionId: followUpQuestion.interviewQuestionId,
      text: followUpQuestion.text,
      topic: "", // Not provided in follow-up question
      difficulty: null, // Not provided in follow-up question
      category: "", // Not provided in follow-up question
      isFollowUp: true,
      parentQuestionId: followUpQuestion.parentQuestionId,
      followUpStrategy: followUpQuestion.strategy,
      supplement: null, // Not provided in follow-up question
    };

    // Insert the follow-up question right after the current question
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions.splice(currentQuestionIndex + 1, 0, transformedQuestion);
      return newQuestions;
    });
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
            question={questions?.[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions?.length || 0}
          />
          <CodeView
            isLoading={isGeneratingQuestions}
            supplement={questions?.[currentQuestionIndex]?.supplement || null}
          />
          <Footer
            isLoading={isGeneratingQuestions}
            disabled={isStartingAttempt}
            question_attempt_id={questionAttemptResponse?.questionAttemptId}
            onNext={handleNextQuestion}
            isLastQuestion={
              questions && currentQuestionIndex === questions.length - 1
            }
            onSubmit={handleInterviewSubmit}
            onFollowUpQuestion={handleFollowUpQuestion}
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
