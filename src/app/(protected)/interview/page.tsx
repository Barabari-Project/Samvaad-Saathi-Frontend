"use client";

import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { resampleAudioTo16kHz } from "@/lib/audio-utils";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

type Question = {
  interviewQuestionId: string;
  text: string;
  topic: string;
  difficulty: string;
  category: string;
};

type GenerateQuestionsResponse = {
  interviewId: number;
  track: string;
  count: number;
  questions: string[];
  items: Question[];
  cached: boolean;
  llmModel: string;
  llmLatencyMs: number;
  llmError: string | null;
};

type TranscribeResponse = {
  whisperError: string;
  message: string;
  saved: boolean;
  saveError: string;
};

const InterviewPage = () => {
  const router = useRouter();
  const [showGreeting, setShowGreeting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<
    Record<string, string>
  >({});
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [questionAttemptId, setQuestionAttemptId] = useState<number | null>(
    null
  );
  const [pendingTranscription, setPendingTranscription] = useState(false);
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Use the microphone permission hook
  const {
    hasPermission: hasMicPermission,
    isChecking: isCheckingMic,
    error: micError,
    showModal: showMicModal,
    requestPermission: requestMicPermission,
    showPermissionModal: showMicPermissionModal,
    hidePermissionModal: hideMicPermissionModal,
  } = useMicPermission();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const useResume = searchParams.get("useResume") === "true";

  const apiClient = createApiClient(APIService.INTERVIEWS);
  const transcribeClient = createApiClient(APIService.TRANSCRIBE);
  const analysisClient = createApiClient(APIService.ANALYSIS);

  // react-voice-visualizer controls
  const recorderControls = useVoiceVisualizer();

  const {
    startRecording,
    stopRecording,
    recordedBlob,
    isRecordingInProgress,
    isPausedRecording,
  } = recorderControls;

  console.log("recordedBlob :", recordedBlob);

  // Generate questions mutation
  const {
    loading: isGeneratingQuestions,
    data: questionsData,
    mutateAsync: generateQuestionsMutation,
  } = apiClient.useMutation<
    GenerateQuestionsResponse,
    { useResume: boolean; interviewId: number }
  >({
    url: ENDPOINTS.INTERVIEWS.GENERATE_QUESTIONS,
    method: "post",
    successMessage: "Questions generated successfully!",
    errorMessage: "Failed to generate questions. Please try again.",
  });

  // Transcribe mutation
  const { loading: isTranscribing, mutateAsync: transcribeMutation } =
    transcribeClient.useMutation<TranscribeResponse, FormData>({
      url: ENDPOINTS.TRANSCRIBE.WHISPER,
      method: "post",
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      errorMessage: "Failed to transcribe audio. Please try again.",
    });

  // Complete interview mutation
  const {
    loading: isCompletingInterview,
    mutateAsync: completeInterviewMutation,
  } = apiClient.useMutation<unknown, { interviewId: number }>({
    url: ENDPOINTS.INTERVIEWS.COMPLETE,
    method: "post",
    successMessage: "Interview completed successfully!",
    errorMessage: "Failed to complete interview. Please try again.",
    options: {
      onSuccess: () => {
        router.push(`/interview-completed?interviewId=${interviewId}`);
      },
    },
  });

  const {
    loading: isStartingAttempt,
    mutateAsync: startQuestionAttemptMutation,
  } = apiClient.useMutation<
    { questionAttemptId: number },
    { interviewId: number; questionId: number }
  >({
    url: ENDPOINTS.INTERVIEWS.START_QUESTION_ATTEMPT,
    method: "post",
    errorMessage: "Failed to start question attempt. Please try again.",
  });

  // Analysis mutation
  const { mutateAsync: analysisMutation, isPending: isAnalyzing } =
    analysisClient.useMutation<
      unknown,
      { analysisTypes: string[]; questionAttemptId: number }
    >({
      url: ENDPOINTS.ANALYSIS.COMPLETE,
      method: "post",
      errorMessage: "Failed to analyze answer. Please try again.",
    });

  // Extract questions from the response data
  const questions = useMemo(() => questionsData?.items || [], [questionsData]);

  const isLast = currentIndex === questions.length - 1;

  const generateQuestions = useCallback(async () => {
    if (!interviewId) {
      return;
    }

    try {
      await generateQuestionsMutation({
        useResume: useResume,
        interviewId: parseInt(interviewId),
      });
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
  }, [interviewId, useResume, generateQuestionsMutation]);

  const startQuestionAttempt = useCallback(
    async (questionId: string) => {
      if (!interviewId) {
        return;
      }

      try {
        const response = await startQuestionAttemptMutation({
          interviewId: parseInt(interviewId),
          questionId: parseInt(questionId),
        });
        setQuestionAttemptId(response.questionAttemptId);
      } catch (error) {
        console.error("Failed to start question attempt:", error);
      }
    },
    [interviewId, startQuestionAttemptMutation]
  );

  const handleTranscription = useCallback(
    async (blob: Blob) => {
      if (!questionAttemptId) {
        console.error("No question attempt ID available for transcription");
        return;
      }

      try {
        const resampledBlob = await resampleAudioTo16kHz(blob);

        const formData = new FormData();
        formData.append("question_attempt_id", questionAttemptId.toString());
        formData.append("language", "en");

        formData.append("file", resampledBlob);

        await transcribeMutation(formData);

        await analysisMutation({
          analysisTypes: ["domain", "communication", "pace", "pause"],
          questionAttemptId: questionAttemptId,
        });

        // Move to next question after successful transcription
        setAudioUploaded(false); // Reset audio uploaded state
        resetStatesAndMoveNext();
      } catch (error) {
        console.error("Failed to transcribe audio:", error);
      } finally {
        setPendingTranscription(false);
      }
    },
    [questionAttemptId]
  );

  // Generate questions when component mounts
  useEffect(() => {
    generateQuestions();
  }, []);

  // Start question attempt when current question changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const currentQuestion = questions[currentIndex];
      if (currentQuestion?.interviewQuestionId) {
        startQuestionAttempt(currentQuestion.interviewQuestionId);
      }
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAnswer = () => {
    // Start recording for this question
    setAnswerSubmitted(false); // Reset the submitted state when starting new recording
    setAudioUploaded(false); // Reset audio uploaded state
    setRecordingError(null); // Reset recording error
    startRecording();
  };

  const handleSubmitAnswer = useCallback(async () => {
    // Stop recording and show the message

    setAnswerSubmitted(true);
    setRecordingError(null);

    // If we already have the blob, process it immediately
    if (recordedBlob && questionAttemptId !== null) {
      console.log("Blob available immediately, processing transcription");
      setPendingTranscription(true);
      handleTranscription(recordedBlob);
    } else {
      // Set flag to process transcription when blob becomes available
      console.log("Blob not available yet, setting pending transcription flag");
      setPendingTranscription(true);
    }
  }, [recordedBlob, questionAttemptId, handleTranscription]);

  useEffect(() => {
    if (recordedBlob && questionAttemptId !== null) {
      handleSubmitAnswer();
    }
  }, [recordedBlob, questionAttemptId]);

  const resetStatesAndMoveNext = () => {
    setAnswerSubmitted(false); // Reset submitted state when moving to next question
    setPendingTranscription(false); // Reset pending transcription state
    setRecordingError(null); // Reset recording error
    // Reset audio blob by clearing recording
    if (recorderControls.recordedBlob) {
      recorderControls.clearCanvas();
    }
    if (!isLast) setCurrentIndex((i) => i + 1);
  };

  const handleNext = () => {
    if (!audioUploaded) {
      setRecordingError(
        "Please record and upload your answer before proceeding."
      );
      return;
    }
    resetStatesAndMoveNext();
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    setAudioUploaded(true); // Allow skipping without audio
    resetStatesAndMoveNext();
  };

  const cancelSkip = () => {
    setShowSkipModal(false);
  };

  const handleSubmit = async () => {
    if (!interviewId) {
      console.error("No interview ID available");
      return;
    }

    if (!audioUploaded) {
      setRecordingError(
        "Please record and upload your answer before completing the interview."
      );
      return;
    }

    try {
      await completeInterviewMutation({
        interviewId: parseInt(interviewId),
      });
    } catch (error) {
      console.error("Failed to complete interview:", error);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-56px)] py-8 px-4 flex items-start">
      <div className="mx-auto w-full max-w-md">
        {isGeneratingQuestions ? (
          <div className="mx-auto mt-24 rounded-xl border border-black/10 shadow-sm bg-white/90 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm">
              Crafting personalized questions for you...
            </p>
          </div>
        ) : !interviewId ? (
          <div className="mx-auto mt-24 rounded-xl border border-red-300 shadow-sm bg-white/90 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm text-red-600">
              Invalid interview session. Please start over.
            </p>
          </div>
        ) : questions.length === 0 ? (
          <div className="mx-auto mt-24 rounded-xl border border-red-300 shadow-sm bg-white/90 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm text-red-600">
              No questions available. Please try again.
            </p>
          </div>
        ) : isCheckingMic ? (
          <div className="mx-auto mt-24 rounded-xl border border-black/10 shadow-sm bg-white/90 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm">Checking microphone access...</p>
          </div>
        ) : !hasMicPermission ? (
          <div className="mx-auto mt-24 rounded-xl border border-black/10 shadow-sm bg-white/90 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm mb-3">
              Ready to start your interview! We&apos;ll need microphone access
              to record your answers.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={showMicPermissionModal}
            >
              Enable Microphone
            </button>
          </div>
        ) : showGreeting ? (
          <div className="mx-auto mt-24 rounded-xl border border-yellow-300 shadow-sm bg-white/80 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm">Hi! Lets start your interview 👋</p>
          </div>
        ) : (
          <div className="mx-auto mt-16 rounded-xl border border-black/10 shadow-[0_6px_24px_rgba(0,0,0,0.08)] bg-white/90 backdrop-blur p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-2 py-0.5 rounded border border-blue-300 text-blue-700 bg-blue-50">
                {questions[currentIndex]?.category?.toUpperCase() || "Question"}
              </span>
              <span className="text-[10px] text-black/60">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>

            <p className="text-sm leading-5 text-black">
              {questions[currentIndex].text}
            </p>

            {/* Error Message */}
            {recordingError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{recordingError}</p>
              </div>
            )}

            {/* Recording / Playback UI */}
            {isRecordingInProgress || isPausedRecording ? (
              <div className="mt-4 space-y-3">
                <VoiceVisualizer
                  controls={recorderControls}
                  height={50}
                  //   backgroundColor="#0b1021"
                  mainBarColor="#1F285B"
                  secondaryBarColor="#1F285B"
                  isControlPanelShown={false}
                  isProgressIndicatorShown={false}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm disabled:opacity-50"
                    onClick={() => {
                      stopRecording();
                      console.log("first");
                      handleSubmitAnswer();
                    }}
                    disabled={
                      isTranscribing || pendingTranscription || isAnalyzing
                    }
                  >
                    {isTranscribing ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Transcribing...
                      </>
                    ) : pendingTranscription ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing...
                      </>
                    ) : isAnalyzing ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Analyzing...
                      </>
                    ) : (
                      "Submit Answer"
                    )}
                  </button>
                </div>
              </div>
            ) : recordedAnswers[`${currentIndex}`] || answerSubmitted ? (
              <div className="mt-4">
                <div className="text-center text-xs border font-bold rounded px-3 py-2">
                  {audioUploaded
                    ? "Your answer has been uploaded!"
                    : "Your answer has been recorded!"}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      const questionId = `${currentIndex}`;
                      setRecordedAnswers((prev) => {
                        const copy = { ...prev };
                        delete copy[questionId];
                        return copy;
                      });
                      setAnswerSubmitted(false); // Reset submitted state when redoing
                      // allow re-recording immediately
                      setTimeout(() => startRecording(), 0);
                    }}
                  >
                    Redo
                  </button>
                  {isLast ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm disabled:opacity-50"
                      onClick={handleSubmit}
                      disabled={isCompletingInterview || !audioUploaded}
                    >
                      {isCompletingInterview ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Completing...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm disabled:opacity-50"
                      onClick={handleNext}
                      disabled={
                        !audioUploaded ||
                        isTranscribing ||
                        pendingTranscription ||
                        isAnalyzing
                      }
                    >
                      {isTranscribing || pendingTranscription || isAnalyzing ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          {isAnalyzing ? "Analyzing..." : "Uploading..."}
                        </>
                      ) : (
                        "Next ➜"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  className="btn btn-primary btn-sm flex items-center gap-3"
                  onClick={handleAnswer}
                  disabled={isStartingAttempt}
                >
                  {isStartingAttempt ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <MicrophoneIcon color="white" className="size-4" /> Answer
                    </>
                  )}
                </button>
                {isLast ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={isCompletingInterview || !audioUploaded}
                  >
                    {isCompletingInterview ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Completing...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleSkip}
                    title={"Skip"}
                  >
                    ➜
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Skip Question?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to skip this question?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={cancelSkip}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={confirmSkip}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Microphone Permission Modal */}
      <MicPermissionModal
        isOpen={showMicModal}
        onClose={hideMicPermissionModal}
        onRequestPermission={requestMicPermission}
        error={micError}
      />
    </div>
  );
};

export default InterviewPage;
