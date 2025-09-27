import React from "react";
import SectionCard from "./SectionCard";

type TopicHighlightsProps = {
  strengthsTopics: string[];
  improvementTopics: string[];
};

const TopicHighlights: React.FC<TopicHighlightsProps> = ({
  strengthsTopics,
  improvementTopics,
}) => {
  return (
    <SectionCard title="Topic Highlights">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-green-700">
            Strengths Topics
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {strengthsTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-red-700">
            Improvement Topics
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {improvementTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
};

export default TopicHighlights;
