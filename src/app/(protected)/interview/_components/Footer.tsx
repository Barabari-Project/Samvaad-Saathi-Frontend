"use client";
import {
  MicrophoneIcon as HeroMicrophoneIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

interface FooterProps {
  isLoading?: boolean;
  disabled?: boolean;
}

const Footer = ({ isLoading = false, disabled = false }: FooterProps) => {
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
      {isLoading ? (
        <div className="flex justify-between items-center w-full animate-pulse">
          <div className="h-12 w-32 bg-slate-200 rounded-md"></div>
          <div className="h-12 w-24 bg-slate-200 rounded-md"></div>
        </div>
      ) : !isListening ? (
        <div className="flex justify-between items-center animate-fade-in w-full">
          <button
            onClick={handleAnswerClick}
            disabled={disabled}
            className="btn bg-primary hover:bg-primary/90 text-white px-6 normal-case font-normal text-lg rounded-md border-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Answer <HeroMicrophoneIcon className="h-5 w-5" />
          </button>

          <button 
            disabled={disabled}
            className="btn btn-outline px-8 normal-case font-normal text-lg rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      ) : (
        <>
          {/* Main container with gradient border and background */}
          {/* Main container with gradient border and background */}
          <div className="relative w-full max-w-2xl h-64 rounded-2xl border-4 border-blue-500/40 overflow-hidden shadow-lg bg-gradient-to-b from-blue-100 via-purple-50 to-yellow-50 animate-gradient backdrop-blur-sm">
            {/* Listening text */}
            <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
              <h1 className="text-xl font-medium text-slate-700 flex items-center gap-2">
                
                Listening...
              </h1>
            </div>

            {/* Centered circular microphone button with gradient */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-pulse delay-75"></div>
                
                <div className="relative size-20 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-pink-300 via-pink-200 to-cyan-300 transform transition-transform hover:scale-105">
                  {/* Microphone icon */}
                  <MicrophoneIcon className="size-10 text-blue-900" />
                </div>
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
