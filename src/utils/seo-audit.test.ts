import { describe, it, expect } from "vitest";
import { auditHeadingHierarchy } from "./seo-audit";

describe("auditHeadingHierarchy", () => {
  it("should pass for valid hierarchy (H1 -> H2 -> H3)", () => {
    const container = document.createElement("div");
    container.innerHTML = "<h1>Title</h1><h2>Subtitle</h2><h3>Detail</h3>";
    expect(() => auditHeadingHierarchy(container)).not.toThrow();
  });

  it("should pass for valid hierarchy with multiple same-level headings", () => {
    const container = document.createElement("div");
    container.innerHTML =
      "<h1>Title</h1><h2>Subtitle 1</h2><h2>Subtitle 2</h2><h3>Detail 1</h3>";
    expect(() => auditHeadingHierarchy(container)).not.toThrow();
  });

  it("should fail if H1 is missing", () => {
    const container = document.createElement("div");
    container.innerHTML = "<h2>Subtitle</h2>";
    expect(() => auditHeadingHierarchy(container)).toThrow(
      "SEO Audit Failed: Expected exactly 1 H1 tag, found 0."
    );
  });

  it("should fail if there are multiple H1s", () => {
    const container = document.createElement("div");
    container.innerHTML = "<h1>Title 1</h1><h1>Title 2</h1>";
    expect(() => auditHeadingHierarchy(container)).toThrow(
      "SEO Audit Failed: Expected exactly 1 H1 tag, found 2."
    );
  });

  it("should fail if a level is skipped (H1 -> H3)", () => {
    const container = document.createElement("div");
    container.innerHTML = "<h1>Title</h1><h3>Skipped H2</h3>";
    expect(() => auditHeadingHierarchy(container)).toThrow(
      "SEO Audit Failed: Skipped heading level from H1 to H3."
    );
  });

  it("should fail if a level is skipped later in the document (H2 -> H4)", () => {
    const container = document.createElement("div");
    container.innerHTML = "<h1>Title</h1><h2>Subtitle</h2><h4>Skipped H3</h4>";
    expect(() => auditHeadingHierarchy(container)).toThrow(
      "SEO Audit Failed: Skipped heading level from H2 to H4."
    );
  });

  it("should pass if going back to a previous level (H1 -> H2 -> H3 -> H2)", () => {
    const container = document.createElement("div");
    container.innerHTML =
      "<h1>Title</h1><h2>Subtitle</h2><h3>Detail</h3><h2>Another Subtitle</h2>";
    expect(() => auditHeadingHierarchy(container)).not.toThrow();
  });

  it("should pass if skipping many levels upwards (H4 -> H1 is not possible due to single H1, but H4 -> H2 is fine)", () => {
    const container = document.createElement("div");
    container.innerHTML =
      "<h1>Title</h1><h2>S1</h2><h3>D1</h3><h4>Detail detail</h4><h2>S2</h2>";
    expect(() => auditHeadingHierarchy(container)).not.toThrow();
  });
});
