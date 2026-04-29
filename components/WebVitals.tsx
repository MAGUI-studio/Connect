"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.log(metric);
    }

    // Example: Push to analytics
    // const body = JSON.stringify(metric);
    // (navigator.sendBeacon || fetch)('/analytics', { body, method: 'POST', keepalive: true });
  });

  return null;
}
