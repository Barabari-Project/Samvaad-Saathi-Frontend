"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTextToSpeechOptions {
  /**
   * The text to be spoken
   */
  text: string | undefined;
  /**
   * Whether speech should be disabled (e.g., when loading)
   */
  disabled?: boolean;
  /**
   * Speech rate (0.1 to 10, default: 0.9 for more natural speech)
   */
  rate?: number;
  /**
   * Speech pitch (0 to 2, default: 1.0)
   */
  pitch?: number;
  /**
   * Speech volume (0 to 1, default: 1.0)
   */
  volume?: number;
  /**
   * Language code (default: "en-IN")
   */
  lang?: string;
  /**
   * Preferred voice name (e.g., "Google UK English Female", "Microsoft Zira")
   * If not specified, will auto-select the best available voice
   */
  voiceName?: string;
  /**
   * Whether to use natural pauses for punctuation (default: true)
   */
  useNaturalPauses?: boolean;
}

/**
 * Preprocesses text to add natural pauses for better speech flow
 */
const preprocessTextForNaturalSpeech = (text: string): string => {
  // Add pauses after punctuation marks
  return text
    .replace(/\./g, ". ") // Periods
    .replace(/\?/g, "? ") // Question marks
    .replace(/!/g, "! ") // Exclamation marks
    .replace(/,/g, ", ") // Commas
    .replace(/;/g, "; ") // Semicolons
    .replace(/:/g, ": ") // Colons
    .replace(/\s+/g, " ") // Normalize multiple spaces
    .trim();
};

/**
 * Finds the best available voice for the given language
 */
const findBestVoice = (
  lang: string,
  preferredVoiceName?: string
): SpeechSynthesisVoice | null => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // If preferred voice is specified, try to find it
  if (preferredVoiceName) {
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes(preferredVoiceName.toLowerCase()) &&
        voice.lang.startsWith(lang.split("-")[0])
    );
    if (preferredVoice) return preferredVoice;
  }

  // Filter voices by language
  const langVoices = voices.filter((voice) =>
    voice.lang.startsWith(lang.split("-")[0])
  );

  if (langVoices.length === 0) {
    // Fallback to any English voice
    const englishVoices = voices.filter((voice) => voice.lang.startsWith("en"));
    if (englishVoices.length > 0) return englishVoices[0];
    return voices[0]; // Last resort: first available voice
  }

  // Prefer neural/premium voices (they often have "Neural" or "Premium" in the name)
  const neuralVoice = langVoices.find(
    (voice) =>
      voice.name.toLowerCase().includes("neural") ||
      voice.name.toLowerCase().includes("premium") ||
      voice.name.toLowerCase().includes("enhanced")
  );
  if (neuralVoice) return neuralVoice;

  // Prefer female voices (often sound more natural for questions)
  const femaleVoice = langVoices.find(
    (voice) =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("zira") ||
      voice.name.toLowerCase().includes("samantha")
  );
  if (femaleVoice) return femaleVoice;

  // Return the first matching language voice
  return langVoices[0];
};

/**
 * Custom hook for text-to-speech functionality using the Web Speech API
 * Enhanced with natural voice selection and speech preprocessing
 *
 * @example
 * ```tsx
 * const { speak, stop, isSupported } = useTextToSpeech({
 *   text: "Hello, world!",
 *   disabled: false,
 *   rate: 0.9, // Slightly slower for more natural speech
 *   pitch: 1.0,
 *   volume: 1.0,
 *   lang: "en-IN",
 *   useNaturalPauses: true
 * });
 * ```
 */
export const useTextToSpeech = ({
  text,
  disabled = false,
  rate = 0.9, // Slightly slower for more natural speech
  pitch = 1.0,
  volume = 1.0,
  lang = "en-IN",
  voiceName,
  useNaturalPauses = true,
}: UseTextToSpeechOptions) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check if browser supports speech synthesis
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Ensure voices are loaded (some browsers load them asynchronously)
  useEffect(() => {
    if (!isSupported) return;

    // Trigger voices loading by calling getVoices
    // This helps ensure voices are available when needed
    window.speechSynthesis.getVoices();
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (textToSpeak: string) => {
      if (!isSupported) {
        console.warn("Text-to-speech is not supported in this browser");
        return;
      }

      // Cancel any ongoing speech
      stop();

      // Preprocess text for natural pauses
      const processedText = useNaturalPauses
        ? preprocessTextForNaturalSpeech(textToSpeak)
        : textToSpeak;

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(processedText);

      // Configure speech settings for natural sound
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = lang;

      // Select the best available voice
      const selectedVoice = findBestVoice(lang, voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Store reference for cleanup
      utteranceRef.current = utterance;

      // Set up event handlers to track speaking state
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      // Speak the text
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, pitch, volume, lang, voiceName, useNaturalPauses, stop]
  );

  useEffect(() => {
    // Only speak when text is available and not disabled
    if (disabled || !text) {
      stop();
      return;
    }

    speak(text);

    // Cleanup function
    return () => {
      stop();
    };
  }, [text, disabled, speak, stop]);

  return {
    speak,
    stop,
    isSupported,
    isSpeaking,
  };
};
