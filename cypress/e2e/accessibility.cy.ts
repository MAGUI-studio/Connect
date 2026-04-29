describe("Accessibility Audit", () => {
  it("should have no detectable a11y violations on load", () => {
    cy.visit("/");
    cy.injectAxe();

    // Check for violations on initial load
    // We log violations to the terminal for better visibility in CI
    cy.checkA11y(
      undefined,
      {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "best-practice"],
        },
      },
      (violations) => {
        cy.task(
          "log",
          `SEO Audit Failed: Found ${violations.length} accessibility violations`
        );
      }
    );
  });
});
