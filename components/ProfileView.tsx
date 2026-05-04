"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { MapPin, ArrowRight, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./common/themeToggle";

type MaguiConnectLink = {
  id: string;
  label: string;
  url: string;
  kind: string;
  icon: string | null;
  isFeatured: boolean;
  isActive: boolean;
  openInNewTab: boolean;
  startsAt: Date | string | null;
  expiresAt: Date | string | null;
  sectionId: string | null;
};

type MaguiConnectSection = {
  id: string;
  title: string;
  isCollapsible: boolean;
  isActive: boolean;
  MaguiConnectLink: MaguiConnectLink[];
};

type Profile = {
  id: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  professionalCategory: string | null;
  location: string | null;
  companyName: string | null;
  whatsapp: string | null;
  whatsappMessage: string | null;
  publicEmail: string | null;
  publicPhone: string | null;
  primaryCtaLabel: string | null;
  primaryCtaUrl: string | null;
  themeAccent: string | null;
  themeBackground: string | null;
  themeForeground: string | null;
  slug: string | null;
  MaguiConnectLink: MaguiConnectLink[];
  MaguiConnectSection: MaguiConnectSection[];
};

const getIconPath = (kind: string, url: string = "") => {
  const normalizedKind = kind.toUpperCase();
  const lowerUrl = url.toLowerCase();

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

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export function ProfileView({ profile }: { profile: Profile }) {
  const accentColor = profile.themeAccent || "var(--primary)";
  const fontStyle = "var(--font-montserrat), ui-sans-serif, system-ui";

  const now = new Date();

  const isLinkActive = (link: MaguiConnectLink) => {
    if (!link.isActive) return false;
    const start = link.startsAt ? new Date(link.startsAt) : null;
    const end = link.expiresAt ? new Date(link.expiresAt) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  const topLevelLinks = useMemo(() => {
    return (profile.MaguiConnectLink || []).filter(
      (l) => !l.sectionId && isLinkActive(l)
    );
  }, [profile.MaguiConnectLink, now, isLinkActive]);

  const whatsappUrl = profile.whatsapp
    ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}${profile.whatsappMessage ? `?text=${encodeURIComponent(profile.whatsappMessage)}` : ""}`
    : null;

  return (
    <div
      className="bg-background text-foreground relative min-h-screen w-full overflow-x-hidden p-4 md:p-8 lg:p-12"
      style={{ fontFamily: fontStyle } as React.CSSProperties}
    >
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="mx-auto max-w-7xl">
        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Left Column: Profile Info */}
          <motion.div className="lg:col-span-4" variants={item}>
            <div className="bg-card/40 sticky top-8 flex flex-col items-center rounded-4xl p-8 text-center backdrop-blur-xl">
              <div className="relative mb-8">
                {profile.avatarUrl ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-full shadow-2xl md:h-48 md:w-48">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-40 w-40 items-center justify-center rounded-full text-5xl font-bold md:h-48 md:w-48">
                    {profile.displayName.charAt(0)}
                  </div>
                )}
                <div className="absolute right-4 bottom-4 h-6 w-6 rounded-full bg-emerald-500 shadow-lg" />
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {profile.displayName}
              </h1>

              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {profile.professionalCategory && (
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                    {profile.professionalCategory}
                  </span>
                )}
                {profile.companyName && (
                  <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                    {profile.companyName}
                  </span>
                )}
              </div>

              {profile.location && (
                <div className="text-muted-foreground mt-4 flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={16} /> {profile.location}
                </div>
              )}

              {profile.headline && (
                <p className="mt-6 text-lg leading-snug font-semibold">
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Quick Actions */}
              <div className="mt-8 flex w-full flex-col gap-3">
                {profile.primaryCtaUrl && profile.primaryCtaLabel && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={profile.primaryCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold shadow-lg transition-all"
                    style={{ backgroundColor: accentColor, color: "white" }}
                  >
                    {profile.primaryCtaLabel}
                    <ExternalLink size={18} />
                  </motion.a>
                )}

                <div className="flex items-center justify-center gap-6 py-4">
                  {whatsappUrl && (
                    <QuickAction
                      iconPath="/icons/Whatsapp.svg"
                      href={whatsappUrl}
                      label="WhatsApp"
                    />
                  )}
                  {profile.publicEmail && (
                    <QuickAction
                      iconPath={getIconPath("EMAIL", profile.publicEmail)}
                      href={`mailto:${profile.publicEmail}`}
                      label="Email"
                    />
                  )}
                  {profile.publicPhone && (
                    <QuickAction
                      iconPath="/icons/Link.svg"
                      href={`tel:${profile.publicPhone}`}
                      label="Phone"
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Links & Sections */}
          <motion.div className="space-y-8 lg:col-span-8" variants={item}>
            {/* Banner moved to the top of the right column on Desktop */}
            <div className="bg-card/40 relative h-32 w-full overflow-hidden rounded-4xl backdrop-blur-xl md:h-48">
              <Image
                src={profile.bannerUrl || "/images/placeholder.svg"}
                alt="Banner"
                fill
                className="object-cover"
              />
            </div>

            {/* Top Level Links */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topLevelLinks.map((link) => (
                <LinkCard key={link.id} link={link} accentColor={accentColor} />
              ))}
            </div>

            {/* Sections */}
            {(profile.MaguiConnectSection || [])
              .filter((s) => s.isActive)
              .map((section) => {
                const sectionLinks = (section.MaguiConnectLink || []).filter(
                  isLinkActive
                );
                if (sectionLinks.length === 0) return null;

                return (
                  <div key={section.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-black tracking-[0.2em] uppercase opacity-30">
                        {section.title}
                      </h2>
                      <div className="bg-foreground/5 h-px flex-1" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {sectionLinks.map((link) => (
                        <LinkCard
                          key={link.id}
                          link={link}
                          accentColor={accentColor}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Signature */}
            <footer className="pt-16 pb-12">
              <a
                href="https://magui.studio"
                target="_blank"
                className="group flex flex-col items-center gap-1 opacity-20 transition-all hover:opacity-100"
              >
                <span className="text-muted-foreground group-hover:text-foreground text-[9px] font-bold tracking-[0.6em] uppercase transition-colors">
                  Powered by
                </span>
                <div className="flex items-baseline">
                  <span className="text-xl font-black tracking-tighter">
                    MAGUI
                  </span>
                  <span className="text-xl font-medium tracking-tighter opacity-80">
                    .studio
                  </span>
                </div>
              </a>
            </footer>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function QuickAction({
  iconPath,
  href,
  label,
}: {
  iconPath: string;
  href: string;
  label: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -4, opacity: 0.6 }}
      whileTap={{ scale: 0.95 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-1 transition-all"
      title={label}
    >
      <Image
        src={iconPath}
        alt={label}
        width={28}
        height={28}
        className="object-contain"
      />
      <span className="text-[9px] font-bold tracking-tighter uppercase opacity-40">
        {label}
      </span>
    </motion.a>
  );
}

function LinkCard({
  link,
  accentColor,
}: {
  link: MaguiConnectLink;
  accentColor: string;
}) {
  return (
    <motion.a
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
      target={link.openInNewTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="bg-card/40 group hover:bg-card relative flex items-center gap-4 rounded-3xl p-4 backdrop-blur-md transition-all hover:shadow-2xl hover:shadow-black/[0.02]"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden">
        <Image
          src={getIconPath(link.kind, link.url)}
          alt={link.label}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <span className="text-lg leading-tight font-bold tracking-tight">
          {link.label}
        </span>
        <span className="text-muted-foreground/60 truncate text-xs font-medium">
          {link.url.replace(/^https?:\/\/(www\.)?/, "")}
        </span>
      </div>

      <div className="mr-2 flex h-8 w-8 items-center justify-center opacity-0 transition-all group-hover:opacity-100">
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-0.5"
        />
      </div>

      {link.isFeatured && (
        <div
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </motion.a>
  );
}
