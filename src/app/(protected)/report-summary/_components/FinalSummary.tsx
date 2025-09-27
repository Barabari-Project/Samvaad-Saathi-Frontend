import React from "react";
import SectionCard from "./SectionCard";

type FinalSummaryProps = {
  strengths: {
    knowledgeRelated: string[];
    speechFluencyRelated: string[];
  };
  areasOfImprovement: {
    knowledgeRelated: string[];
    speechFluencyRelated: string[];
  };
};

const FinalSummary: React.FC<FinalSummaryProps> = ({
  strengths,
  areasOfImprovement,
}) => {
  return (
    <SectionCard title="Final Summary">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-green-700">Strengths</h4>
          <div className="space-y-2">
            <h5 className="font-medium text-green-600">Knowledge-Related</h5>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {strengths.knowledgeRelated.length > 0 ? (
                strengths.knowledgeRelated.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))
              ) : (
                <li className="text-gray-500">
                  No specific strengths identified
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-2 mt-4">
            <h5 className="font-medium text-green-600">
              Speech Fluency-Related
            </h5>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {strengths.speechFluencyRelated.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-red-700">
            Areas Of Improvement
          </h4>
          <div className="space-y-2">
            <h5 className="font-medium text-red-600">Knowledge-Related</h5>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {areasOfImprovement.knowledgeRelated.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 mt-4">
            <h5 className="font-medium text-red-600">Speech Fluency-Related</h5>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {areasOfImprovement.speechFluencyRelated.map(
                (improvement, index) => (
                  <li key={index}>{improvement}</li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default FinalSummary;
