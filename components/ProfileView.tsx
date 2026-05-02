"use client";

import { motion, type Variants } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Twitter,
  Mail,
  Phone,
  ShoppingBag,
  Briefcase,
  Globe,
  MessageCircle,
  ExternalLink,
  MapPin,
  Building2,
} from "lucide-react";

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
  }>;
};

const getIcon = (kind: string, _iconName: string | null) => {
  switch (kind.toUpperCase()) {
    case "INSTAGRAM":
      return <Instagram size={20} />;
    case "LINKEDIN":
      return <Linkedin size={20} />;
    case "GITHUB":
      return <Github size={20} />;
    case "YOUTUBE":
      return <Youtube size={20} />;
    case "TWITTER":
      return <Twitter size={20} />;
    case "EMAIL":
      return <Mail size={20} />;
    case "PHONE":
      return <Phone size={20} />;
    case "SHOP":
      return <ShoppingBag size={20} />;
    case "PORTFOLIO":
      return <Briefcase size={20} />;
    case "WHATSAPP":
      return <MessageCircle size={20} />;
    case "GLOBE":
      return <Globe size={20} />;
    default:
      return <ExternalLink size={18} />;
  }
};

export function ProfileView({ profile }: { profile: Profile }) {
  const bgColor = profile.themeBackground || "#0a0a0a";
  const fgColor = profile.themeForeground || "#ffffff";
  const accentColor = profile.themeAccent || "#3b82f6";

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className="flex min-h-screen w-full justify-center font-sans antialiased selection:bg-white/10"
      style={{ backgroundColor: bgColor, color: fgColor }}
    >
      <main className="flex w-full max-w-[480px] flex-col items-center px-6 py-16">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex w-full flex-col items-center text-center"
        >
          <div className="relative mb-6">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="h-24 w-24 rounded-full object-cover shadow-sm ring-1 ring-white/10"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-medium shadow-sm ring-1 ring-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                {profile.displayName.charAt(0)}
              </div>
            )}
          </div>

          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-white">
            {profile.displayName}
          </h1>

          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-sm font-medium opacity-60">
            {profile.professionalCategory && (
              <span>{profile.professionalCategory}</span>
            )}
            {profile.professionalCategory && profile.companyName && (
              <span className="text-[10px]">•</span>
            )}
            {profile.companyName && (
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {profile.companyName}
              </span>
            )}
          </div>

          {profile.location && (
            <div className="mb-4 flex items-center gap-1 text-xs font-bold tracking-widest uppercase opacity-40">
              <MapPin size={10} />
              {profile.location}
            </div>
          )}

          {profile.headline && (
            <p className="mb-4 max-w-[90%] text-base leading-relaxed font-medium opacity-70">
              {profile.headline}
            </p>
          )}

          {profile.bio && (
            <p className="max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap opacity-50">
              {profile.bio}
            </p>
          )}
        </motion.div>

        {/* Primary CTA */}
        {profile.primaryCtaUrl && profile.primaryCtaLabel && (
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            href={profile.primaryCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 w-full rounded-full px-6 py-4 text-center text-sm font-bold tracking-wide shadow-lg shadow-black/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: accentColor,
              color: "#ffffff",
            }}
          >
            {profile.primaryCtaLabel}
          </motion.a>
        )}

        {/* Links Grid */}
        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col gap-3"
        >
          {profile.MaguiConnectLink.map((link) => (
            <motion.a
              key={link.id}
              variants={item}
              href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex w-full items-center rounded-xl border border-white/5 p-4 transition-all duration-300 hover:bg-white/5 active:scale-[0.99] ${
                link.isFeatured ? "ring-1" : ""
              }`}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                borderColor: link.isFeatured
                  ? accentColor
                  : "rgba(255,255,255,0.05)",
              }}
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-white/10">
                {getIcon(link.kind, link.icon)}
              </div>

              <span className="flex-1 text-sm font-medium tracking-tight text-white/90">
                {link.label}
              </span>

              <div className="opacity-0 transition-opacity group-hover:opacity-30">
                <ExternalLink size={14} />
              </div>

              {link.isFeatured && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: `inset 0 0 10px ${accentColor}10`,
                  }}
                />
              )}
            </motion.a>
          ))}
        </motion.nav>

        {/* Social Bar (Quick Contact) */}
        {(profile.whatsapp || profile.publicEmail || profile.publicPhone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 mb-4 flex items-center gap-6"
          >
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                className="opacity-40 transition-opacity hover:opacity-100"
              >
                <MessageCircle size={24} />
              </a>
            )}
            {profile.publicEmail && (
              <a
                href={`mailto:${profile.publicEmail}`}
                className="opacity-40 transition-opacity hover:opacity-100"
              >
                <Mail size={24} />
              </a>
            )}
            {profile.publicPhone && (
              <a
                href={`tel:${profile.publicPhone}`}
                className="opacity-40 transition-opacity hover:opacity-100"
              >
                <Phone size={24} />
              </a>
            )}
          </motion.div>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          whileHover={{ opacity: 0.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <a
            href="https://magui.io"
            target="_blank"
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            <span>Powered by</span>
            <span className="rounded border border-current px-1.5 py-0.5 text-[8px]">
              MAGUI
            </span>
          </a>
        </motion.footer>
      </main>
    </div>
  );
}
