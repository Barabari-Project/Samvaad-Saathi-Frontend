"use client";

import { ROLE_OPTIONS } from "@/lib/constants";
import {
    ChatBubbleLeftRightIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import pacingFeatures from "./pacing-features.json";

const FEATURE_ICONS: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    clock: ClockIcon,
    chatBubble: ChatBubbleLeftRightIcon,
};

const DIFFICULTY_LEVELS = [
    {
        key: "easy",
        label: "Easy",
        baseClass: "bg-yellow-100",
        activeClass: "bg-yellow-200 outline outline-2 outline-yellow-400",
        hoverClass: "hover:bg-yellow-200",
        fullWidth: false,
    },
    {
        key: "medium",
        label: "Medium",
        baseClass: "bg-purple-100",
        activeClass: "bg-purple-200 outline outline-2 outline-purple-400",
        hoverClass: "hover:bg-purple-200",
        fullWidth: false,
    },
    {
        key: "hard",
        label: "Hard",
        baseClass: "bg-pink-100",
        activeClass: "bg-pink-200 outline outline-2 outline-pink-400",
        hoverClass: "hover:bg-pink-200",
        fullWidth: true,
    },
] as const;

const ControlYourPacePage = () => {
    const [selectedRole, setSelectedRole] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [showPacingScreen, setShowPacingScreen] = useState(false);

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
    }

    const handleDifficultyChange = (difficulty: string) => {
        setDifficulty(difficulty);
    };

    if (showPacingScreen) {
        return (
            <div className="flex flex-col gap-6 p-6 min-h-full bg-base-200/30">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-2 pt-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                        <ChartBarIcon className="w-16 h-16 text-base-content" />
                    </div>
                    <h1 className="text-2xl font-bold text-base-content">
                        Speech Pacing Practice
                    </h1>
                    <p className="text-base-content/70">
                        Practice speaking at the right pace for interviews
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="flex flex-col gap-4 flex-1">
                    {pacingFeatures.map((feature) => {
                        const IconComponent = FEATURE_ICONS[feature.icon];
                        return (
                            <div
                                key={feature.id}
                                className="bg-base-100 rounded-xl p-4 shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${feature.iconBgClass}`}
                                    >
                                        <IconComponent
                                            className={`w-5 h-5 ${feature.iconColorClass}`}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg text-base-content mb-1">
                                            {feature.title}
                                        </h2>
                                        <p className="text-sm text-base-content/80">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div className="pt-4 mt-auto">
                    <button
                        type="button"
                        className="btn btn-neutral btn-block btn-lg"
                    >
                        Start level 1 Practice
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Role Selection */}
            <div>
                <label className="block text-sm font-medium text-black mb-2">
                    Role
                </label>
                <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>
                        Select a role
                    </option>
                    {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-black">
                    Difficulty Level
                </label>
                <p className="text-sm text-gray-600">Choose a difficulty level</p>

                <div className="grid grid-cols-2 gap-3">
                    {DIFFICULTY_LEVELS.map((level) => {
                        const isSelected = difficulty === level.key;
                        const buttonClass = isSelected
                            ? level.activeClass
                            : `${level.baseClass} ${level.hoverClass}`;

                        return (
                            <button
                                key={level.key}
                                type="button"
                                onClick={() => handleDifficultyChange(level.key)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium text-black transition-all ${buttonClass} ${level.fullWidth ? "col-span-2" : ""
                                    }`}
                            >
                                {level.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Get Started Button */}
            <div className="pt-4 mt-auto">
                <button
                    type="button"
                    onClick={() => setShowPacingScreen(true)}
                    className="btn btn-neutral btn-block btn-lg"
                >
                    Get Started
                </button>
            </div>
        </div>
    )
}
export default ControlYourPacePage