import dayjs from "dayjs";
import React from "react";
import SectionCard from "./SectionCard";

type SummaryOverviewProps = {
  interviewId: number;
  candidateName: string;
  role: string;
  date: string;
};

const SummaryOverview: React.FC<SummaryOverviewProps> = ({
  interviewId,
  candidateName,
  role,
  date,
}) => {
  return (
    <SectionCard title="Summary Overview">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">Candidate Name</div>
        <div className="text-right font-medium">{candidateName}</div>

        <div className="text-gray-500">Interview Date</div>
        <div className="text-right font-medium">
          {dayjs(date).format("DD MMM , YYYY")}
        </div>

        <div className="text-gray-500">Role</div>
        <div className="text-right font-medium">{role}</div>
      </div>
    </SectionCard>
  );
};

export default SummaryOverview;
