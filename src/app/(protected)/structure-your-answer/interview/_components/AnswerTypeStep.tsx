"use client";

import { createApiClient } from "@/lib/api-config/src/client";
import { APIServiceV2 } from "@/lib/api-config/src/config";
import { ENDPOINTS_V2 } from "@/lib/api-config/src/endpoints";
import {
  AUDIO_CONSTRAINTS_16KHZ,
  cleanupAudioAnalysis,
  createAudioAnalysisContext,
  resampleAudioTo16kHz,
  startWaveformAnimation,
  type AudioAnalysisContext,
} from "@/lib/audio-utils";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { AnswerType, getAnswerTypeLabel } from "../types";

interface AnswerTypeStepProps {
  questionText: string;
  category: string;
  currentAnswerType: AnswerType;
  currentStep: number;
  totalSteps: number;
  practiceId: string;
  questionIndex: number;
  answerTypeIndex: number;
  onComplete: () => void;
}

const AnswerTypeStep = ({
  questionText,
  category,
  currentAnswerType,
  practiceId,
  questionIndex,
  answerTypeIndex,
  onComplete,
}: AnswerTypeStepProps) => {
  const answerTypeLabel = getAnswerTypeLabel(currentAnswerType);
  const [isListening, setIsListening] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(20).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnalysisRef = useRef<AudioAnalysisContext | null>(null);
  const stopWaveformAnimationRef = useRef<(() => void) | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const apiClient = createApiClient(APIServiceV2.INTERVIEWS);

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Reset timer when answer type changes
  useEffect(() => {
    setTimeRemaining(180);
    setHasAnswered(false);
    setIsListening(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [currentAnswerType]);

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

  const { mutateAsync: submitAudio, isPending: isUploading } =
    apiClient.useMutation({
      url: ENDPOINTS_V2.SUBMIT_STRUCTURED_PRACTICE_AUDIO(
        practiceId,
        questionIndex
      ),
      method: "post",
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        _signalGetter: () => abortControllerRef.current?.signal,
      } as AxiosRequestConfig & {
        _signalGetter?: () => AbortSignal | undefined;
      },
      options: {
        onSuccess: () => {
          abortControllerRef.current = null;
          setHasAnswered(true);
          // Move to next answer type after successful submission
          onComplete();
        },
      },
    });

  // Wrapper function to create new AbortController before each upload
  const uploadAudio = async (formData: FormData) => {
    abortControllerRef.current = new AbortController();
    try {
      return await submitAudio(formData);
    } catch (error) {
      const axiosError = error as { name?: string; code?: string };
      if (
        axiosError?.name === "CanceledError" ||
        axiosError?.code === "ERR_CANCELED"
      ) {
        abortControllerRef.current = null;
      }
      throw error;
    }
  };

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
                const wavBlob = await resampleAudioTo16kHz(blob);
                const file = new File([wavBlob], "recording.wav", {
                  type: "audio/wav",
                });

                const formData = new FormData();
                formData.append("file", file);
                formData.append("answerTypeIndex", answerTypeIndex.toString());
                formData.append("answerType", currentAnswerType);

                await uploadAudio(formData);
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
  }, [timeRemaining, isListening, uploadAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS_16KHZ,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setTimeRemaining(180);

      const audioAnalysis = createAudioAnalysisContext(stream);
      audioAnalysisRef.current = audioAnalysis;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsListening(true);

      const throttledUpdate = (bars: number[]) => {
        const now = Date.now();
        if (now - lastUpdateTimeRef.current >= 50) {
          lastUpdateTimeRef.current = now;
          setWaveformBars(bars);
        }
      };

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

      if (stopWaveformAnimationRef.current) {
        stopWaveformAnimationRef.current();
        stopWaveformAnimationRef.current = null;
      }

      cleanupAudioAnalysis(audioAnalysisRef.current);
      audioAnalysisRef.current = null;
      setWaveformBars(Array(20).fill(0));

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const handleRecordClick = () => {
    startRecording();
  };

  const handleStopListening = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });

          try {
            const wavBlob = await resampleAudioTo16kHz(blob);
            const file = new File([wavBlob], "recording.wav", {
              type: "audio/wav",
            });

            const formData = new FormData();
            formData.append("file", file);
            formData.append("answerTypeIndex", answerTypeIndex.toString());
            formData.append("answerType", currentAnswerType);

            await uploadAudio(formData);
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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopRecording();
    chunksRef.current = [];
    setHasAnswered(false);
    setTimeRemaining(180);
    startRecording();
  };

  return (
    <div className="flex flex-col px-6 py-8">
      {/* Answer Type Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {answerTypeLabel}
        </h2>
        <p className="text-sm text-gray-600">
          Provide your answer for the {answerTypeLabel.toLowerCase()} aspect
        </p>
      </div>

      {/* Question Text */}
      <div className="mb-8 bg-gray-50 rounded-lg p-4">
        <p className="text-lg leading-relaxed text-gray-900">{questionText}</p>
      </div>

      {/* Category Tag */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-yellow-100 text-gray-800 text-sm rounded">
          {category?.toUpperCase()}
        </span>
      </div>

      {/* Recording UI */}
      {isListening ? (
        <>
          {/* Main container with animated background */}
          <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-indigo-300 p-8 sm:p-12 md:p-16 shadow-2xl mb-6">
            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-blue-200 via-purple-100 to-yellow-100 bg-[length:200%_200%]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
              {/* Listening text */}
              <h2 className="text-lg sm:text-xl font-medium text-gray-800 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Listening...
              </h2>

              {/* Timer */}
              <div className="text-xl sm:text-4xl font-semibold text-indigo-700 tabular-nums">
                {formatTime(timeRemaining)}
              </div>

              {/* Microphone circle with glow */}
              <div className="relative">
                {/* Outer glow - pulsing */}
                <div className="absolute inset-0 -m-8 sm:-m-12 animate-pulse rounded-full bg-purple-500/30 blur-3xl" />

                {/* Middle glow - rotating */}
                <div className="absolute inset-0 -m-6 sm:-m-8 animate-spin-slow rounded-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-transparent blur-2xl" />

                <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-indigo-400/50 bg-gradient-to-br from-pink-400 via-purple-300 to-cyan-300 shadow-xl">
                  <MicrophoneIcon className="size-10 text-indigo-700" />
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

          <div className="flex justify-end items-center w-full mt-auto pt-6">
            <button
              onClick={handleStopListening}
              disabled={isUploading}
              className="btn btn-primary text-white"
            >
              {isUploading ? "Submitting..." : "Done"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-end mt-auto pt-6">
          {!hasAnswered ? (
            <button
              onClick={handleRecordClick}
              disabled={isUploading}
              className="btn btn-neutral"
            >
              Record {answerTypeLabel}
              <MicrophoneIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleRedo}
              disabled={isUploading}
              className="btn btn-neutral"
            >
              Redo {answerTypeLabel}
              <MicrophoneIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerTypeStep;
