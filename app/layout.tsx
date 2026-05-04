import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/WebVitals";
import { ScrollDepthTracker } from "@/hooks/useScrollDepth";
import { BRAND_CONFIG } from "@/constants/config";
import { ThemeProvider } from "@/lib/providers/themeProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
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
      className={`${montserrat.variable} ${jetbrainsMono.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="relative mx-auto flex min-h-full max-w-440 flex-col overflow-x-hidden font-sans shadow-2xl ring-1 ring-white/5">
        <WebVitals />
        <ScrollDepthTracker />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
