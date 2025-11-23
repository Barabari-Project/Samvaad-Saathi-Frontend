"use client";
import { useSearchParams } from "next/navigation";
import { CodeView, Footer, Header, Question, Welcome } from "./_components";

const InterviewPage = () => {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const useResume = searchParams.get("useResume");
  const role = searchParams.get("role");

  return (
    <div>
      <Welcome role={role || ""} />
      {/* <Header />
      <Question />
      <CodeView />
      <Footer /> */}
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
