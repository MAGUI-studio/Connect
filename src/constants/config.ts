/**
 * Centralized Brand & Project Configuration
 * Update this file for each new client/project to automatically
 * update SEO, Contact info, and Social links across the site.
 */
export const BRAND_CONFIG = {
  name: "Brand Name",
  legalName: "Brand Inc.",
  tagline: "Building the future of the web.",
  description: "High-performance landing page template built with Next.js.",
  url: "https://www.example.com",
  logo: "/logo.png",

  // Contact Information
  contact: {
    email: "contact@example.com",
    phone: "+55 (11) 99999-9999",
    whatsapp: "5511999999999",
    address: {
      street: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      zip: "01234-567",
      country: "Brazil",
    },
  },

  // Social Media Links
  social: {
    instagram: "https://instagram.com/brand",
    linkedin: "https://linkedin.com/company/brand",
    twitter: "https://twitter.com/brand",
    github: "https://github.com/brand",
  },

  // SEO Defaults
  seo: {
    titleTemplate: "%s | Brand Name",
    defaultTitle: "Brand Name - High Performance Websites",
    locale: "pt_BR",
    twitterHandle: "@brand",
  },
};
