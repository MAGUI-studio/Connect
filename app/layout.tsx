import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Partytown } from "@builder.io/partytown/react";
import { WebVitals } from "@/components/WebVitals";
import { ScrollDepthTracker } from "@/hooks/useScrollDepth";
import { BRAND_CONFIG } from "@/constants/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND_CONFIG.seo.defaultTitle,
    template: BRAND_CONFIG.seo.titleTemplate,
  },
  description: BRAND_CONFIG.description,
  openGraph: {
    type: "website",
    locale: BRAND_CONFIG.seo.locale,
    url: BRAND_CONFIG.url,
    siteName: BRAND_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    site: BRAND_CONFIG.seo.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Partytown
          debug={process.env.NODE_ENV === "development"}
          forward={["dataLayer.push"]}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <WebVitals />
        <ScrollDepthTracker />
        {children}
      </body>
    </html>
  );
}
