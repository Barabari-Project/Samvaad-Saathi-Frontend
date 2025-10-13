import React from "react";
import { FinalSummaryProps } from "./types";

const FinalSummary: React.FC<FinalSummaryProps> = ({ speechFluency }) => {
  return (
    <div id="final-summary">
      <div className="bg-white p-6 rounded-lg shadow-lg ">
        {/* Main Title */}
        <h2 className="text-2xl font-semibold text-fuchsia-600 mb-6">
          Speech Fluency
        </h2>

        <div className="space-y-6">
          {/* Strengths Section */}
          {speechFluency.strengths.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                Strengths
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                {speechFluency.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas of Improvement Section */}
          {speechFluency.areasOfImprovement.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3">
                Areas Of Improvement
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                {speechFluency.areasOfImprovement.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Steps Section */}
          {speechFluency.actionableSteps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                Actionable Steps
              </h3>
              <div className="space-y-4">
                {speechFluency.actionableSteps.map((step, index) => (
                  <div key={index}>
                    <h4 className="font-bold text-black mb-1">{step.title}:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>{step.description}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
