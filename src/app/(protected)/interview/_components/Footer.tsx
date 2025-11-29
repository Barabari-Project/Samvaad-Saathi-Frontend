"use client";
import {
  MicrophoneIcon as HeroMicrophoneIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

const Footer = () => {
  const [isListening, setIsListening] = useState(false);

  const handleAnswerClick = () => {
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
    // Logic to handle the recorded answer would go here
  };

  return (
    <div className="w-full py-4 transition-all duration-300 ease-in-out flex flex-col items-center justify-center">
      {!isListening ? (
        <div className="flex justify-between items-center animate-fade-in">
          <button
            onClick={handleAnswerClick}
            className="btn bg-primary hover:bg-primary/90 text-white px-6 normal-case font-normal text-lg rounded-md border-none flex items-center gap-2"
          >
            Answer <HeroMicrophoneIcon className="h-5 w-5" />
          </button>

          <button className="btn btn-outline px-8 normal-case font-normal text-lg rounded-md hover:bg-slate-100">
            Next
          </button>
        </div>
      ) : (
        <>
          {/* Main container with gradient border and background */}
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl border-4 border-blue-500/40 overflow-hidden shadow-xl bg-gradient-to-b from-blue-100 via-purple-50 to-yellow-50">
            {/* Listening text */}
            <div className="absolute top-8 left-0 right-0 flex justify-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Listening...
              </h1>
            </div>

            {/* Centered circular microphone button with gradient */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative size-20 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-pink-300 via-pink-200 to-cyan-300">
                {/* Microphone icon */}
                <MicrophoneIcon className="size-10 text-blue-900" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center w-full mt-8">
            <button
              onClick={handleStopListening}
              className="btn bg-primary hover:bg-primary/90 text-white px-8 min-w-[120px] border-none normal-case rounded-lg"
            >
              Redo
            </button>
            <button
              onClick={handleStopListening}
              className="btn bg-primary hover:bg-primary/90 text-white px-8 min-w-[120px] border-none normal-case rounded-lg"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
