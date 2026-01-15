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
  const selectedQuestionsParam = searchParams.get("selectedQuestions");

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<
    GenerateQuestionsResponse["items"]
  >([]);
  const [isTextToSpeechSpeaking, setIsTextToSpeechSpeaking] = useState(false);

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

  // Parse selectedQuestions from URL if present
  useEffect(() => {
    if (selectedQuestionsParam) {
      try {
        const parsedQuestions = JSON.parse(
          decodeURIComponent(selectedQuestionsParam)
        ) as GenerateQuestionsResponse["items"];
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          setQuestions(parsedQuestions);
          // Start interview only after questions are parsed from URL
          if (!hasStarted) {
            setHasStarted(true);
          }
        }
      } catch (error) {
        console.error("Failed to parse selectedQuestions from URL:", error);
        // Fallback to generating questions via API if parsing fails
      }
    }
  }, [selectedQuestionsParam, hasStarted]);

  // Update local questions state when generatedQuestions changes
  useEffect(() => {
    if (generatedQuestions?.items && generatedQuestions.items.length > 0) {
      setQuestions(generatedQuestions.items);
      // Start interview only after questions are generated via API
      if (!hasStarted) {
        setHasStarted(true);
      }
    }
  }, [generatedQuestions?.items, hasStarted]);

  useEffect(() => {
    if (questions?.[currentQuestionIndex] && interviewId) {
      startQuestionAttempt({
        interviewId: Number(interviewId),
        questionId: questions[currentQuestionIndex].interviewQuestionId,
      });
    }
    // Reset text-to-speech speaking state when question changes
    setIsTextToSpeechSpeaking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, interviewId, currentQuestionIndex]);

  const handleInterviewStart = () => {
    if (hasPermission) {
      // Don't set hasStarted here - wait for questions to be ready
      // If selectedQuestions exists in URL, questions should be parsed from URL
      // Only call API if selectedQuestions is not present or parsing failed (no questions)
      if (!selectedQuestionsParam) {
        generateQuestions({
          useResume: useResume === "true",
        });
      } else if (questions.length === 0) {
        // selectedQuestions exists but parsing failed or hasn't completed yet
        // Fallback to generating questions via API
        generateQuestions({
          useResume: useResume === "true",
        });
      } else {
        // Questions already available from URL parsing, start immediately
        setHasStarted(true);
      }
      // If selectedQuestions exists and questions are available, skip API call
    } else {
      showPermissionModal();
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Don't set hasStarted here - wait for questions to be ready
      // If selectedQuestions exists in URL, questions should be parsed from URL
      // Only call API if selectedQuestions is not present or parsing failed (no questions)
      if (!selectedQuestionsParam) {
        generateQuestions({
          useResume: useResume === "true",
        });
      } else if (questions.length === 0) {
        // selectedQuestions exists but parsing failed or hasn't completed yet
        // Fallback to generating questions via API
        generateQuestions({
          useResume: useResume === "true",
        });
      } else {
        // Questions already available from URL parsing, start immediately
        setHasStarted(true);
      }
      // If selectedQuestions exists and questions are available, skip API call
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
    <div className="px-8 pt-4 max-w-6xl">
      {!hasStarted ? (
        <>
          <Welcome
            role={role || ""}
            onInterviewStart={handleInterviewStart}
            isGeneratingQuestions={isGeneratingQuestions}
          />
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
            hasStarted={hasStarted}
            interviewId={interviewId}
            onTimerExpire={handleInterviewSubmit}
          />

          <div className="size-24 mx-auto mb-4">
            <DotLottieReact src="/assets/lottie/Speaker.lottie" autoplay loop />
          </div>

          <Question
            isLoading={isGeneratingQuestions}
            question={questions?.[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions?.length || 0}
            onSpeakingChange={setIsTextToSpeechSpeaking}
          />
          <CodeView
            isLoading={isGeneratingQuestions}
            supplement={questions?.[currentQuestionIndex]?.supplement || null}
          />
          <Footer
            isLoading={isGeneratingQuestions}
            disabled={isStartingAttempt || isTextToSpeechSpeaking}
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
