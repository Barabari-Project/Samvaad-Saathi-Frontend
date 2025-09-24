"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { resampleAudioTo16kHz } from "@/lib/audio-utils";
import { deleteAnswer, getAnswerBlob, saveAnswerBlob } from "@/lib/idb";
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
  const { user } = useAuth();
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

  // react-voice-visualizer controls
  const recorderControls = useVoiceVisualizer({
    onStartRecording: () => {},
    onStopRecording: () => {},
  });
  const {
    startRecording,
    stopRecording,
    audioSrc,
    recordedBlob,
    isRecordingInProgress,
    isPausedRecording,
    isAvailableRecordedAudio,
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
    [interviewId]
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
      }
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // When a recording finishes and blob/src is available, store it against the current question
  useEffect(() => {
    if (!isAvailableRecordedAudio || !audioSrc || !recordedBlob) return;
    const q = questions[currentIndex];
    if (!q) return;
    const questionId = `${currentIndex}`; // Use index as ID since API doesn't provide one
    setRecordedAnswers((prev) => ({ ...prev, [questionId]: audioSrc }));
    // persist to IndexedDB
    saveAnswerBlob(questionId, recordedBlob).catch(() => {});
  }, [
    isAvailableRecordedAudio,
    audioSrc,
    recordedBlob,
    currentIndex,
    questions,
  ]);

  // On question change, try to preload any previously saved blob from IndexedDB
  useEffect(() => {
    const q = questions[currentIndex];
    if (!q) return;
    const questionId = `${currentIndex}`;
    let cancelled = false;
    setAnswerSubmitted(false); // Reset submitted state when question changes
    getAnswerBlob(questionId)
      .then((blob) => {
        if (cancelled || !blob) return;
        const url = URL.createObjectURL(blob);
        setRecordedAnswers((prev) => ({ ...prev, [questionId]: url }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentIndex, questions]);

  const handleAnswer = () => {
    // Start recording for this question
    setAnswerSubmitted(false); // Reset the submitted state when starting new recording
    startRecording();
  };

  const handleSubmitAnswer = async () => {
    // Stop recording and show the message
    stopRecording();
    setAnswerSubmitted(true);

    // Transcribe the audio if we have a recorded blob and question attempt ID
    console.log("questionAttemptId :", questionAttemptId);
    if (recordedBlob && questionAttemptId !== null) {
      try {
        // Resample audio to 16kHz
        console.log("Resampling audio to 16kHz...");
        const resampledBlob = await resampleAudioTo16kHz(recordedBlob);
        console.log("Audio resampled successfully");

        const formData = new FormData();
        formData.append("question_attempt_id", questionAttemptId.toString());
        formData.append("language", "en");

        // Generate filename with user ID, attempt ID, and datetime
        const now = new Date();
        const timestamp = now.toISOString();
        const filename = `user_${user?.userId}_attempt_${questionAttemptId}_${timestamp}.wav`;

        formData.append("file", resampledBlob, filename);

        const response = await transcribeMutation(formData);

        // Handle the response based on the actual API structure
        if (response.saved) {
          console.log(
            "Audio transcribed and saved successfully:",
            response.message
          );
        } else {
          console.error("Failed to save transcription:", response.saveError);
        }

        if (response.whisperError) {
          console.error("Whisper transcription error:", response.whisperError);
        }
      } catch (error) {
        console.error("Failed to transcribe audio:", error);
      }
    }
  };

  const handleNext = () => {
    setAnswerSubmitted(false); // Reset submitted state when moving to next question
    if (!isLast) setCurrentIndex((i) => i + 1);
  };

  const handleSkip = () => {
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    setAnswerSubmitted(false); // Reset submitted state when moving to next question
    if (!isLast) setCurrentIndex((i) => i + 1);
  };

  const cancelSkip = () => {
    setShowSkipModal(false);
  };

  const handleSubmit = async () => {
    if (!interviewId) {
      console.error("No interview ID available");
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
        {isGeneratingQuestions || isStartingAttempt ? (
          <div className="mx-auto mt-24 rounded-xl border border-black/10 shadow-sm bg-white/90 backdrop-blur px-4 py-5 text-center">
            <p className="text-sm">
              {isGeneratingQuestions
                ? "Crafting personalized questions for you..."
                : "Preparing question..."}
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
              className="px-4 h-9 rounded-md bg-black text-white text-sm"
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
                    className="px-3 h-9 rounded-md bg-black text-white text-sm disabled:opacity-50"
                    onClick={handleSubmitAnswer}
                    disabled={isTranscribing}
                  >
                    {isTranscribing ? "Transcribing..." : "Submit Answer"}
                  </button>
                </div>
              </div>
            ) : recordedAnswers[`${currentIndex}`] || answerSubmitted ? (
              <div className="mt-4">
                <div className="text-center text-xs border font-bold rounded px-3 py-2">
                  Your answer has been recorded!
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="px-4 h-9 rounded-md bg-black text-white text-sm"
                    onClick={() => {
                      const questionId = `${currentIndex}`;
                      setRecordedAnswers((prev) => {
                        const copy = { ...prev };
                        delete copy[questionId];
                        return copy;
                      });
                      setAnswerSubmitted(false); // Reset submitted state when redoing
                      deleteAnswer(questionId).catch(() => {});
                      // allow re-recording immediately
                      setTimeout(() => startRecording(), 0);
                    }}
                  >
                    Redo
                  </button>
                  {isLast ? (
                    <button
                      type="button"
                      className="px-4 h-9 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-50"
                      onClick={handleSubmit}
                      disabled={isCompletingInterview}
                    >
                      {isCompletingInterview ? "Completing..." : "Submit"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-4 h-9 rounded-md bg-indigo-600 text-white text-sm"
                      onClick={handleNext}
                    >
                      Next ➜
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  className="px-4 h-9 rounded-md bg-black text-white text-sm flex items-center gap-3"
                  onClick={handleAnswer}
                >
                  <MicrophoneIcon color="white" className="size-4" /> Answer
                </button>
                {isLast ? (
                  <button
                    type="button"
                    className="px-4 btn btn-primary disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={isCompletingInterview}
                  >
                    {isCompletingInterview ? "Completing..." : "Submit"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-3 h-9 rounded-md border text-sm text-black/70"
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={cancelSkip}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 btn btn-primary"
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
