"use client";

import { AUDIO_CONSTRAINTS_16KHZ } from "@/lib/audio-utils";
import {
  ExclamationTriangleIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Custom hook for managing microphone permissions with modal and toast notifications
 *
 * @example
 * ```tsx
 * const {
 *   hasPermission,
 *   isChecking,
 *   error,
 *   showModal,
 *   requestPermission,
 *   showPermissionModal,
 *   hidePermissionModal,
 * } = useMicPermission();
 *
 * return (
 *   <div>
 *     {!hasPermission && (
 *       <button onClick={showPermissionModal}>
 *         Enable Microphone
 *       </button>
 *     )}
 *     <MicPermissionModal
 *       isOpen={showModal}
 *       onClose={hidePermissionModal}
 *       onRequestPermission={requestPermission}
 *       error={error}
 *     />
 *   </div>
 * );
 * ```
 */

type MicPermissionState = {
  hasPermission: boolean;
  isChecking: boolean;
  error: string | null;
  showModal: boolean;
};

type MicPermissionActions = {
  requestPermission: () => Promise<void>;
  showPermissionModal: () => void;
  hidePermissionModal: () => void;
  checkPermission: () => Promise<void>;
};

export const useMicPermission = (): MicPermissionState &
  MicPermissionActions => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const checkPermission = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      if (result.state === "granted") {
        setHasPermission(true);
        setShowModal(false);
      } else if (result.state === "denied") {
        setHasPermission(false);
        setShowModal(false);
        toast.error(
          "Microphone access denied. Please enable it in your browser settings.",
          {
            duration: 5000,
            icon: <ExclamationTriangleIcon className="w-5 h-5" />,
          }
        );
      } else {
        // Prompt state - permission not yet requested
        setHasPermission(false);
      }
    } catch {
      // Fallback for browsers that don't support permissions API
      setHasPermission(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS_16KHZ,
      });
      // Immediately stop tracks; we only needed the permission grant here
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);
      setShowModal(false);

      toast.success("Microphone access granted!", {
        duration: 3000,
        icon: <MicrophoneIcon className="w-5 h-5" />,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Microphone permission denied";
      setError(message);
      setHasPermission(false);

      toast.error(`Failed to access microphone: ${message}`, {
        duration: 5000,
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      });
    }
  }, []);

  const showPermissionModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const hidePermissionModal = useCallback(() => {
    setShowModal(false);
    setError(null);
  }, []);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    hasPermission,
    isChecking,
    error,
    showModal,
    requestPermission,
    showPermissionModal,
    hidePermissionModal,
    checkPermission,
  };
};

// Modal component for microphone permission
export const MicPermissionModal = ({
  isOpen,
  onClose,
  onRequestPermission,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRequestPermission: () => void;
  error: string | null;
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-3 mb-4">
          <MicrophoneIcon className="w-6 h-6 text-primary" />
          <h3 className="font-bold text-lg">Microphone Access Required</h3>
        </div>

        <p className="py-4">
          To record your interview answers, we need access to your microphone.
          This will only be used to capture your responses during the interview.
        </p>

        {error && (
          <div className="alert alert-error mb-4">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onRequestPermission}>
            <MicrophoneIcon className="w-4 h-4 mr-2" />
            Allow Microphone Access
          </button>
        </div>
      </div>
    </div>
  );
};
