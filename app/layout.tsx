import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Partytown } from "@builder.io/partytown/react";
import { WebVitals } from "@/components/WebVitals";

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
    default: "Landing Page Template",
    template: "%s | Brand",
  },
  description:
    "A modern, production-ready landing page template built with Next.js, Shadcn UI, and Framer Motion.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.example.com/",
    siteName: "Brand",
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
        {children}
      </body>
    </html>
  );
}
