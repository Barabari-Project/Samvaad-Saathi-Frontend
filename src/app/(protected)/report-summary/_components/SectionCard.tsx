import React from "react";

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
};

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => (
  <div className="card bg-[#EEEFFC] shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-lg font-semibold">{title}</h2>
      <div className="text-base-content">{children}</div>
    </div>
  </div>
);

export default SectionCard;
