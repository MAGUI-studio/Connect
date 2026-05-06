import { describe, expect, test, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollDepth } from "./useScrollDepth";

// Mock useAnalytics
const trackEventMock = vi.fn();
vi.mock("./useAnalytics", () => ({
  useAnalytics: () => ({
    trackEvent: trackEventMock,
  }),
}));

describe("useScrollDepth", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset scroll values
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
    });
  });

  const simulateScroll = (percent: number) => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = (percent / 100) * scrollHeight;
    Object.defineProperty(window, "scrollY", {
      value: scrollTop,
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  };

  test("tracks scroll at 25%", () => {
    renderHook(() => useScrollDepth());
    simulateScroll(30);

    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 25,
    });
  });

  test("tracks scroll at 50%", () => {
    renderHook(() => useScrollDepth());
    simulateScroll(55);

    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 25,
    });
    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 50,
    });
  });

  test("tracks scroll at 75%", () => {
    renderHook(() => useScrollDepth());
    simulateScroll(80);

    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 75,
    });
  });

  test("tracks scroll at 100%", () => {
    renderHook(() => useScrollDepth());
    simulateScroll(100);

    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 100,
    });
  });

  test("does not track same milestone twice", () => {
    renderHook(() => useScrollDepth());
    simulateScroll(30);
    simulateScroll(35);

    expect(trackEventMock).toHaveBeenCalledTimes(1);
    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 25,
    });
  });

  test("runs handleScroll on mount", () => {
    // Page already scrolled at mount
    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    renderHook(() => useScrollDepth());

    expect(trackEventMock).toHaveBeenCalledWith("scroll_depth", {
      depth_percent: 50,
    });
  });
});
