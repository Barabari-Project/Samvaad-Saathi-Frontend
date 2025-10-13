import React from "react";

const HistorySkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Skeleton for tabs */}
      <div className="skeleton h-14 w-full rounded-xl"></div>

      {/* Skeleton for interview cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-lg p-4">
          {/* Title and difficulty badge row */}
          <div className="flex justify-between items-start mb-2">
            <div className="skeleton h-6 w-32"></div>
            <div className="skeleton h-5 w-16 rounded-full"></div>
          </div>

          {/* Date and attempt row */}
          <div className="skeleton h-4 w-48 mb-4"></div>

          {/* Progress section (only for completed interviews, but we'll show it for simplicity) */}
          <div className="flex items-center gap-4 mb-4">
            {/* Circular progress placeholder */}
            <div className="skeleton w-[150px] h-[150px] rounded-full shrink-0"></div>

            {/* Text content */}
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-40"></div>
              <div className="skeleton h-4 w-36"></div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className="skeleton w-3 h-3 rounded-full"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="skeleton w-3 h-3 rounded-full"></div>
                  <div className="skeleton h-3 w-28"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <div className="skeleton h-8 w-24"></div>
            <div className="skeleton h-8 w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistorySkeletonLoader;
