import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

/**
 * SEO Heading Hierarchy Auditor
 * Ensures the landing page follows semantic SEO best practices.
 */
describe("SEO Heading Hierarchy", () => {
  it("should have exactly one H1 tag", () => {
    render(<div />); // Placeholder
  });

  it("should not skip heading levels", () => {
    // Audit logic
  });
});

/**
 * Generic Audit function to be used in Page tests
 */
export function auditHeadingHierarchy(container: HTMLElement) {
  const headings = Array.from(
    container.querySelectorAll("h1, h2, h3, h4, h5, h6")
  );
  const tags = headings.map((h) => parseInt(h.tagName[1]));

  // 1. Check single H1
  const h1Count = tags.filter((t) => t === 1).length;
  if (h1Count !== 1) {
    throw new Error(
      `SEO Audit Failed: Expected exactly 1 H1 tag, found ${h1Count}.`
    );
  }

  // 2. Check for level skipping
  for (let i = 1; i < tags.length; i++) {
    if (tags[i] > tags[i - 1] + 1) {
      throw new Error(
        `SEO Audit Failed: Skipped heading level from H${tags[i - 1]} to H${tags[i]}.`
      );
    }
  }
}
