"use client";

import { useState, useEffect, useRef } from "react";
import {
    MicrophoneIcon,
    ArrowPathIcon,
    SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { useMicPermission, MicPermissionModal } from "@/hooks/useMicPermission";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const PracticePage = () => {
    const router = useRouter();
    const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "stopped">("idle");
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const {
        hasPermission,
        showModal,
        requestPermission,
        showPermissionModal,
        hidePermissionModal,
    } = useMicPermission();

    useEffect(() => {
        if (recordingStatus === "recording") {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [recordingStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStartRecording = () => {
        if (!hasPermission) {
            showPermissionModal();
            return;
        }
        setTimer(0);
        setRecordingStatus("recording");
    };

    const handleStopRecording = () => {
        setRecordingStatus("stopped");
    };

    const handleRetry = () => {
        setTimer(0);
        setRecordingStatus("idle");
    };

    return (
        <div className="flex flex-col items-center min-h-full bg-white p-6 relative">
            <h1 className="text-gray-400 text-lg mb-12">Speech Pacing Practice</h1>

            {/* Timer */}
            <div className={clsx(
                "text-5xl font-mono font-bold mb-16",
                recordingStatus === "recording" ? "text-red-500" : "text-black"
            )}>
                {formatTime(timer)}
            </div>

            {/* Sentence Card */}
            <div className="card bg-white shadow-xl border border-gray-100 p-8 mb-6 text-center w-full max-w-sm">
                <p className="text-lg font-bold text-black leading-relaxed">
                    &ldquo;I approach complex problems by breaking them into smaller, manageable steps and solving them systematically.&rdquo;
                </p>
            </div>

            <p className="text-gray-400 text-sm mb-16">Speak Naturally. Don&apos;t Rush</p>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                {recordingStatus === "idle" && (
                    <button
                        onClick={handleStartRecording}
                        className="btn btn-primary btn-block btn-lg rounded-full bg-blue-600 hover:bg-blue-700 border-none text-white font-bold"
                    >
                        <MicrophoneIcon className="w-5 h-5 mr-2" />
                        Start Recording
                    </button>
                )}

                {recordingStatus === "recording" && (
                    <button
                        onClick={handleStopRecording}
                        className="btn btn-error btn-block btn-lg rounded-full bg-red-500 hover:bg-red-600 border-none text-white font-bold"
                    >
                        Stop
                    </button>
                )}

                {recordingStatus === "stopped" && (
                    <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col items-center gap-2 mb-8">
                            <button
                                onClick={handleRetry}
                                className="btn btn-circle bg-yellow-400 hover:bg-yellow-500 border-none text-black"
                            >
                                <ArrowPathIcon className="w-6 h-6" />
                            </button>
                            <span className="text-xs text-gray-500">Retry</span>
                        </div>

                        <div className="flex items-center gap-4 w-full">
                            {/* Listen Icon (Mock) */}
                            <button className="btn btn-circle bg-gray-100 border-none text-black shadow-sm shrink-0">
                                <SpeakerWaveIcon className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => router.push("/control-your-pace/report")}
                                className="btn btn-primary btn-lg rounded-full bg-blue-600 hover:bg-blue-700 border-none text-white font-bold flex-1"
                            >
                                View Report
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <MicPermissionModal
                isOpen={showModal}
                onClose={hidePermissionModal}
                onRequestPermission={requestPermission}
            />
        </div>
    );
};

export default PracticePage;
