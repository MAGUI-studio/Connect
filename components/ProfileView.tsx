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
  const titleFont = "var(--font-onest), sans-serif";

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
      <main className="w-full">
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Left Column: Profile Info */}
          <motion.div className="lg:col-span-4" variants={item}>
            <div className="sticky top-8 flex flex-col items-center p-8 text-center">
              <div className="group relative mb-10">
                {profile.avatarUrl ? (
                  <div className="relative h-44 w-44 overflow-hidden rounded-full shadow-2xl grayscale-[0.6] transition-all duration-700 group-hover:grayscale-0 md:h-56 md:w-56">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-44 w-44 items-center justify-center rounded-full text-5xl font-bold md:h-52 md:w-52">
                    {profile.displayName.charAt(0)}
                  </div>
                )}
                <div className="ring-background absolute right-4 bottom-4 h-6 w-6 rounded-full bg-emerald-500 shadow-lg ring-4" />
              </div>

              <h1
                className="text-6xl font-extrabold tracking-tighter md:text-8xl"
                style={{ fontFamily: titleFont }}
              >
                {profile.displayName}
              </h1>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {profile.professionalCategory && (
                  <span className="bg-primary/10 text-primary rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.1em] uppercase">
                    {profile.professionalCategory}
                  </span>
                )}
                {profile.companyName && (
                  <span className="bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.1em] uppercase">
                    {profile.companyName}
                  </span>
                )}
              </div>

              {profile.location && (
                <div className="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase opacity-60">
                  <MapPin size={14} /> {profile.location}
                </div>
              )}

              {profile.headline && (
                <p
                  className="mt-10 text-2xl leading-tight font-bold tracking-tight opacity-80"
                  style={{ fontFamily: titleFont }}
                >
                  {profile.headline}
                </p>
              )}

              {profile.bio && (
                <p className="text-muted-foreground mt-6 max-w-sm text-center text-sm leading-relaxed font-medium">
                  {profile.bio}
                </p>
              )}

              {/* Quick Actions */}
              <div className="mt-12 flex w-full max-w-xs flex-col gap-4">
                {profile.primaryCtaUrl && profile.primaryCtaLabel && (
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href={profile.primaryCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full py-5 text-sm font-black tracking-[0.2em] uppercase shadow-xl transition-all"
                    style={{ backgroundColor: accentColor, color: "white" }}
                  >
                    {profile.primaryCtaLabel}
                    <ExternalLink size={18} />
                  </motion.a>
                )}

                <div className="flex items-center justify-center gap-12 py-6">
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
          <motion.div
            className="space-y-16 lg:col-span-8 lg:pt-8"
            variants={item}
          >
            {/* Banner */}
            <div className="group relative h-48 w-full overflow-hidden rounded-3xl md:h-80">
              <Image
                src={profile.bannerUrl || "/images/placeholder.svg"}
                alt="Banner"
                fill
                className="object-cover grayscale-[0.4] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="from-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />

              <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
              </div>
            </div>

            {/* Top Level Links */}
            <div className="flex flex-col">
              {topLevelLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  accentColor={accentColor}
                  titleFont={titleFont}
                />
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
                  <div key={section.id} className="space-y-8 pt-8">
                    <div className="flex items-center gap-6">
                      <h2
                        className="text-xl font-bold tracking-tight opacity-30"
                        style={{ fontFamily: titleFont }}
                      >
                        {section.title}
                      </h2>
                      <div className="bg-foreground/5 h-px flex-1" />
                    </div>
                    <div className="flex flex-col">
                      {sectionLinks.map((link) => (
                        <LinkCard
                          key={link.id}
                          link={link}
                          accentColor={accentColor}
                          titleFont={titleFont}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Signature */}
            <footer className="flex justify-center pt-12 pb-8">
              <a
                href="https://magui.studio"
                target="_blank"
                className="flex w-fit flex-col items-center gap-1 opacity-30 transition-none"
              >
                <span className="text-muted-foreground text-[8px] font-black tracking-[0.8em] uppercase">
                  Powered by
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-black tracking-tighter">
                    MAGUI
                  </span>
                  <span className="text-2xl font-light tracking-tighter opacity-60">
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
      whileHover={{ y: -6, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-3 transition-all"
      title={label}
    >
      <div className="relative flex h-14 w-14 items-center justify-center transition-colors">
        <Image
          src={iconPath}
          alt={label}
          width={42}
          height={42}
          className="object-contain"
        />
      </div>
      <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
        {label}
      </span>
    </motion.a>
  );
}

function LinkCard({
  link,
  accentColor,
  titleFont,
}: {
  link: MaguiConnectLink;
  accentColor: string;
  titleFont: string;
}) {
  return (
    <motion.a
      whileHover={{ x: 10 }}
      whileTap={{ scale: 0.99 }}
      href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
      target={link.openInNewTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="group border-foreground/5 hover:bg-foreground/[0.02] relative -mx-4 flex items-center gap-6 rounded-xl border-b px-4 py-10 transition-all"
    >
      <div className="relative h-16 w-16 shrink-0">
        <Image
          src={getIconPath(link.kind, link.url)}
          alt={link.label}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <span
          className="text-3xl leading-none font-bold tracking-tight md:text-5xl"
          style={{ fontFamily: titleFont }}
        >
          {link.label}
        </span>
        <span className="text-muted-foreground mt-2 truncate text-xs font-black tracking-[0.2em] uppercase opacity-40">
          {link.url.replace(/^https?:\/\/(www\.)?/, "")}
        </span>
      </div>

      <div className="mr-4 flex h-12 w-12 items-center justify-center opacity-0 transition-all group-hover:translate-x-2 group-hover:opacity-100">
        <ArrowRight
          size={32}
          className="text-muted-foreground group-hover:text-foreground"
        />
      </div>

      {link.isFeatured && (
        <div
          className="absolute top-1/2 left-0 h-12 w-1 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 25px ${accentColor}`,
          }}
        />
      )}
    </motion.a>
  );
}
