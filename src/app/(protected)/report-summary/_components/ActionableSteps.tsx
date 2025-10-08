import React from "react";
import SectionCard from "./SectionCard";

type ActionableStepsProps = {
  actionableInsights: {
    heading: string;
    subtitle: string | null;
    groups: Array<{
      label: string;
      items: string[];
    }>;
  };
};

const ActionableSteps: React.FC<ActionableStepsProps> = ({
  actionableInsights,
}) => {
  return (
    <SectionCard title={actionableInsights.heading}>
      {actionableInsights.subtitle && (
        <p className="text-sm text-gray-600 mb-4">
          {actionableInsights.subtitle}
        </p>
      )}
      <div className="space-y-4">
        {actionableInsights.groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h5 className="font-medium text-blue-600 mb-2">{group.label}</h5>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default ActionableSteps;
