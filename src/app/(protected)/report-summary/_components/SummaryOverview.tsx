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
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <div className="text-gray-500">Candidate Name</div>
          <div className="text-right font-medium">{candidateName}</div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="text-gray-500">Interview Date</div>
          <div className="text-right font-medium">
            {dayjs(date).format("DD MMM , YYYY")}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="text-gray-500">Role</div>
          <div className="text-right font-medium">{role}</div>
        </div>

        {duration && (
          <div className="flex justify-between gap-2">
            <div className="text-gray-500">Duration</div>
            <div className="text-right font-medium">{duration}</div>
          </div>
        )}

        {durationFeedback && (
          <div className="flex justify-between gap-2">
            <div className="text-gray-500">Duration Feedback</div>
            <div className="text-right font-medium max-w-64">
              {durationFeedback}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default SummaryOverview;
