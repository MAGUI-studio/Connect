describe("Visual Viewport Audit", () => {
  const viewports = [
    { device: "iPhone SE", width: 375, height: 667 },
    { device: "iPhone 12 Pro", width: 390, height: 844 },
    { device: "iPad Mini", width: 768, height: 1024 },
    { device: "Desktop 720p", width: 1280, height: 720 },
    { device: "Desktop 1080p", width: 1920, height: 1080 },
    { device: "Desktop 4K", width: 3840, height: 2160 },
  ];

  viewports.forEach((vp) => {
    it(`should look correct on ${vp.device}`, () => {
      cy.viewport(vp.width, vp.height);
      cy.visit("/");
      // Wait for animations if any
      cy.wait(500);
      cy.screenshot(`audit/viewports/${vp.device.replace(/\s+/g, "_")}`);
    });
  });
});
