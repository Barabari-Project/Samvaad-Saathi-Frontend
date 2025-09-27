import React from "react";

type ScoreBarProps = {
  label: string;
  score: number; // 0-100 percentage
};

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-base-content">{label}</span>
        <span className="font-medium text-base-content">
          {Math.round(score)}%
        </span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={Math.min(100, Math.max(0, score))}
        max="100"
      />
    </div>
  );
};

export default ScoreBar;
