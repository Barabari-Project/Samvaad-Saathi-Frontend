import { useEffect, useState } from "react";

/**
 * Custom hook that returns true if the media query matches.
 * @param query The media query string (e.g., '(max-width: 768px)')
 */
export const useMediaQuery = (query: string): boolean => {
  // Default to false (or true depending on your SSR mobile-first strategy)
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media: MediaQueryList = window.matchMedia(query);

    // Set initial state
    setMatches(media.matches);

    // Modern browsers use 'change', older ones use 'addListener'
    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};
