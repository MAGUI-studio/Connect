"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ExternalLink, MapPin, Building2, Share2, Info } from "lucide-react";
import { ThemeToggle } from "./common/themeToggle";

type Profile = {
  displayName: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  professionalCategory: string | null;
  location: string | null;
  companyName: string | null;
  whatsapp: string | null;
  publicEmail: string | null;
  publicPhone: string | null;
  primaryCtaLabel: string | null;
  primaryCtaUrl: string | null;
  themeAccent: string | null;
  themeBackground: string | null;
  themeForeground: string | null;
  MaguiConnectLink: Array<{
    id: string;
    label: string;
    url: string;
    kind: string;
    icon: string | null;
    isFeatured: boolean;
    openInNewTab: boolean;
  }>;
};

const getIconPath = (kind: string, url: string = "") => {
  const normalizedKind = kind.toUpperCase();
  const lowerUrl = url.toLowerCase();

  // Special handling for Email provider
  if (normalizedKind === "EMAIL" || lowerUrl.startsWith("mailto:")) {
    if (lowerUrl.includes("gmail.com")) return "/icons/Gmail.svg";
    if (
      lowerUrl.includes("outlook.com") ||
      lowerUrl.includes("hotmail.com") ||
      lowerUrl.includes("live.com") ||
      lowerUrl.includes("msn.com")
    )
      return "/icons/Outlook.svg";
    return "/icons/Email.svg";
  }

  const iconMap: Record<string, string> = {
    INSTAGRAM: "Instagram",
    LINKEDIN: "LinkedIn",
    YOUTUBE: "Youtube",
    TWITTER: "X",
    X: "X",
    TIKTOK: "Tiktok",
    WHATSAPP: "Whatsapp",
    SPOTIFY: "Spotify",
    APPLEMUSIC: "AppleMusic",
    TELEGRAM: "Telegram",
    DISCORD: "Discord",
    THREADS: "Threads",
    TWITCH: "Twitch",
    BEHANCE: "Behance",
    ARTSTATION: "Artstation",
    DRIBBBLE: "Dribbble",
    MEDIUM: "Medium",
    PINTEREST: "Pinterest",
    VIMEO: "Vimeo",
    MAPS: "Maps",
    DRIVE: "Drive",
    AMAZON: "Amazon",
    ALIEXPRESS: "AliExpress",
    MERCADOLIVRE: "MercadoLivre",
    SHOPEE: "Shopee",
    HOTMART: "Hotmart",
    KIWIFY: "Kiwify",
    EDUZZ: "Eduzz",
  };

  const iconName = iconMap[normalizedKind];
  return iconName ? `/icons/${iconName}.svg` : "/icons/Link.svg";
};

export function ProfileView({ profile }: { profile: Profile }) {
  const accentColor = profile.themeAccent || "#3b82f6";

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div
      className="selection:bg-opacity-20 bg-background text-foreground relative flex min-h-screen w-full justify-center overflow-x-hidden font-sans antialiased"
      style={
        {
          selectionColor: accentColor,
        } as React.CSSProperties
      }
    >
      {/* Theme Toggle Positioned at Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Dynamic Background - More subtle and theme-aware */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50 dark:opacity-20">
        <div
          className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full blur-[120px]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full blur-[100px]"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <main className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 py-16">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10 flex w-full flex-col items-center text-center"
        >
          {/* Avatar */}
          <div className="group relative mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 rounded-full opacity-30 blur-2xl"
              style={{ backgroundColor: accentColor }}
            />
            {profile.avatarUrl ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="border-border/50 relative h-32 w-32 overflow-hidden rounded-full border-4 shadow-2xl"
              >
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <div className="bg-muted border-border/50 relative flex h-32 w-32 items-center justify-center rounded-full border-4 text-5xl font-bold">
                {profile.displayName.charAt(0)}
              </div>
            )}

            {/* Online Status or Badge */}
            <div className="border-background absolute right-3 bottom-1 h-6 w-6 rounded-full border-4 bg-green-500 shadow-lg" />
          </div>

          <h1 className="text-foreground mb-2 text-4xl font-extrabold tracking-tight">
            {profile.displayName}
          </h1>

          <div className="mb-6 flex flex-col items-center gap-1">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {profile.professionalCategory && (
                <span className="bg-muted/50 border-border/50 text-foreground/80 rounded-full border px-3 py-1 text-sm font-semibold">
                  {profile.professionalCategory}
                </span>
              )}
              {profile.companyName && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Building2 size={14} /> {profile.companyName}
                </span>
              )}
            </div>

            {profile.location && (
              <span className="text-muted-foreground/60 mt-1 flex items-center gap-1 text-xs font-medium">
                <MapPin size={12} /> {profile.location}
              </span>
            )}
          </div>

          {profile.headline && (
            <p className="text-foreground/90 mb-4 max-w-sm text-lg leading-snug font-medium">
              {profile.headline}
            </p>
          )}

          {profile.bio && (
            <div className="group relative max-w-md">
              <p className="text-muted-foreground mb-2 line-clamp-3 text-sm leading-relaxed italic transition-all duration-300 group-hover:line-clamp-none">
                {profile.bio}
              </p>
              <div className="text-muted-foreground/20 flex justify-center transition-opacity group-hover:opacity-0">
                <Info size={12} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Primary CTA */}
        {profile.primaryCtaUrl && profile.primaryCtaLabel && (
          <motion.a
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            href={profile.primaryCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mb-12 flex w-full items-center justify-between overflow-hidden rounded-2xl p-5 shadow-xl transition-all"
            style={{ backgroundColor: accentColor }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative z-10 pl-2 text-lg font-bold text-white">
              {profile.primaryCtaLabel}
            </span>
            <div className="relative z-10 rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-colors group-hover:bg-white/30">
              <Share2 size={20} className="text-white" />
            </div>
          </motion.a>
        )}

        {/* Links Navigation */}
        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col gap-4"
        >
          {profile.MaguiConnectLink.map((link) => (
            <motion.a
              key={link.id}
              variants={item}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
              target={link.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 ${
                link.isFeatured ? "ring-1" : ""
              }`}
              style={{
                backgroundColor: "var(--card)",
                borderColor: link.isFeatured
                  ? `${accentColor}50`
                  : "var(--border)",
                boxShadow: link.isFeatured
                  ? `0 10px 30px -10px ${accentColor}30`
                  : "none",
              }}
            >
              {/* Highlight background on hover */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, ${accentColor}10, transparent)`,
                }}
              />

              <div className="flex h-12 w-12 items-center justify-center transition-all duration-300">
                <Image
                  src={getIconPath(link.kind, link.url)}
                  alt={link.label}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-foreground/90 group-hover:text-foreground text-base font-bold transition-colors">
                  {link.label}
                </span>
                <span className="text-muted-foreground/60 group-hover:text-muted-foreground max-w-[200px] truncate text-[10px] transition-opacity">
                  {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </div>

              <div className="mr-2 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                <ExternalLink size={16} className="text-muted-foreground" />
              </div>

              {link.isFeatured && (
                <div className="absolute top-0 right-0 p-3">
                  <div className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ backgroundColor: accentColor }}
                    ></span>
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></span>
                  </div>
                </div>
              )}
            </motion.a>
          ))}
        </motion.nav>

        {/* Contact Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 flex w-full flex-col items-center gap-10 pb-16"
        >
          <div className="flex items-center gap-4">
            {profile.publicEmail && (
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                href={`mailto:${profile.publicEmail}`}
                className="flex h-12 w-12 items-center justify-center transition-all"
                title="Email"
              >
                <Image
                  src={getIconPath("EMAIL", profile.publicEmail)}
                  alt="Email"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </motion.a>
            )}
            {profile.publicPhone && (
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href={`tel:${profile.publicPhone}`}
                className="flex h-12 w-12 items-center justify-center transition-all"
                title="Call"
              >
                <Image
                  src={getIconPath("PHONE", profile.publicPhone)}
                  alt="Phone"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </motion.a>
            )}
          </div>

          <footer className="flex w-full flex-col items-center gap-8">
            <div className="via-border h-[1px] w-full max-w-[100px] bg-gradient-to-r from-transparent to-transparent" />

            <motion.a
              whileHover={{ opacity: 1, scale: 1.02 }}
              href="https://magui.studio"
              target="_blank"
              className="group flex flex-col items-center gap-3 opacity-30 transition-all hover:opacity-100"
            >
              <span className="text-foreground/80 text-[10px] font-bold tracking-[0.3em]">
                POWERED BY
              </span>
              <div className="bg-card border-border group-hover:border-border/80 rounded-xl border px-4 py-2 transition-all">
                <span className="text-foreground text-xs font-black tracking-widest">
                  MAGUI.STUDIO
                </span>
              </div>
            </motion.a>
          </footer>
        </motion.div>
      </main>

      {/* WhatsApp Floating Widget */}
      {profile.whatsapp && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-full max-w-440 -translate-x-1/2 justify-end px-6">
          <motion.a
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.5,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto"
            title="Fale conosco no WhatsApp"
          >
            <Image
              src="/icons/Whatsapp.svg"
              alt="WhatsApp"
              width={56}
              height={56}
              className="drop-shadow-xl"
            />
          </motion.a>
        </div>
      )}
    </div>
  );
}
