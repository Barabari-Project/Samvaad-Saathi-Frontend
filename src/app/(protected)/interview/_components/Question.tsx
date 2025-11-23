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
        <h2 className="text-[28px] leading-[1.4] text-slate-900 font-normal">
          This is a critical part of the challenge. How would you specifically
          address the performance issues associated with rendering thousands of
          items? Mention and explain at least two distinct techniques.
        </h2>
      </div>

      {/* Tag */}
      <div className="flex">
        <span className="badge badge-lg border-transparent bg-[#FDF89F] text-[#5F4B0C] rounded h-auto py-1.5 px-3 font-medium tracking-wide">
          Situational question
        </span>
      </div>
    </div>
  );
};

export default Question;
