"use client";

import DifficultyTag from "@/components/DifficultyTag";
import { ArrowRightIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Word {
  index: number;
  word: string;
  phonetic: string;
}

interface PronunciationPracticeData {
  practiceId: number;
  difficulty: string;
  words: Word[];
  totalWords: number;
  status: string;
  createdAt: string;
}

const PronunciationPracticeStartPage = () => {
  const router = useRouter();
  const [practiceData, setPracticeData] =
    useState<PronunciationPracticeData | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    // Read data from sessionStorage
    const storedData = sessionStorage.getItem("pronunciationPracticeData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as PronunciationPracticeData;
        setPracticeData(data);
      } catch (error) {
        console.error("Error parsing practice data:", error);
        // Redirect back if data is invalid
        router.push("/pronunciation-practice");
      }
    } else {
      // Redirect back if no data
      router.push("/pronunciation-practice");
    }
  }, [router]);

  // Hide welcome screen after 2 seconds
  useEffect(() => {
    if (practiceData) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [practiceData]);

  const handleNext = () => {
    if (practiceData && currentWordIndex < practiceData.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else if (
      practiceData &&
      currentWordIndex === practiceData.words.length - 1
    ) {
      // All words completed, show congratulations screen
      setShowCompletion(true);
    }
  };

  if (!practiceData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show welcome screen
  if (showWelcome) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6">
        <div className="relative max-w-md w-full">
          {/* Gradient border using wrapper */}
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-2xl p-[2px]">
            <div className="bg-white rounded-xl p-8">
              <div className="text-gray-800 text-xl font-medium text-center">
                Hi ! Lets start your pronunciation practice 👋
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (showCompletion) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 max-w-md w-full">
          {/* Celebration graphic placeholder - simple party popper icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              {/* Simple party popper representation */}
              <div className="size-24 flex items-center justify-center">
                <DotLottieReact
                  src="/assets/lottie/Congratulations.lottie"
                  autoplay
                  loop
                />
              </div>
            </div>
          </div>

          {/* Congratulations Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold italic text-black">
            Congratulations
          </h1>

          {/* Message */}
          <p className="text-lg text-black text-center">
            You practiced {practiceData.totalWords} words today!
          </p>

          {/* Back Button */}
          <Link href="/home">
            <button className="btn btn-primary">
              Back To Interview Practice
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentWord = practiceData.words[currentWordIndex];

  // Format phonetic with dots between syllables (simple approach - split by spaces or common patterns)
  const formatPhonetic = (phonetic: string) => {
    // If phonetic contains spaces or separators, use them
    if (phonetic.includes(" ") || phonetic.includes("·")) {
      return phonetic.replace(/\s+/g, " · ").replace(/·+/g, "·");
    }
    // Otherwise, try to split into syllables (simple heuristic)
    // For now, just return as is - the API should provide formatted phonetic
    return phonetic;
  };

  const phoneticDisplay = formatPhonetic(currentWord.phonetic);

  const handlePlayPhonetic = () => {
    if (!currentWord?.phonetic) return;

    // Check if browser supports speech synthesis
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create speech utterance with phonetic text
    const utterance = new SpeechSynthesisUtterance(currentWord.phonetic);

    // Configure speech settings
    utterance.rate = isSlow ? 0.3 : 0.9; // Slower rate when isSlow is true
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = "en-US"; // Use English for phonetic pronunciation

    // Speak the phonetic text
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-4 p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#1f285b]">
            Pronunciation Practice
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Practice {practiceData.totalWords} commonly mispronounced words
              every day to build clear speech habits.
            </p>
            <div className="ml-4">
              <DifficultyTag difficulty={practiceData.difficulty} size="sm" />
            </div>
          </div>
        </div>

        {/* Word Display */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-4xl font-bold text-black">
            {currentWord.word}
          </div>
          <div className="text-sm text-gray-600">
            {currentWordIndex + 1}/{practiceData.totalWords}
          </div>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        {/* Instruction */}
        <div className="text-gray-600 text-sm">Practice with me</div>

        {/* Pronunciation Details Box */}
        <div className="bg-purple-100 rounded-xl p-6 mt-4">
          <div className="flex flex-col gap-4">
            <div className="text-gray-600 text-sm">Sounds like</div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-2xl font-bold text-black flex-1">
                {phoneticDisplay}
              </div>
              <button
                onClick={handlePlayPhonetic}
                className="flex-shrink-0 p-2 hover:bg-purple-200 rounded-lg transition-colors"
                aria-label="Play pronunciation"
              >
                <SpeakerWaveIcon className="h-6 w-6 text-[#1f285b]" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Stress:</span>
              <span className="bg-gray-200 text-black px-3 py-1 rounded-lg text-sm">
                {/* Stress indicator - would need API data for this */}
                {currentWord.word
                  .charAt(Math.floor(currentWord.word.length / 2))
                  .toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Speed Toggle */}
        <div className="flex items-center gap-3 mt-4">
          <input
            type="checkbox"
            checked={!isSlow}
            onChange={(e) => setIsSlow(!e.target.checked)}
            className="toggle toggle-sm"
            aria-label="Toggle speed"
          />
          <span className="text-gray-600 text-sm">
            {isSlow ? "Slow" : "Normal"}
          </span>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            className="btn bg-[#1f285b] hover:bg-[#1f285b]/90 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <span>Next Word</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PronunciationPracticeStartPage;
