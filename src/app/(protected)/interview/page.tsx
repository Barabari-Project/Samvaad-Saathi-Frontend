"use client";

import InterviewTopNav from "@/components/InterviewTopNav";
import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { resampleAudioTo16kHz } from "@/lib/audio-utils";
import {
  trackAnswerStartClick,
  trackInterviewQuestionView,
  trackRedoButtonClick,
  trackSkipQuestionClick,
  trackSubmitInterviewClick,
} from "@/lib/posthog/tracking.utils";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

type Question = {
  interviewQuestionId: string | number;
  text: string;
  topic: string;
  difficulty?: string;
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

const TIMER_DURATION = 120; // 2 min

const InterviewPage = () => {
  const router = useRouter();
  const [showGreeting, setShowGreeting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<
    Record<string, string>
  >({});
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [questionAttemptId, setQuestionAttemptId] = useState<number | null>(
    null
  );
  const [pendingTranscription, setPendingTranscription] = useState(false);
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [transcribeAbortController, setTranscribeAbortController] =
    useState<AbortController | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION); // TIMER_DURATION seconds
  const [isActive, setIsActive] = useState(false);

  // Tracking state
  const [questionAttempts, setQuestionAttempts] = useState<
    Record<string, number>
  >({});

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  const role = searchParams.get("role");
  const isReattempt = searchParams.get("reattempt") === "true";
  const isResumed = searchParams.get("resumed") === "true";
  const selectedQuestionsParam = searchParams.get("selectedQuestions");

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
        signal: transcribeAbortController?.signal,
      },
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
        router.push(
          `/interview-completed?interviewId=${interviewId}&role=${
            role || "Interview"
          }`
        );
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
  const { mutateAsync: analysisMutation } = analysisClient.useMutation<
    unknown,
    { analysisTypes: string[]; questionAttemptId: number }
  >({
    url: ENDPOINTS.ANALYSIS.COMPLETE,
    method: "post",
    errorMessage: "Failed to analyze answer. Please try again.",
  });

  // Extract questions from the response data
  const questions = useMemo(() => {
    if ((isReattempt || isResumed) && selectedQuestionsParam) {
      // Parse the selected questions from URL parameter
      try {
        return JSON.parse(selectedQuestionsParam);
      } catch (error) {
        console.error("Failed to parse selected questions:", error);
        return [];
      }
    }
    return questionsData?.items || [];
  }, [questionsData, isReattempt, isResumed, selectedQuestionsParam]);

  const isLast = currentIndex === questions.length - 1;

  const generateQuestions = useCallback(async () => {
    if (!interviewId || isReattempt || isResumed) {
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
  }, [interviewId, useResume, isReattempt, isResumed]); // eslint-disable-line

  const startQuestionAttempt = useCallback(
    async (questionId: string | number) => {
      if (!interviewId) {
        return;
      }

      try {
        const response = await startQuestionAttemptMutation({
          interviewId: parseInt(interviewId),
          questionId:
            typeof questionId === "string" ? parseInt(questionId) : questionId,
        });
        setQuestionAttemptId(response.questionAttemptId);
      } catch (error) {
        console.error("Failed to start question attempt:", error);
      }
    },
    [interviewId] // eslint-disable-line
  );

  // Generate questions when component mounts
  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  // Start question attempt when current question changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const currentQuestion = questions[currentIndex];
      if (currentQuestion?.interviewQuestionId) {
        startQuestionAttempt(currentQuestion.interviewQuestionId);

        trackInterviewQuestionView(
          currentQuestion?.interviewQuestionId,
          currentIndex + 1,
          currentQuestion.category,
          interviewId || ""
        );
      }
    }
  }, [currentIndex, questions]); // eslint-disable-line

  // Show greeting for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup: Cancel any ongoing transcribe request when component unmounts
  useEffect(() => {
    return () => {
      if (transcribeAbortController) {
        transcribeAbortController.abort();
      }
    };
  }, [transcribeAbortController]);

  useEffect(() => {
    // Start the timer when isActive becomes true
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            // Timer reaches zero, clear the interval
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      // Pause the timer and clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup function: clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Function to toggle between start and pause
  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  // Function to reset the timer to 2 minutes
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(TIMER_DURATION);
  };

  const resetStatesAndMoveNext = useCallback(() => {
    setAnswerSubmitted(false); // Reset submitted state when moving to next question
    setPendingTranscription(false); // Reset pending transcription state
    setAudioUploaded(false); // Reset audio uploaded state when moving to next question
    handleReset(); // Reset timer for next question
    // Reset audio blob by clearing recording
    if (recorderControls.recordedBlob) {
      recorderControls.clearCanvas();
    }
    if (!isLast) setCurrentIndex((i) => i + 1);
  }, [isLast, recorderControls]);

  const handleAnswer = () => {
    // Track answer start click
    trackAnswerStartClick();

    // Start recording for this question
    setAnswerSubmitted(false); // Reset the submitted state when starting new recording
    setAudioUploaded(false); // Reset audio uploaded state
    startRecording();
    handleStartPause(); // Start the timer
  };

  const handleSubmitAnswer = useCallback(async () => {
    // Stop recording and show the message
    handleStartPause(); // Stop the timer
    setAnswerSubmitted(true);

    // If we already have the blob, process it immediately
    if (recordedBlob && questionAttemptId !== null) {
      setPendingTranscription(true);

      // Create new AbortController for this transcribe request
      const abortController = new AbortController();
      setTranscribeAbortController(abortController);

      const resampledBlob = await resampleAudioTo16kHz(recordedBlob);

      const formData = new FormData();
      formData.append("question_attempt_id", questionAttemptId.toString());
      formData.append("language", "en");

      formData.append("file", resampledBlob);

      try {
        await transcribeMutation(formData);

        // Mark audio as uploaded but don't move to next question automatically
        setAudioUploaded(true);

        analysisMutation({
          analysisTypes: ["domain", "communication", "pace", "pause"],
          questionAttemptId: questionAttemptId,
        });
      } catch (error) {
        // Handle cancellation or other errors
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Transcribe request was cancelled");
        } else {
          console.error("Transcribe error:", error);
        }
      } finally {
        // Clear the abort controller
        setTranscribeAbortController(null);
      }
    } else {
      setPendingTranscription(true);
    }
  }, [recordedBlob, questionAttemptId]); // eslint-disable-line

  useEffect(() => {
    if (recordedBlob && questionAttemptId !== null) {
      handleSubmitAnswer();
    }
  }, [recordedBlob, questionAttemptId, handleSubmitAnswer]);

  const handleNext = () => {
    resetStatesAndMoveNext();
  };

  const handleSkip = () => {
    trackSkipQuestionClick();
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

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    setShowSubmitModal(false);
    handleSubmit();
  };

  const cancelSubmit = () => {
    setShowSubmitModal(false);
  };

  const handleRedo = () => {
    // Track redo button click
    const currentQuestion = questions[currentIndex];
    const questionId = String(
      currentQuestion?.interviewQuestionId || currentIndex
    );
    const attemptNumber = (questionAttempts[questionId] || 0) + 1;
    trackRedoButtonClick(questionId, attemptNumber);

    // Update attempt count
    setQuestionAttempts((prev) => ({
      ...prev,
      [questionId]: attemptNumber,
    }));

    // Cancel ongoing transcribe request if it exists
    if (transcribeAbortController) {
      transcribeAbortController.abort();
      setTranscribeAbortController(null);
    }

    setRecordedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setAnswerSubmitted(false); // Reset submitted state when redoing
    setPendingTranscription(false); // Reset pending transcription state
    setAudioUploaded(false); // Reset audio uploaded state
    handleReset(); // Reset timer for re-recording
    // allow re-recording immediately
    setTimeout(() => {
      startRecording();
      handleStartPause(); // Start timer again for re-recording
    }, 0);
  };

  const handleSubmit = async () => {
    if (!interviewId) {
      console.error("No interview ID available");
      return;
    }

    // Track submit interview click
    trackSubmitInterviewClick();

    try {
      await completeInterviewMutation({
        interviewId: parseInt(interviewId),
      });
    } catch (error) {
      console.error("Failed to complete interview:", error);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-64px)]">
      <InterviewTopNav role={role || "Interview"} />
      <div className="min-h-[calc(100dvh-64px)] py-8 px-4 flex items-start pt-16">
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
                <span
                  className={`badge badge-xs ${
                    questions[currentIndex]?.category?.toLowerCase() === "tech"
                      ? "badge-primary"
                      : questions[currentIndex]?.category?.toLowerCase() ===
                        "behavioral"
                      ? "badge-warning"
                      : questions[currentIndex]?.category?.toLowerCase() ===
                        "tech_allied"
                      ? "badge-success"
                      : "badge-secondary"
                  }`}
                >
                  {questions[currentIndex]?.category
                    ? questions[currentIndex]?.category
                        ?.replaceAll("_", " ")
                        ?.toUpperCase()
                    : "QUESTION"}
                </span>
                <span className="text-[10px] text-black/60">
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>

              <p className="text-sm leading-5 text-black">
                {questions[currentIndex].text}
              </p>

              {/* Recording / Playback UI */}
              {isRecordingInProgress || isPausedRecording ? (
                <div className="mt-4 space-y-3">
                  {/* Timer Display */}
                  <div className="flex items-center justify-center">
                    <div
                      className={`text-lg font-mono font-bold px-3 py-1 rounded-full ${
                        timeLeft <= 30
                          ? "bg-red-100 text-red-700"
                          : timeLeft <= 60
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                  <VoiceVisualizer
                    controls={recorderControls}
                    height={50}
                    //   backgroundColor="#0b1021"
                    mainBarColor="#1F285B"
                    secondaryBarColor="#1F285B"
                    isControlPanelShown={false}
                    isProgressIndicatorShown={true}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm disabled:opacity-50"
                      onClick={() => {
                        stopRecording();
                        handleSubmitAnswer();
                      }}
                      disabled={isTranscribing || pendingTranscription}
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
                      onClick={handleRedo}
                    >
                      Redo
                    </button>
                    {isLast ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm disabled:opacity-50"
                        onClick={handleSubmitClick}
                        disabled={isCompletingInterview}
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
                        // disabled={!audioUploaded || isTranscribing}
                      >
                        {/* {isTranscribing ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Uploading...
                          </>
                        ) : (
                          "Next ➜"
                        )} */}
                        Next ➜
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
                        <MicrophoneIcon color="white" className="size-4" />{" "}
                        Answer
                      </>
                    )}
                  </button>
                  {isLast ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm disabled:opacity-50"
                      onClick={handleSubmitClick}
                      disabled={isCompletingInterview}
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

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Submit Interview?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to submit your interview? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={cancelSubmit}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={confirmSubmit}
                disabled={isCompletingInterview}
              >
                {isCompletingInterview ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
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
