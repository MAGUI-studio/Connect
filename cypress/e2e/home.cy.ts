describe("Home Page", () => {
  it("should load the home page in Development Mode on localhost", () => {
    cy.visit("/");
    cy.contains("Development Mode").should("exist");
  });
});
