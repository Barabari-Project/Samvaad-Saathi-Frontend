import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import {
  AUDIO_CONSTRAINTS_16KHZ,
  resampleAudioTo16kHz,
} from "@/lib/audio-utils";
import {
  MicrophoneIcon as HeroMicrophoneIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

interface FooterProps {
  isLoading?: boolean;
  disabled?: boolean;
  question_attempt_id?: number;
  onNext?: () => void;
  isLastQuestion?: boolean;
  onSubmit?: () => void;
}

const Footer = ({
  isLoading = false,
  disabled = false,
  question_attempt_id,
  onNext,
  isLastQuestion = false,
  onSubmit,
}: FooterProps) => {
  const [isListening, setIsListening] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const apiClient = createApiClient(APIService.TRANSCRIBE);

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
        onSuccess: () => {
          completeAnalysis({
            question_attempt_id: question_attempt_id,
            analysisTypes: ["domain", "communication", "pace", "pause"],
          });
          setHasAnswered(true);
        },
      },
    });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS_16KHZ,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsListening(false);
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
          {/* Main container with gradient border and background */}
          <div className="relative w-full max-w-2xl h-64 rounded-2xl border-4 border-blue-500/40 overflow-hidden shadow-lg bg-gradient-to-b from-blue-100 via-purple-50 to-yellow-50 animate-gradient backdrop-blur-sm">
            {/* Listening text */}
            <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
              <h1 className="text-xl font-medium text-slate-700 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Listening...
              </h1>
            </div>

            {/* Centered circular microphone button with gradient */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-pulse delay-75"></div>

                <div className="relative size-20 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-pink-300 via-pink-200 to-cyan-300 transform transition-transform hover:scale-105">
                  {/* Microphone icon */}
                  <MicrophoneIcon className="size-10 text-blue-900" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center w-full mt-8">
            <button
              onClick={handleStopListening}
              disabled={isUploading}
              className="btn bg-primary hover:bg-primary/90 text-white btn-block"
            >
              {isUploading ? "Uploading..." : "Done"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
