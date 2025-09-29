import {
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
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
              <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center">
                <StarIcon className="size-4 text-blue-600" />
              </div>
              <h3 className="font-medium">Knowledge Competence</h3>
            </div>
          </div>
          <ScoreBar label="Average" score={knowledgeCompetence.averagePct} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-green-100 rounded-full flex items-center justify-center">
                <ChatBubbleLeftEllipsisIcon className="size-4 text-green-600" />
              </div>
              <h3 className="font-medium">Speech & Structure</h3>
            </div>
          </div>
          <ScoreBar label="Average" score={speechStructure.averagePct} />
        </div>
      </div>
    </SectionCard>
  );
};

export default OverallScoreSummary;
