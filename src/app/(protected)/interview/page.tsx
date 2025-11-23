"use client";
import { MicPermissionModal, useMicPermission } from "@/hooks/useMicPermission";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CodeView, Footer, Header, Question, Welcome } from "./_components";

const InterviewPage = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const useResume = searchParams.get("useResume");
  const role = searchParams.get("role");

  const [hasStarted, setHasStarted] = useState(false);

  const {
    hasPermission,
    showModal,
    requestPermission,
    showPermissionModal,
    hidePermissionModal,
  } = useMicPermission();

  const handleStart = () => {
    if (hasPermission) {
      setHasStarted(true);
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
          <Welcome role={role || ""} onStart={handleStart} />
          <MicPermissionModal
            isOpen={showModal}
            onClose={hidePermissionModal}
            onRequestPermission={handleRequestPermission}
          />
        </>
      ) : (
        <div>
          <Header />
          <Question />
          <CodeView />
          <Footer />
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
