"use client";
import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS, ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CodeView, Footer, Header, Question, Welcome } from "./_components";
import { GenerateQuestionsResponse } from "./types";

const InterviewPage = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const useResume = searchParams.get("useResume");
  const role = searchParams.get("role");

  const [hasStarted, setHasStarted] = useState(false);

  // mic permission utils
  const {
    hasPermission,
    showModal,
    requestPermission,
    showPermissionModal,
    hidePermissionModal,
  } = useMicPermission();


   const apiClient = createApiClient(APIServiceV2.INTERVIEWS);
  
    const {mutateAsync: generateQuestions, isPending:isGeneratingQuestions, data: generatedQuestions} = apiClient.useMutation<GenerateQuestionsResponse>({
      url: ENDPOINTS_V2.GENERATE_QUESTIONS,
      method: "post",
    });

    const { mutateAsync: startQuestionAttempt, isPending: isStartingAttempt } = apiClient.useMutation({
      url: ENDPOINTS.INTERVIEWS.START_QUESTION_ATTEMPT,
      method: "post",
    });

    useEffect(() => {
      if (generatedQuestions?.items?.[0] && interviewId) {
        startQuestionAttempt({
          interviewId: Number(interviewId),
          questionId: generatedQuestions.items[0].interviewQuestionId,
        });
      }
    }, [generatedQuestions, interviewId, startQuestionAttempt]);


  const handleInterviewStart = () => {
    if (hasPermission) {
      setHasStarted(true);
      generateQuestions({
        useResume
      })
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
          <Question
            isLoading={isGeneratingQuestions}
            question={generatedQuestions?.items?.[0]}
            currentQuestionIndex={0}
            totalQuestions={generatedQuestions?.items?.length || 0}
          />
          <CodeView
            isLoading={isGeneratingQuestions}
            code={generatedQuestions?.items?.[0]?.supplement || undefined}
          />
          <Footer isLoading={isGeneratingQuestions} disabled={isStartingAttempt} />
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
