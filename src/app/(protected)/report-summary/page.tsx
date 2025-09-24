import React from "react";

type ScoreBarProps = {
  label: string;
  score: number; // 0-100 percentage
};

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>{label}</span>
        <span className="font-medium">{Math.round(score)}%</span>
      </div>
      <div className="h-2 rounded bg-gray-200">
        <div
          className="h-2 rounded bg-gray-800"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
};

// Example minimal JSON structure powering the UI
// In a real app, fetch this via API and pass to the component
const exampleReport = {
  meta: {
    candidateName: "Sarah Chen",
    interviewDate: "Dec 15, 2024",
    role: "Frontend Development",
  },
  scores: {
    knowledge: {
      total: 72,
      breakdown: [
        { label: "Accuracy", outOf: 4, value: 3.6 },
        { label: "Depth", outOf: 3, value: 2.4 },
        { label: "Relevance", outOf: 4, value: 3.0 },
        { label: "Examples", outOf: 3, value: 2.2 },
        { label: "Terminology", outOf: 4, value: 3.1 },
      ],
    },
    speech: {
      total: 80,
      breakdown: [
        { label: "Fluency", outOf: 4, value: 3.8 },
        { label: "Structure", outOf: 4, value: 4.0 },
        { label: "Pacing", outOf: 4, value: 3.9 },
        { label: "Grammar", outOf: 4, value: 4.2 },
      ],
    },
  },
  summary: {
    strengths: [
      "Sound understanding of React lifecycle and component architecture",
      "Used appropriate terminology consistently",
      "Logical response structure with clear explanations",
      "Natural pacing and good articulation under pressure",
    ],
    improvements: [
      "Clarify async/await patterns and error handling",
      "Provide more specific, experience-based examples",
      "Reduce filler words to improve flow",
      "Keep tense consistent when describing past projects",
    ],
  },
  actions: {
    knowledge: [
      "Revisit async/await with interactive demos",
      "Prepare 2–3 concrete project scenarios with code",
      "Practice answering 'why' and 'how' questions",
    ],
    speech: [
      "Record short responses weekly and review filler words",
      "Focus on verb tenses and article usage",
      "Use STAR: Situation, Task, Action, Result",
    ],
  },
} as const;

const SectionCard: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <h2 className="mb-3 text-lg font-semibold tracking-tight text-gray-900">
      {title}
    </h2>
    <div className="text-gray-700">{children}</div>
  </section>
);

const ReportSummaryPage: React.FC = () => {
  const data = exampleReport;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-center">Web Development</h1>
      {/* Header */}
      <SectionCard title="Summary Overview">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500">Candidate Name</div>
          <div className="text-right font-medium">
            {data.meta.candidateName}
          </div>

          <div className="text-gray-500">Interview Date</div>
          <div className="text-right font-medium">
            {data.meta.interviewDate}
          </div>

          <div className="text-gray-500">Role/Topic</div>
          <div className="text-right font-medium">{data.meta.role}</div>
        </div>
      </SectionCard>

      {/* Scores */}
      <SectionCard title="Overall Score Summary">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Knowledge Competence</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {data.scores.knowledge.total}%
              </span>
            </div>
            <ScoreBar label="Average" score={data.scores.knowledge.total} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Speech & Structure</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {data.scores.speech.total}%
              </span>
            </div>
            <ScoreBar label="Average" score={data.scores.speech.total} />
          </div>
        </div>
      </SectionCard>

      {/* Final Summary */}
      <SectionCard title="Final Summary">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-green-700">Strengths</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {data.summary.strengths.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-red-700">
              Areas Of Improvement
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {data.summary.improvements.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Actionable Steps */}
      <SectionCard title="Actionable Steps">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-indigo-700">
              For Knowledge Development
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {data.actions.knowledge.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-fuchsia-700">
              For Speech & Structure Fluency
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {data.actions.speech.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default ReportSummaryPage;
