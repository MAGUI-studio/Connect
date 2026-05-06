import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono, Onest } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/WebVitals";
import { ScrollDepthTracker } from "@/hooks/useScrollDepth";
import { ThemeProvider } from "@/lib/providers/themeProvider";
import {
  getCurrentRequestHost,
  getProfileLocale,
  getPublicProfileBySlugOrDomain,
} from "@/services/magui-connect-public";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAGUI Connect",
  description: "Landing page profissional.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = await getCurrentRequestHost();
  const profile = await getPublicProfileBySlugOrDomain({ host });
  const lang = getProfileLocale(profile?.locale);

  return (
    <html
      lang={lang}
      className={`${montserrat.variable} ${onest.variable} ${jetbrainsMono.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <body className="relative mx-auto flex min-h-full max-w-440 flex-col overflow-x-hidden font-sans">
        <WebVitals />
        <ScrollDepthTracker />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
