describe("Profile Routes", () => {
  it("should show Development Mode screen when visiting / without a slug on localhost", () => {
    cy.visit("/");
    cy.contains("Development Mode").should("be.visible");
    cy.contains("?slug=your-profile-name").should("be.visible");
  });

  it("should show 404 Page Not Found when visiting /?slug=non-existent-slug", () => {
    // We expect a 404 status code, so we set failOnStatusCode to false
    cy.visit("/?slug=non-existent-slug", { failOnStatusCode: false });
    cy.contains("404").should("be.visible");
    cy.contains("Page not found").should("be.visible");
  });
});
