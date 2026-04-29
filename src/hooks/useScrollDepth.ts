"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "./useAnalytics";

/**
 * useScrollDepth Hook
 * Tracks user engagement by firing events at 25%, 50%, 75%, and 100% of the page height.
 */
export function useScrollDepth() {
  const { trackEvent } = useAnalytics();
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

      const milestones = [25, 50, 75, 100];

      milestones.forEach((milestone) => {
        if (
          scrollPercent >= milestone &&
          !trackedDepths.current.has(milestone)
        ) {
          trackedDepths.current.add(milestone);
          trackEvent("scroll_depth", {
            depth_percent: milestone,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount in case the page is already scrolled or very short
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackEvent]);
}

/**
 * ScrollDepthTracker Component
 * A wrapper component that can be placed in the layout to enable tracking globally.
 */
export function ScrollDepthTracker() {
  useScrollDepth();
  return null;
}
