import { describe, expect, test, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAnalytics } from "./useAnalytics";

describe("useAnalytics", () => {
  beforeEach(() => {
    // Clear dataLayer
    window.dataLayer = [];
    vi.clearAllMocks();
  });

  test("trackEvent pushes to dataLayer", () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackEvent("test_event", { foo: "bar" });

    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({
      event: "test_event",
      foo: "bar",
      timestamp: expect.any(String),
    });
  });

  test("trackLead pushes lead_capture event", () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackLead("test@example.com", { source: "landing" });

    expect(window.dataLayer[0]).toMatchObject({
      event: "lead_capture",
      email: "test@example.com",
      source: "landing",
    });
  });

  test("trackConversion pushes conversion event", () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackConversion(100, "USD", { orderId: "123" });

    expect(window.dataLayer[0]).toMatchObject({
      event: "conversion",
      value: 100,
      currency: "USD",
      orderId: "123",
    });
  });

  test("trackConversion uses default currency BRL", () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackConversion(50);

    expect(window.dataLayer[0]).toMatchObject({
      currency: "BRL",
    });
  });

  test("initializes dataLayer if not exists", () => {
    // @ts-expect-error - testing initialization
    delete window.dataLayer;
    const { result } = renderHook(() => useAnalytics());
    result.current.trackEvent("init");
    expect(window.dataLayer).toBeDefined();
    expect(window.dataLayer).toHaveLength(1);
  });
});
