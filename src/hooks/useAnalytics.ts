"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Unified Tracking Layer Hook
 * Centralizes all marketing and analytics events.
 * Compatible with GTM, Facebook Pixel, and GA4 via DataLayer.
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      if (typeof window === "undefined") return;

      // Initialize dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];

      const payload = {
        event,
        ...properties,
        timestamp: new Date().toISOString(),
      };

      // Push to DataLayer (Partytown will pick this up if configured)
      window.dataLayer.push(payload);

      if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics Event]: ${event}`, payload);
      }
    },
    []
  );

  const trackLead = useCallback(
    (email: string, properties?: Record<string, unknown>) => {
      trackEvent("lead_capture", {
        email,
        ...properties,
      });
    },
    [trackEvent]
  );

  const trackConversion = useCallback(
    (
      value: number,
      currency: string = "BRL",
      properties?: Record<string, unknown>
    ) => {
      trackEvent("conversion", {
        value,
        currency,
        ...properties,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackLead,
    trackConversion,
  };
}
