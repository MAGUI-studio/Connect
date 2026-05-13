"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Envelope,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { ScrollArea } from "../src/components/ui/scroll-area";
import { ThemeToggle } from "./common/themeToggle";

type MaguiConnectLink = {
  id: string;
  label: string;
  url: string;
  customShortDescription: string | null;
  kind: string | null;
  startsAt: string | Date | null;
  expiresAt: string | Date | null;
  isFeatured: boolean;
  isActive: boolean;
  openInNewTab: boolean;
  sectionId: string | null;
};

type MaguiConnectSection = {
  id: string;
  title: string;
  description: string | null;
  isCollapsible: boolean;
  isActive: boolean;
  MaguiConnectLink: MaguiConnectLink[];
};

type Profile = {
  id: string;
  displayName: string;
  heroKicker: string | null;
  heroHeadline: string | null;
  heroDescription: string | null;
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
  secondaryCtaLabel: string | null;
  secondaryCtaUrl: string | null;
  themeAccent: string | null;
  slug: string | null;
  MaguiConnectLink: MaguiConnectLink[];
  MaguiConnectSection: MaguiConnectSection[];
};

const getIconPath = (kind: string, url: string = "") => {
  const normalizedKind = kind.toUpperCase();
  const lowerUrl = url.toLowerCase();

  if (normalizedKind === "EMAIL" || lowerUrl.startsWith("mailto:")) {
    if (lowerUrl.includes("@gmail.com") || lowerUrl.includes("gmail.com")) {
      return "/icons/Gmail.svg";
    }
    if (
      lowerUrl.includes("@outlook.com") ||
      lowerUrl.includes("@hotmail.com") ||
      lowerUrl.includes("@live.com") ||
      lowerUrl.includes("@msn.com") ||
      lowerUrl.includes("outlook.com") ||
      lowerUrl.includes("hotmail.com") ||
      lowerUrl.includes("live.com") ||
      lowerUrl.includes("msn.com")
    ) {
      return "/icons/Outlook.svg";
    }

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
    GITHUB: "Github",
    IFOOD: "iFood",
    MAGUISTUDIO: "MAGUIstudio",
    USUARIO: "Usuario",
  };

  const iconName = iconMap[normalizedKind];
  return iconName ? `/icons/${iconName}.svg` : "/icons/Link.svg";
};

const inferLinkKind = (url: string) => {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("instagram.com")) return "INSTAGRAM";
  if (lowerUrl.includes("linkedin.com")) return "LINKEDIN";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
    return "YOUTUBE";
  }
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    return "X";
  if (lowerUrl.includes("tiktok.com")) return "TIKTOK";
  if (lowerUrl.includes("threads.net")) return "THREADS";
  if (lowerUrl.includes("twitch.tv")) return "TWITCH";
  if (lowerUrl.includes("discord.gg") || lowerUrl.includes("discord.com")) {
    return "DISCORD";
  }
  if (lowerUrl.includes("wa.me") || lowerUrl.includes("whatsapp")) {
    return "WHATSAPP";
  }
  if (lowerUrl.includes("spotify.com")) return "SPOTIFY";
  if (lowerUrl.includes("telegram.me") || lowerUrl.includes("t.me")) {
    return "TELEGRAM";
  }
  if (lowerUrl.includes("behance.net")) return "BEHANCE";
  if (lowerUrl.includes("dribbble.com")) return "DRIBBBLE";
  if (lowerUrl.includes("pinterest.com")) return "PINTEREST";
  if (lowerUrl.includes("vimeo.com")) return "VIMEO";
  if (lowerUrl.includes("medium.com")) return "MEDIUM";
  if (lowerUrl.includes("artstation.com")) return "ARTSTATION";
  if (lowerUrl.includes("github.com")) return "GITHUB";
  if (lowerUrl.includes("ifood.com.br")) return "IFOOD";
  if (lowerUrl.includes("magui.studio")) return "MAGUISTUDIO";
  if (lowerUrl.includes("amazon.com") || lowerUrl.includes("amzn.to"))
    return "AMAZON";
  if (lowerUrl.includes("aliexpress.com")) return "ALIEXPRESS";
  if (lowerUrl.includes("shopee.com.br")) return "SHOPEE";
  if (lowerUrl.includes("mercadolivre.com.br")) return "MERCADOLIVRE";
  if (lowerUrl.includes("hotmart.com")) return "HOTMART";
  if (lowerUrl.includes("kiwify.com.br")) return "KIWIFY";
  if (lowerUrl.includes("eduzz.com")) return "EDUZZ";
  if (
    lowerUrl.includes("maps.google.com") ||
    lowerUrl.includes("goo.gl/maps")
  ) {
    return "MAPS";
  }
  if (lowerUrl.includes("drive.google.com")) return "DRIVE";
  if (lowerUrl.includes("music.apple.com")) return "APPLEMUSIC";
  if (lowerUrl.startsWith("mailto:")) return "EMAIL";

  return "LINK";
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export function ProfileView({ profile }: { profile: Profile }) {
  const accentColor = profile.themeAccent || "var(--foreground)";
  const fontStyle = "var(--font-montserrat), ui-sans-serif, system-ui";
  const titleFont = "var(--font-onest), sans-serif";
  const reduceMotion = useReducedMotion();

  const topLevelLinks = useMemo(() => {
    return (profile.MaguiConnectLink || [])
      .filter((l) => !l.sectionId && l.isActive)
      .filter(isLinkVisible);
  }, [profile.MaguiConnectLink]);

  const activeSections = useMemo(() => {
    return (profile.MaguiConnectSection || [])
      .filter((section) => section.isActive)
      .filter((section) => {
        const sectionLinks = (section.MaguiConnectLink || [])
          .filter((link) => link.isActive)
          .filter(isLinkVisible);
        return sectionLinks.length > 0;
      });
  }, [profile.MaguiConnectSection]);

  const isNewProfile = useMemo(() => {
    const hasLinks = topLevelLinks.length > 0 || activeSections.length > 0;
    const hasBio = !!(
      profile.bio ||
      profile.headline ||
      profile.heroHeadline ||
      profile.heroDescription
    );
    const hasContact = !!(
      profile.whatsapp ||
      profile.publicEmail ||
      profile.publicPhone
    );
    const hasCTA = !!(profile.primaryCtaUrl || profile.secondaryCtaUrl);
    const hasMedia = !!(profile.avatarUrl || profile.bannerUrl);

    return !hasLinks && !hasBio && !hasContact && !hasCTA && !hasMedia;
  }, [profile, topLevelLinks, activeSections]);

  if (isNewProfile) {
    return (
      <EmptyState
        profile={profile}
        titleFont={titleFont}
        accentColor={accentColor}
      />
    );
  }

  const whatsappUrl = profile.whatsapp
    ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}${profile.whatsappMessage ? `?text=${encodeURIComponent(profile.whatsappMessage)}` : ""}`
    : null;

  return (
    <div
      className="bg-background text-foreground relative min-h-screen w-full overflow-x-hidden 2xl:h-screen 2xl:overflow-hidden"
      style={{ fontFamily: fontStyle }}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={reduceMotion ? undefined : { opacity: [0.14, 0.22, 0.14] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 9, ease: "easeInOut", repeat: Infinity }
          }
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, color-mix(in oklab, var(--background) 70%, transparent), transparent 28%)",
          }}
        />
      </div>

      <main className="relative z-10 w-full px-4 py-4 md:px-8 md:py-8 lg:h-full lg:px-12 lg:py-6">
        <motion.div
          className="grid grid-cols-1 gap-8 2xl:h-full 2xl:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.35fr)] 2xl:gap-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <div className="p-2 md:p-4 2xl:h-full 2xl:overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="w-full space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 md:gap-5">
                      {profile.avatarUrl ? (
                        <motion.div
                          whileHover={
                            reduceMotion ? undefined : { scale: 1.02, y: -2 }
                          }
                          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.8rem] md:h-28 md:w-28"
                        >
                          <Image
                            src={profile.avatarUrl}
                            alt={profile.displayName}
                            fill
                            sizes="(max-width: 768px) 96px, 112px"
                            className="object-cover"
                            priority
                            unoptimized
                          />
                        </motion.div>
                      ) : (
                        <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.8rem] text-3xl font-semibold md:h-28 md:w-28">
                          {profile.displayName.charAt(0)}
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <h1
                          className="text-2xl font-bold tracking-[-0.05em] md:text-3xl"
                          style={{ fontFamily: titleFont }}
                        >
                          {profile.displayName}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {profile.professionalCategory && (
                            <span className="text-muted-foreground text-[10px] font-bold tracking-[0.12em] uppercase opacity-70">
                              {profile.professionalCategory}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <h2
                        className="text-4xl leading-[0.9] font-semibold tracking-[-0.08em] text-balance md:text-5xl lg:text-[4.5rem]"
                        style={{ fontFamily: titleFont }}
                      >
                        {profile.headline || profile.displayName}
                      </h2>
                      {profile.bio && (
                        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {profile.companyName && (
                      <span className="bg-foreground/[0.05] text-muted-foreground rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase">
                        {profile.companyName}
                      </span>
                    )}
                    {profile.location && (
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium opacity-60">
                        <MapPin size={13} />
                        {profile.location}
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-3">
                    {profile.primaryCtaUrl && profile.primaryCtaLabel && (
                      <motion.a
                        whileHover={
                          reduceMotion ? undefined : { y: -2, scale: 1.01 }
                        }
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        href={profile.primaryCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {profile.primaryCtaLabel}
                        <ArrowUpRight size={16} />
                      </motion.a>
                    )}

                    {profile.secondaryCtaUrl && profile.secondaryCtaLabel && (
                      <motion.a
                        whileHover={
                          reduceMotion ? undefined : { y: -2, scale: 1.01 }
                        }
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        href={profile.secondaryCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-foreground/[0.05] inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium"
                      >
                        {profile.secondaryCtaLabel}
                        <ArrowRight size={16} />
                      </motion.a>
                    )}
                  </div>

                  <div className="grid w-full grid-cols-2 gap-3">
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
                        fallbackIcon={<Envelope size={18} />}
                      />
                    )}
                    {profile.publicPhone && (
                      <QuickAction
                        iconPath="/icons/Link.svg"
                        href={`tel:${profile.publicPhone}`}
                        label="Phone"
                        fallbackIcon={<Phone size={18} />}
                      />
                    )}
                  </div>

                  <motion.a
                    variants={item}
                    href="https://magui.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-12 flex w-fit items-center gap-3.5 opacity-30 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0"
                  >
                    <span className="text-muted-foreground text-[10px] font-medium tracking-[0.2em] uppercase">
                      Oferecido por
                    </span>
                    <div className="bg-muted-foreground/30 group-hover:bg-foreground/20 h-3 w-px transition-colors" />
                    <div className="relative h-3.5 w-20">
                      <Image
                        src="/logos/LOGO_MAGUI_DM.svg"
                        alt="MAGUI.studio"
                        fill
                        sizes="80px"
                        className="object-contain dark:hidden"
                      />
                      <Image
                        src="/logos/LOGO_MAGUI_LM.svg"
                        alt="MAGUI.studio"
                        fill
                        sizes="80px"
                        className="hidden object-contain dark:block"
                      />
                    </div>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="relative lg:h-full" variants={item}>
            <ScrollArea className="h-full w-full pb-5 2xl:h-screen 2xl:pr-5">
              <div className="space-y-6 pb-6 lg:pr-4">
                <div className="relative h-56 overflow-hidden rounded-[2rem] md:h-[24rem]">
                  <Image
                    src={profile.bannerUrl || "/images/placeholder.svg"}
                    alt="Banner"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 60vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.52)_36%,rgba(0,0,0,0.14)_68%,transparent_100%)]" />
                  <div className="absolute top-5 right-5 z-20">
                    <ThemeToggle />
                  </div>
                  {(profile.heroKicker ||
                    profile.heroHeadline ||
                    profile.heroDescription) && (
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <div className="space-y-2 md:space-y-3">
                        {profile.heroKicker && (
                          <div className="text-[11px] font-medium tracking-[0.24em] text-white uppercase">
                            {profile.heroKicker}
                          </div>
                        )}
                        {profile.heroHeadline && (
                          <div
                            className="text-2xl font-semibold tracking-[-0.05em] text-white md:text-[2.8rem]"
                            style={{ fontFamily: titleFont }}
                          >
                            {profile.heroHeadline}
                          </div>
                        )}
                        {profile.heroDescription && (
                          <p className="text-sm leading-relaxed text-white md:text-base">
                            {profile.heroDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {topLevelLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      titleFont={titleFont}
                      accentColor={accentColor}
                    />
                  ))}
                </div>

                {(profile.MaguiConnectSection || [])
                  .filter((section) => section.isActive)
                  .map((section) => {
                    const sectionLinks = (section.MaguiConnectLink || [])
                      .filter((link) => link.isActive)
                      .filter(isLinkVisible);

                    if (sectionLinks.length === 0) return null;

                    return (
                      <section key={section.id} className="space-y-4 pt-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <h3
                              className="text-lg font-semibold tracking-[-0.04em]"
                              style={{ fontFamily: titleFont }}
                            >
                              {section.title}
                            </h3>
                            <div className="bg-foreground/8 h-px flex-1" />
                          </div>
                          {section.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {section.description}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          {sectionLinks.map((link) => (
                            <LinkCard
                              key={link.id}
                              link={link}
                              titleFont={titleFont}
                              accentColor={accentColor}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
              </div>
            </ScrollArea>
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
  fallbackIcon,
}: {
  iconPath: string;
  href: string;
  label: string;
  fallbackIcon?: ReactNode;
}) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-foreground/[0.03] hover:bg-foreground/[0.05] flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-left transition-colors"
      title={label}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center">
        {iconPath ? (
          <Image
            src={iconPath}
            alt={label}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : fallbackIcon ? (
          <span className="text-foreground/80">{fallbackIcon}</span>
        ) : null}
      </div>
      <div className="min-w-0">
        <span className="text-sm font-medium tracking-[-0.02em]">{label}</span>
      </div>
    </motion.a>
  );
}

function LinkCard({
  link,
  titleFont,
  accentColor,
}: {
  link: MaguiConnectLink;
  titleFont: string;
  accentColor: string;
}) {
  const description =
    link.customShortDescription || link.url.replace(/^https?:\/\/(www\.)?/, "");
  const countdownLabel = useCountdownLabel(link.expiresAt);

  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
      target={link.openInNewTab ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`group relative flex items-center gap-4 rounded-[1.75rem] px-4 py-4 transition-all md:px-5 md:py-5 ${
        link.isFeatured
          ? "text-white"
          : "hover:bg-foreground/[0.04] bg-transparent"
      }`}
      style={
        link.isFeatured
          ? {
              backgroundColor: accentColor,
            }
          : undefined
      }
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center md:h-20 md:w-20">
        <Image
          src={getIconPath(link.kind || inferLinkKind(link.url), link.url)}
          alt={link.label}
          fill
          sizes="80px"
          className="object-contain p-3"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xl font-semibold tracking-[-0.05em] md:text-2xl"
            style={{ fontFamily: titleFont }}
          >
            {link.label}
          </span>
        </div>

        <p
          className={`mt-1 text-sm ${
            link.isFeatured ? "text-foreground/70" : "text-muted-foreground"
          }`}
          style={
            link.isFeatured ? { color: "rgba(255,255,255,0.78)" } : undefined
          }
        >
          {description}
        </p>
        {countdownLabel && (
          <p className={`mt-1 text-xs text-red-500!`}>{countdownLabel}</p>
        )}
      </div>

      <div
        className={`mr-2 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 ${
          link.isFeatured ? "text-white/85" : "text-muted-foreground"
        }`}
      >
        <ArrowRight size={22} weight="bold" />
      </div>
    </motion.a>
  );
}

function isLinkVisible(link: MaguiConnectLink) {
  const now = new Date();
  const startsAt = link.startsAt ? new Date(link.startsAt) : null;
  const expiresAt = link.expiresAt ? new Date(link.expiresAt) : null;

  if (startsAt && startsAt > now) return false;
  if (expiresAt && expiresAt <= now) return false;

  return true;
}

function useCountdownLabel(expiresAtValue: string | Date | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAtValue) return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAtValue]);

  if (!expiresAtValue) return null;

  const expiresAt = new Date(expiresAtValue).getTime();
  const diff = expiresAt - now;

  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `Encerra em ${hours} horas, ${minutes} minutos e ${seconds} segundos.`;
}

function EmptyState({
  profile,
  titleFont,
  accentColor,
}: {
  profile: Profile;
  titleFont: string;
  accentColor: string;
}) {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        <div className="mb-12 flex flex-col items-center gap-6">
          <div
            className="h-px w-12"
            style={{
              backgroundColor: `color-mix(in srgb, ${accentColor} 20%, currentColor)`,
            }}
          />
          <span className="text-muted-foreground text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
            Em Breve
          </span>
          <div
            className="h-px w-12"
            style={{
              backgroundColor: `color-mix(in srgb, ${accentColor} 20%, currentColor)`,
            }}
          />
        </div>

        <h1
          className="mb-6 text-4xl font-bold tracking-tight md:text-5xl"
          style={{ fontFamily: titleFont }}
        >
          {profile.displayName}
        </h1>

        <p className="text-muted-foreground mx-auto mb-16 max-w-sm text-sm leading-relaxed opacity-80">
          Estamos preparando algo especial. Em breve, todos os links e novidades
          estarão disponíveis aqui.
        </p>

        <div className="flex flex-col items-center gap-8">
          <motion.a
            whileHover={{ opacity: 1 }}
            href="https://magui.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 opacity-40 grayscale transition-all duration-500 hover:grayscale-0"
          >
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase">
              Desenvolvido por
            </span>
            <div className="relative h-4 w-24">
              <Image
                src="/logos/LOGO_MAGUI_DM.svg"
                alt="MAGUI.studio"
                fill
                className="object-contain dark:hidden"
              />
              <Image
                src="/logos/LOGO_MAGUI_LM.svg"
                alt="MAGUI.studio"
                fill
                className="hidden object-contain dark:block"
              />
            </div>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
