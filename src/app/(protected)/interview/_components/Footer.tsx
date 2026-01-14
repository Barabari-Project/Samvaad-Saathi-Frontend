import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import {
  AUDIO_CONSTRAINTS_16KHZ,
  cleanupAudioAnalysis,
  createAudioAnalysisContext,
  resampleAudioTo16kHz,
  startWaveformAnimation,
  type AudioAnalysisContext,
} from "@/lib/audio-utils";
import {
  MicrophoneIcon as HeroMicrophoneIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { FollowUpQuestion, TranscribeResponse } from "../types";

interface FooterProps {
  isLoading?: boolean;
  disabled?: boolean;
  question_attempt_id?: number;
  onNext?: () => void;
  isLastQuestion?: boolean;
  onSubmit?: () => void;
  onFollowUpQuestion?: (followUpQuestion: FollowUpQuestion) => void;
}

const Footer = ({
  isLoading = false,
  disabled = false,
  question_attempt_id,
  onNext,
  isLastQuestion = false,
  onSubmit,
  onFollowUpQuestion,
}: FooterProps) => {
  const [isListening, setIsListening] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(20).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnalysisRef = useRef<AudioAnalysisContext | null>(null);
  const stopWaveformAnimationRef = useRef<(() => void) | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const apiClient = createApiClient(APIService.TRANSCRIBE);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopWaveformAnimationRef.current) {
        stopWaveformAnimationRef.current();
      }
      cleanupAudioAnalysis(audioAnalysisRef.current);
    };
  }, []);

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(180);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [question_attempt_id]);

  // Timer countdown effect
  useEffect(() => {
    if (isListening && timeRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isListening, timeRemaining]);

  const { mutateAsync: completeAnalysis } = apiClient.useMutation({
    url: ENDPOINTS.ANALYSIS.COMPLETE,
    method: "post",
  });

  const { mutateAsync: uploadAudio, isPending: isUploading } =
    apiClient.useMutation({
      url: ENDPOINTS.TRANSCRIBE.WHISPER,
      method: "post",
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      options: {
        onSuccess: (response: TranscribeResponse) => {
          completeAnalysis({
            question_attempt_id: question_attempt_id,
            analysisTypes: ["domain", "communication", "pace", "pause"],
          });
          setHasAnswered(true);

          // Handle follow-up question if generated
          if (
            response?.followUpGenerated &&
            response?.followUpQuestion &&
            onFollowUpQuestion
          ) {
            onFollowUpQuestion(response.followUpQuestion);
          }
        },
      },
    });

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (isListening && timeRemaining === 0 && mediaRecorderRef.current) {
      const autoSubmit = async () => {
        if (!mediaRecorderRef.current) return;

        return new Promise<void>((resolve) => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = async () => {
              const blob = new Blob(chunksRef.current, { type: "audio/webm" });

              try {
                // Resample to 16kHz WAV
                const wavBlob = await resampleAudioTo16kHz(blob);
                const file = new File([wavBlob], "recording.wav", {
                  type: "audio/wav",
                });

                if (question_attempt_id) {
                  const formData = new FormData();
                  formData.append(
                    "question_attempt_id",
                    question_attempt_id.toString()
                  );
                  formData.append("language", "en");
                  formData.append("file", file);

                  await uploadAudio(formData);
                }
              } catch (error) {
                console.error("Error processing audio:", error);
              }
              resolve();
            };
            stopRecording();
          }
        });
      };
      autoSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isListening, question_attempt_id, uploadAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS_16KHZ,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setTimeRemaining(180); // Reset timer to 3 minutes

      // Set up audio analysis for waveform
      const audioAnalysis = createAudioAnalysisContext(stream);
      audioAnalysisRef.current = audioAnalysis;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsListening(true);

      // Throttled callback to reduce state updates
      // Update state at most every 50ms (~20fps) instead of every frame (~60fps)
      const throttledUpdate = (bars: number[]) => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current >= 50) {
          lastUpdateTimeRef.current = now;
          setWaveformBars(bars);
        }
      };

      // Start waveform animation with throttled updates
      lastUpdateTimeRef.current = Date.now();
      const stopAnimation = startWaveformAnimation(
        audioAnalysis.analyser,
        throttledUpdate
      );
      stopWaveformAnimationRef.current = stopAnimation;
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);

      // Stop waveform animation
      if (stopWaveformAnimationRef.current) {
        stopWaveformAnimationRef.current();
        stopWaveformAnimationRef.current = null;
      }

      // Clean up audio analysis
      cleanupAudioAnalysis(audioAnalysisRef.current);
      audioAnalysisRef.current = null;
      setWaveformBars(Array(20).fill(0));

      // Clear timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const handleAnswerClick = () => {
    startRecording();
  };

  const handleStopListening = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });

          try {
            // Resample to 16kHz WAV
            const wavBlob = await resampleAudioTo16kHz(blob);
            const file = new File([wavBlob], "recording.wav", {
              type: "audio/wav",
            });

            if (question_attempt_id) {
              const formData = new FormData();
              formData.append(
                "question_attempt_id",
                question_attempt_id.toString()
              );
              formData.append("language", "en");
              formData.append("file", file);

              await uploadAudio(formData);
            }
          } catch (error) {
            console.error("Error processing audio:", error);
          }
          resolve();
        };
        stopRecording();
      }
    });
  };

  const handleRedo = () => {
    stopRecording();
    chunksRef.current = [];
    setHasAnswered(false);
    setTimeRemaining(180); // Reset timer
    startRecording();
  };

  const handleNextClick = () => {
    if (hasAnswered) {
      if (onNext) {
        onNext();
        setHasAnswered(false);
      }
    } else {
      setShowSkipModal(true);
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleConfirmSkip = () => {
    setShowSkipModal(false);
    if (isLastQuestion) {
      setShowSubmitModal(true);
    } else {
      if (onNext) {
        onNext();
        setHasAnswered(false);
      }
    }
  };

  return (
    <div className="w-full py-4 transition-all duration-300 ease-in-out flex flex-col items-center justify-center">
      {/* Skip Confirmation Modal */}
      <dialog
        className={`modal ${
          showSkipModal ? "modal-open" : ""
        } backdrop-blur-sm`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-slate-800">Skip Question?</h3>
          <p className="py-4 text-slate-600">
            Are you sure you want to skip this question?
          </p>
          <div className="modal-action">
            <button
              onClick={() => setShowSkipModal(false)}
              className="btn btn-ghost text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSkip}
              className="btn bg-primary text-white hover:bg-primary/90 border-none"
            >
              Yes, Skip
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowSkipModal(false)}>close</button>
        </form>
      </dialog>

      {/* Submit Confirmation Modal */}
      <dialog
        className={`modal ${
          showSubmitModal ? "modal-open" : ""
        } backdrop-blur-sm`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-slate-800">
            Submit Interview?
          </h3>
          <p className="py-4 text-slate-600">
            Are you sure you want to submit the interview?
          </p>
          <div className="modal-action">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="btn btn-ghost text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="btn bg-primary text-white hover:bg-primary/90 border-none"
            >
              Yes, Submit
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowSubmitModal(false)}>close</button>
        </form>
      </dialog>

      {isLoading ? (
        <div className="flex justify-between items-center w-full animate-pulse">
          <div className="h-12 w-32 bg-slate-200 rounded-md"></div>
          <div className="h-12 w-24 bg-slate-200 rounded-md"></div>
        </div>
      ) : !isListening ? (
        <div className="flex justify-between items-center animate-fade-in w-full">
          {!hasAnswered ? (
            <button
              onClick={handleAnswerClick}
              disabled={disabled || isUploading}
              className="btn bg-primary hover:bg-primary/90 text-white "
            >
              Answer <HeroMicrophoneIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleRedo}
              disabled={disabled || isUploading}
              className="btn bg-primary hover:bg-primary/90 text-white"
            >
              Redo <HeroMicrophoneIcon className="h-5 w-5" />
            </button>
          )}

          {isLastQuestion ? (
            <button
              onClick={handleSubmitClick}
              disabled={disabled || isUploading}
              className="btn btn-primary text-white"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextClick}
              disabled={disabled || isUploading}
              className="btn btn-outline"
            >
              Next
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main container with animated background */}
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-indigo-300 p-8 sm:p-12 md:p-16 shadow-2xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-blue-200 via-purple-100 to-yellow-100 bg-[length:200%_200%]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
              {/* Listening text */}
              <h2 className="text-xl sm:text-2xl font-medium text-gray-800 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Listening...
              </h2>

              {/* Timer */}
              <div className="text-3xl sm:text-4xl font-semibold text-indigo-700 tabular-nums">
                {formatTime(timeRemaining)}
              </div>

              {/* Microphone circle with glow */}
              <div className="relative">
                {/* Outer glow - pulsing */}
                <div className="absolute inset-0 -m-8 sm:-m-12 animate-pulse rounded-full bg-purple-500/30 blur-3xl" />

                {/* Middle glow - rotating */}
                <div className="absolute inset-0 -m-6 sm:-m-8 animate-spin-slow rounded-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-transparent blur-2xl" />

                <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 items-center justify-center rounded-full border-4 border-indigo-400/50 bg-gradient-to-br from-pink-400 via-purple-300 to-cyan-300 shadow-xl">
                  <MicrophoneIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-indigo-700" />
                </div>
              </div>

              {/* Waveform bars */}
              <div className="flex h-16 sm:h-20 items-center justify-center gap-1 sm:gap-1.5">
                {waveformBars.map((height, index) => (
                  <div
                    key={index}
                    className="w-1 sm:w-1.5 rounded-full bg-indigo-600 transition-all duration-150 ease-out"
                    style={{
                      height: isListening ? `${Math.max(height, 8)}%` : "8%",
                      opacity: isListening ? 0.6 + height / 200 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center w-full">
            <button
              onClick={handleStopListening}
              disabled={disabled || isUploading}
              className="btn btn-primary text-white mt-4"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
