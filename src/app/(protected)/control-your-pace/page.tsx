"use client";

import {
    PlayIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const ControlYourPacePage = () => {
    return (
        <div className="flex flex-col gap-6 p-6 min-h-full bg-base-200/30">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2 pt-4">
                <div className="w-16 h-16 flex items-center justify-center">
                    <ChartBarIcon className="w-16 h-16 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-black">
                    Speech Pacing Practice
                </h1>
                <p className="text-gray-600">
                    Practice speaking at the right pace for interviews
                </p>
            </div>

            {/* Overall Readiness */}
            <div className="card bg-white shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-black text-lg">Overall Readiness</span>
                    <span className="font-bold text-blue-600 text-lg">35%</span>
                </div>
                <progress className="progress progress-primary w-full h-3" value="35" max="100"></progress>
            </div>

            {/* Level Cards */}
            <div className="flex flex-col gap-4">
                {/* Level 1 */}
                <div className="card bg-white shadow-sm border border-gray-100 p-5 relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="font-bold text-lg text-black mb-1">Level 1 - Sentence Control</h2>
                            <p className="text-sm text-gray-500 mb-4 pr-12">Master basic sentence delivery and pacing</p>
                            <div className="flex justify-between items-center">
                                <span className="badge badge-soft badge-primary text-xs px-3 py-2 font-medium">In Progress</span>
                                <span className="text-xs text-gray-400">Unlock level-2 at 90%</span>
                            </div>
                        </div>
                        <button className="btn btn-circle btn-ghost btn-sm bg-blue-50 text-blue-600 border border-blue-200 ml-2">
                            <PlayIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Level 2 */}
                <div className="card bg-gray-50 shadow-none border border-gray-100 p-5 opacity-60">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="font-bold text-lg text-gray-500 mb-1">Level 2 - Paragraph Fluency</h2>
                            <p className="text-sm text-gray-400 mb-4 pr-12">Build confidence with longer responses</p>
                            <div className="flex justify-between items-center">
                                <span className="badge badge-soft text-xs px-3 py-2 font-medium">Locked</span>
                                <span className="text-xs text-gray-400">Unlock level-3 at 90%</span>
                            </div>
                        </div>
                        <LockClosedIcon className="w-5 h-5 text-gray-400 ml-2" />
                    </div>
                </div>

                {/* Level 3 */}
                <div className="card bg-gray-50 shadow-none border border-gray-100 p-5 opacity-60">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="font-bold text-lg text-gray-500 mb-1">Level 3 - Interview Mastery</h2>
                            <p className="text-sm text-gray-400 mb-4 pr-12">Handle complex questions with confidence</p>
                            <div className="flex justify-between items-center">
                                <span className="badge badge-soft text-xs px-3 py-2 font-medium">Locked</span>
                                <span className="text-xs text-gray-400">Complete all levels</span>
                            </div>
                        </div>
                        <LockClosedIcon className="w-5 h-5 text-gray-400 ml-2" />
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pb-4">
                <Link
                    href="/control-your-pace/level-intro"
                    className="btn btn-neutral btn-block btn-lg bg-[#0F172A] text-white rounded-xl"
                >
                    Start level 1 Practice
                </Link>
            </div>
        </div>
    );
};

export default ControlYourPacePage;
