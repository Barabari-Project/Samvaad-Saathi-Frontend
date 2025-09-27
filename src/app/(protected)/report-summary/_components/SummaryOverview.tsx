import React from "react";
import SectionCard from "./SectionCard";

type SummaryOverviewProps = {
  interviewId: number;
  candidateName: string;
};

const SummaryOverview: React.FC<SummaryOverviewProps> = ({
  interviewId,
  candidateName,
}) => {
  return (
    <SectionCard title="Summary Overview">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">Candidate Name</div>
        <div className="text-right font-medium">{candidateName}</div>

        <div className="text-gray-500">Interview Date</div>
        <div className="text-right font-medium">
          {new Date().toLocaleDateString()}
        </div>

        <div className="text-gray-500">Role</div>
        <div className="text-right font-medium"></div>
      </div>
    </SectionCard>
  );
};

export default SummaryOverview;
