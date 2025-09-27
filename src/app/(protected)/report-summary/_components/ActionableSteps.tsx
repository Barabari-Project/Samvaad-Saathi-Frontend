import React from "react";
import SectionCard from "./SectionCard";

type ActionableStepsProps = {
  knowledgeDevelopment: {
    targetedConceptReinforcement: string[];
    examplePractice: string[];
    conceptualDepth: string[];
  };
  speechStructureFluency: {
    fluencyDrills: string[];
    grammarPractice: string[];
    structureFramework: string[];
  };
};

const ActionableSteps: React.FC<ActionableStepsProps> = ({
  knowledgeDevelopment,
  speechStructureFluency,
}) => {
  return (
    <SectionCard title="Actionable Steps">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-4 font-semibold text-blue-700">
            Knowledge Development
          </h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-blue-600 mb-2">
                Targeted Concept Reinforcement
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {knowledgeDevelopment.targetedConceptReinforcement.map(
                  (concept, index) => (
                    <li key={index}>{concept}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-600 mb-2">
                Example Practice
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {knowledgeDevelopment.examplePractice.map((practice, index) => (
                  <li key={index}>{practice}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-600 mb-2">
                Conceptual Depth
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {knowledgeDevelopment.conceptualDepth.map((depth, index) => (
                  <li key={index}>{depth}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-purple-700">
            Speech Structure & Fluency
          </h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-purple-600 mb-2">
                Fluency Drills
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {speechStructureFluency.fluencyDrills.map((drill, index) => (
                  <li key={index}>{drill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-purple-600 mb-2">
                Grammar Practice
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {speechStructureFluency.grammarPractice.map(
                  (practice, index) => (
                    <li key={index}>{practice}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-purple-600 mb-2">
                Structure Framework
              </h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {speechStructureFluency.structureFramework.map(
                  (framework, index) => (
                    <li key={index}>{framework}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ActionableSteps;
