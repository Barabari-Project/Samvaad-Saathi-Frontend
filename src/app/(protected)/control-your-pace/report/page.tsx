"use client";

import {
    MicrophoneIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const ReportPage = () => {
    return (
        <div className="flex flex-col min-h-full bg-base-200/30">
            {/* Dark Header */}
            <div className="bg-[#1E293B] text-white p-6 pb-12 rounded-b-3xl">
                <h1 className="text-2xl font-bold text-center">Your Performance Report</h1>
            </div>

            <div className="p-6 -mt-8 space-y-6">
                {/* Score Card */}
                <div className="card bg-blue-600 text-white p-8 text-center shadow-lg rounded-3xl">
                    <p className="text-sm font-medium opacity-80 mb-2">Your Score</p>
                    <div className="text-7xl font-bold mb-4">58</div>
                    <p className="text-xs font-medium opacity-80">Good Progress! Keep Practicing</p>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                    {/* Speech Speed */}
                    <div className="card bg-white shadow-sm border border-gray-100 p-5 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-black">Speech Speed (WPM)</h3>
                            <span className="badge badge-success badge-soft text-green-600 text-[10px] font-bold py-3 px-3">
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Good
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-black">142</span>
                            <span className="text-sm text-gray-400">/ 120-150</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <p className="text-[11px] text-green-800 leading-tight">
                                Your speaking pace is within the ideal range for interviews
                            </p>
                        </div>
                    </div>

                    {/* Pause Distribution */}
                    <div className="card bg-white shadow-sm border border-gray-100 p-5 rounded-2xl relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-black">Pause Distribution</h3>
                            <span className="badge badge-warning badge-soft text-orange-600 text-[10px] font-bold py-3 px-3">
                                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                Needs Adjustment
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-sm text-gray-400">Score:</span>
                            <span className="text-xl font-bold text-black">73</span>
                            <span className="text-sm text-gray-400">/ 100</span>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                            <p className="text-[11px] text-orange-800 leading-tight">
                                Try pausing more frequently to give your listener time to process.
                            </p>
                        </div>
                    </div>

                    {/* Filler Words */}
                    <div className="card bg-white shadow-sm border border-gray-100 p-5 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-black">Filler Words</h3>
                            <span className="badge badge-error badge-soft text-red-600 text-[10px] font-bold py-3 px-3">
                                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                Needs Adjustment
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-bold text-black">5</span>
                            <span className="text-sm text-gray-400">/ {"<3"} per min</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-auto p-6 pb-10">
                <Link
                    href="/control-your-pace/practice"
                    className="btn btn-neutral btn-block btn-lg bg-[#0F172A] text-white rounded-xl"
                >
                    <MicrophoneIcon className="w-5 h-5 mr-2" />
                    Next Sentence
                </Link>
            </div>
        </div>
    );
};

export default ReportPage;
