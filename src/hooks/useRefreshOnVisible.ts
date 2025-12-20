import { useEffect, useRef } from "react";
import { usePageVisibility } from "./usePageVisibility";

interface UseRefreshOnVisibleOptions {
  /**
   * Callback function to execute when page becomes visible
   */
  onRefresh: () => void | Promise<void>;

  /**
   * Minimum time in milliseconds between refreshes
   * If data was refreshed within this time, skip the refresh
   * Default: 30000 (30 seconds)
   */
  refreshThreshold?: number;

  /**
   * Whether the hook is enabled
   * Default: true
   */
  enabled?: boolean;
}

/**
 * Hook that automatically calls a refresh callback when the page becomes visible
 * after being hidden, with optional throttling based on last refresh time
 */
export const useRefreshOnVisible = ({
  onRefresh,
  refreshThreshold = 30000,
  enabled = true,
}: UseRefreshOnVisibleOptions): void => {
  const isVisible = usePageVisibility();
  const lastRefreshTime = useRef<number>(Date.now());
  const previousVisibility = useRef<boolean>(isVisible);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Detect transition from hidden to visible
    const becameVisible = !previousVisibility.current && isVisible;
    previousVisibility.current = isVisible;

    if (becameVisible) {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime.current;

      // Only refresh if enough time has passed since last refresh
      if (timeSinceLastRefresh >= refreshThreshold) {
        lastRefreshTime.current = Date.now();

        // Execute refresh callback
        const result = onRefresh();

        // Handle promise if callback is async
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error("Error during auto-refresh:", error);
          });
        }
      }
    }
  }, [isVisible, onRefresh, refreshThreshold, enabled]);

  // Update last refresh time when onRefresh changes (e.g., manual refresh)
  useEffect(() => {
    lastRefreshTime.current = Date.now();
  }, [onRefresh]);
};
