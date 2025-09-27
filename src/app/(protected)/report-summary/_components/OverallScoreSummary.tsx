import React from "react";
import ScoreBar from "./ScoreBar";
import SectionCard from "./SectionCard";

type OverallScoreSummaryProps = {
  knowledgeCompetence: {
    average5pt: number;
    averagePct: number;
    breakdown: {
      accuracy: number;
      depth: number;
      coverage: number;
      relevance: number;
    };
  };
  speechStructure: {
    average5pt: number;
    averagePct: number;
    breakdown: {
      pacing: number;
      structure: number;
      pauses: number;
      grammar: number;
    };
  };
};

const OverallScoreSummary: React.FC<OverallScoreSummaryProps> = ({
  knowledgeCompetence,
  speechStructure,
}) => {
  return (
    <SectionCard title="Overall Score Summary">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-medium">Knowledge Competence</h3>
            </div>
          </div>
          <ScoreBar label="Average" score={knowledgeCompetence.averagePct} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ScoreBar
              label="Accuracy"
              score={knowledgeCompetence.breakdown.accuracy}
            />
            <ScoreBar
              label="Depth"
              score={knowledgeCompetence.breakdown.depth}
            />
            <ScoreBar
              label="Coverage"
              score={knowledgeCompetence.breakdown.coverage}
            />
            <ScoreBar
              label="Relevance"
              score={knowledgeCompetence.breakdown.relevance}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Speech & Structure</h3>
            </div>
          </div>
          <ScoreBar label="Average" score={speechStructure.averagePct} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ScoreBar
              label="Pacing"
              score={speechStructure.breakdown.pacing * 20}
            />
            <ScoreBar
              label="Structure"
              score={speechStructure.breakdown.structure * 20}
            />
            <ScoreBar
              label="Pauses"
              score={speechStructure.breakdown.pauses * 20}
            />
            <ScoreBar
              label="Grammar"
              score={speechStructure.breakdown.grammar * 20}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default OverallScoreSummary;
