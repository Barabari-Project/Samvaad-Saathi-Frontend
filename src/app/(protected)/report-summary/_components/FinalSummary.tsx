import React from "react";
import SectionCard from "./SectionCard";

type FinalSummaryProps = {
  strengths: {
    heading: string;
    subtitle: string | null;
    groups: Array<{
      label: string;
      items: string[];
    }>;
  };
  areasOfImprovement: {
    heading: string;
    subtitle: string | null;
    groups: Array<{
      label: string;
      items: string[];
    }>;
  };
};

const FinalSummary: React.FC<FinalSummaryProps> = ({
  strengths,
  areasOfImprovement,
}) => {
  return (
    <div className="space-y-6" id="final-summary">
      {/* Strengths Section */}
      <SectionCard title={strengths.heading}>
        {strengths.subtitle && (
          <p className="text-sm text-gray-600 mb-4">{strengths.subtitle}</p>
        )}
        <div className="space-y-4">
          {strengths.groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h5 className="font-medium text-green-600 mb-2">{group.label}</h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {group.items.length > 0 ? (
                  group.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))
                ) : (
                  <li className="text-gray-500">
                    No specific items identified
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Areas of Improvement Section */}
      <SectionCard title={areasOfImprovement.heading}>
        {areasOfImprovement.subtitle && (
          <p className="text-sm text-gray-600 mb-4">
            {areasOfImprovement.subtitle}
          </p>
        )}
        <div className="space-y-4">
          {areasOfImprovement.groups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h5 className="font-medium text-red-600 mb-2">{group.label}</h5>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default FinalSummary;
