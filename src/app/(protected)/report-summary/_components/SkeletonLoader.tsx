import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="text-center">
        <div className="skeleton h-8 w-48 mx-auto mb-4"></div>
      </div>

      {/* Summary Overview Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-4 w-20 ml-auto"></div>
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-4 w-20 ml-auto"></div>
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-4 w-20 ml-auto"></div>
          </div>
        </div>
      </div>

      {/* Overall Score Summary Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-40 mb-6"></div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="skeleton w-6 h-6 rounded-full"></div>
                <div className="skeleton h-5 w-32"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-2 w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="skeleton w-6 h-6 rounded-full"></div>
                <div className="skeleton h-5 w-32"></div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-2 w-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-2 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Summary Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-32 mb-6"></div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="skeleton h-5 w-20 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-24 mb-2"></div>
                <div className="space-y-1">
                  <div className="skeleton h-3 w-full"></div>
                  <div className="skeleton h-3 w-3/4"></div>
                  <div className="skeleton h-3 w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="skeleton h-4 w-32 mb-2"></div>
                <div className="space-y-1">
                  <div className="skeleton h-3 w-full"></div>
                  <div className="skeleton h-3 w-2/3"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="skeleton h-5 w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-24 mb-2"></div>
                <div className="space-y-1">
                  <div className="skeleton h-3 w-full"></div>
                  <div className="skeleton h-3 w-5/6"></div>
                  <div className="skeleton h-3 w-3/4"></div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="skeleton h-4 w-32 mb-2"></div>
                <div className="space-y-1">
                  <div className="skeleton h-3 w-full"></div>
                  <div className="skeleton h-3 w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Steps Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-32 mb-6"></div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="skeleton h-5 w-40 mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="skeleton h-4 w-48 mb-2"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-5/6"></div>
                    <div className="skeleton h-3 w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="skeleton h-4 w-32 mb-2"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="skeleton h-4 w-36 mb-2"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="skeleton h-5 w-48 mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="skeleton h-4 w-28 mb-2"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-5/6"></div>
                  </div>
                </div>
                <div>
                  <div className="skeleton h-4 w-32 mb-2"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="skeleton h-4 w-36 mb-2"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per Question Analysis Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-40 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-base-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="flex gap-4">
                    <div className="skeleton h-3 w-16"></div>
                    <div className="skeleton h-3 w-16"></div>
                  </div>
                </div>
                <div className="skeleton h-4 w-full mb-3"></div>
                <div className="skeleton h-4 w-3/4 mb-2"></div>
                <div>
                  <div className="skeleton h-4 w-24 mb-1"></div>
                  <div className="space-y-1">
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-5/6"></div>
                    <div className="skeleton h-3 w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Highlights Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-32 mb-6"></div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="skeleton h-5 w-28 mb-4"></div>
              <div className="space-y-1">
                <div className="skeleton h-3 w-full"></div>
                <div className="skeleton h-3 w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="skeleton h-5 w-32 mb-4"></div>
              <div className="space-y-1">
                <div className="skeleton h-3 w-full"></div>
                <div className="skeleton h-3 w-5/6"></div>
                <div className="skeleton h-3 w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
