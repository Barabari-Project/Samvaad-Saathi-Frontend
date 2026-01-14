"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const StructureYourAnswerPage = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 gap-4">
      <p>
        Practice structured answers to interview questions and build clarity
        under pressure.
      </p>

      {/* Lottie Animation */}
      <div className="w-48 h-48 mx-auto mb-6">
        <DotLottieReact
          src="/assets/lottie/Structure-icon.lottie"
          autoplay
          loop
        />
      </div>

      <p>
        Each question uses a specific framework—focus on structure, not
        perfection.
      </p>

      <button className="btn btn-outline">View Sample Answers</button>
      <button className="btn btn-primary">Start Today’s Practice</button>
    </div>
  );
};
export default StructureYourAnswerPage;
