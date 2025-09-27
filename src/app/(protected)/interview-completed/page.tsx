"use client";
import { createApiClient } from "@/lib/api-config/src/client";
import { APIService } from "@/lib/api-config/src/config";
import { ENDPOINTS } from "@/lib/api-config/src/endpoints";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const InterviewCompleted = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const interviewId = searchParams.get("interviewId");
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const apiClient = createApiClient(APIService.ANALYSIS);

  // Generate final report mutation
  const { mutateAsync: generateFinalReport, isPending: isGeneratingReport } =
    apiClient.useMutation<unknown, { interviewId: number }>({
      url: ENDPOINTS.ANALYSIS.GENERATE_SUMMARY_REPORT,
      method: "post",
      successMessage: "Report generated successfully!",
      errorMessage: "Failed to generate report. Please try again.",
      options: {
        onSuccess: () => {
          router.push(`/report-summary?interviewId=${interviewId}`);
        },
      },
    });

  const handleViewReport = async () => {
    if (!interviewId) {
      console.error("No interview ID available");
      toast.error("No interview ID available");
      return;
    }

    // Set up timeout for 1 minute
    const timeoutId = setTimeout(() => {
      setShowTimeoutModal(true);
    }, 60000); // 60 seconds

    try {
      await generateFinalReport({
        interviewId: parseInt(interviewId),
      });
      // Clear timeout if report generation succeeds
      clearTimeout(timeoutId);
    } catch (error) {
      console.error("Failed to generate final report:", error);
      toast.error("Failed to generate final report");

      // Clear timeout on error
      clearTimeout(timeoutId);
    }
  };

  const handleReturnToHome = () => {
    setShowTimeoutModal(false);
    router.push("/home");
  };

  return (
    <div className="hero bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-md">
          {/* Lottie Animation */}
          <div className="mb-8">
            <DotLottieReact src="assets/lottie/Trophy.lottie" autoplay />
          </div>

          {/* Congratulations Message */}
          <h1 className="text-5xl font-bold">Congratulations!</h1>

          {/* Success Message */}
          <p className="py-6 text-lg">
            You have successfully completed your
            <span className="text-primary font-semibold">
              React Developer
            </span>{" "}
            interview
          </p>

          {/* Performance Report Message */}
          <p className="text-base-content/70 mb-8">
            Your performance report is ready! Check it out to see how you did.
          </p>

          {/* View Report Button */}
          <button
            onClick={handleViewReport}
            disabled={isGeneratingReport}
            className="btn btn-neutral btn-lg"
          >
            {isGeneratingReport && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {isGeneratingReport ? "Generating Report..." : "View Report"}
          </button>
        </div>
      </div>

      {/* Timeout Modal */}
      <dialog className={`modal ${showTimeoutModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">
              Your report is currently being generated.
            </h3>
            <p className="text-base mb-6">
              It will appear on your home screen as soon as it&apos;s ready.
            </p>
            <button onClick={handleReturnToHome} className="btn btn-secondary">
              Return to Home Screen
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default InterviewCompleted;
