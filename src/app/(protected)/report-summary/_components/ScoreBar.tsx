import React from "react";

type ScoreBarProps = {
  label: string;
  score: number; // 0-100 percentage
};

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  const getScoreInfo = (score: number) => {
    if (score >= 0 && score <= 20) {
      return { label: "Poor", color: "progress-error" };
    } else if (score >= 21 && score <= 40) {
      return { label: "Below Avg", color: "progress-warning" };
    } else if (score >= 41 && score <= 60) {
      return { label: "Avg", color: "progress-info" };
    } else if (score >= 61 && score <= 80) {
      return { label: "Good", color: "progress-success" };
    } else if (score >= 81 && score <= 100) {
      return { label: "Excellent", color: "progress-accent" };
    }
    return { label: "Poor", color: "progress-error" };
  };

  const scoreInfo = getScoreInfo(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-xs px-2 py-1 rounded-full bg-base-200 text-base-content">
          {scoreInfo.label}
        </span>
        <span className="font-medium text-base-content">
          {Math.round(score)}%
        </span>
      </div>
      <progress
        className={`progress ${scoreInfo.color} w-full`}
        value={Math.min(100, Math.max(0, score))}
        max="100"
      />
    </div>
  );
};

export default ScoreBar;
