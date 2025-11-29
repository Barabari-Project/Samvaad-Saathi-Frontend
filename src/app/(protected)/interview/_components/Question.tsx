"use client";
const Question = () => {
  return (
    <div className="w-full py-6">
      {/* Top Row with Counter */}
      <div className="flex justify-end mb-2">
        <span className="text-lg text-slate-900 font-medium">1/5</span>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <p className="text-xl leading-[1.4] text-slate-900 font-normal">
          This is a critical part of the challenge. How would you specifically
          address the performance issues associated with rendering thousands of
          items? Mention and explain at least two distinct techniques.
        </p>
      </div>

      {/* Tag */}
      <div className="flex">
        <span className="badge badge-lg badge-warning">
          Situational question
        </span>
      </div>
    </div>
  );
};

export default Question;
