import { useEffect, useState } from "react";

/**
 * Hook to detect page visibility changes using Page Visibility API
 * Returns true when page is visible, false when hidden
 * Includes debouncing to prevent excessive state updates
 */
export const usePageVisibility = (debounceMs: number = 300): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(
    typeof document !== "undefined" ? !document.hidden : true
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Debounce the visibility state update
      timeoutId = setTimeout(() => {
        setIsVisible(!document.hidden);
      }, debounceMs);
    };

    // Check if Page Visibility API is supported
    if (
      typeof document !== "undefined" &&
      typeof document.hidden !== "undefined"
    ) {
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Set initial state
      setIsVisible(!document.hidden);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [debounceMs]);

  return isVisible;
};
