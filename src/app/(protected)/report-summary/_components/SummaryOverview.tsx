import dayjs from "dayjs";
import React from "react";
import SectionCard from "./SectionCard";
import { SummaryOverviewProps } from "./types";

const SummaryOverview: React.FC<SummaryOverviewProps> = ({
  candidateName,
  role,
  date,
  duration,
  durationFeedback,
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

        {duration && (
          <>
            <div className="text-gray-500">Duration</div>
            <div className="text-right font-medium">{duration}</div>
          </>
        )}

        {durationFeedback && (
          <>
            <div className="text-gray-500 col-span-2">Duration Feedback</div>
            <div className="text-right font-medium col-span-2">
              {durationFeedback}
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
};

export default SummaryOverview;
