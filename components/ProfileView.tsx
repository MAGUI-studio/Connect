"use client";

import { motion } from "framer-motion";

type Profile = {
  displayName: string;
  headline: string | null;
  avatarUrl: string | null;
  themeAccent: string | null;
  themeBackground: string | null;
  themeForeground: string | null;
  MaguiConnectLink: Array<{
    id: string;
    label: string;
    url: string;
  }>;
};

export function ProfileView({ profile }: { profile: Profile }) {
  const bgColor = profile.themeBackground || "#0a0a0a";
  const fgColor = profile.themeForeground || "#ffffff";
  const accentColor = profile.themeAccent || "#3b82f6";

  return (
    <div
      className="flex min-h-screen w-full justify-center overflow-x-hidden font-sans antialiased selection:bg-white/20"
      style={{ backgroundColor: bgColor, color: fgColor }}
    >
      {/* Background Decor */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full blur-[120px]"
          style={{ backgroundColor: accentColor }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
          className="absolute -right-[10%] -bottom-[10%] h-[50%] w-[50%] rounded-full blur-[100px]"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <main className="relative z-10 flex w-full max-w-xl flex-col items-center p-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col items-center"
        >
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="absolute inset-0 rounded-full opacity-40 blur-2xl"
              style={{ backgroundColor: accentColor }}
            />
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="relative h-24 w-24 rounded-full border-2 border-white/20 object-cover shadow-2xl"
              />
            ) : (
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-3xl font-bold shadow-2xl backdrop-blur-xl">
                {profile.displayName.charAt(0)}
              </div>
            )}
          </div>

          <h1 className="mb-3 bg-gradient-to-b from-white to-white/70 bg-clip-text text-center text-3xl font-extrabold tracking-tight text-transparent">
            {profile.displayName}
          </h1>

          {profile.headline && (
            <p className="max-w-sm px-4 text-center text-base leading-relaxed font-medium opacity-80">
              {profile.headline}
            </p>
          )}
        </motion.div>

        <nav className="flex w-full flex-col gap-4">
          {profile.MaguiConnectLink.map((link, index) => (
            <motion.a
              key={link.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index + 0.3 }}
              href={`/api/click?linkId=${link.id}&url=${encodeURIComponent(link.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 p-5 text-center font-bold shadow-xl transition-all duration-300"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                style={{ backgroundColor: accentColor }}
              />

              {/* Animated Glow on Hover */}
              <div className="pointer-events-none absolute -inset-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                {link.label}
              </span>

              <div className="absolute right-6 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </nav>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 pb-8"
        >
          <a
            href="https://magui.io"
            target="_blank"
            className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase"
          >
            <span>Powered by</span>
            <span className="rounded bg-white px-2 py-1 text-black">MAGUI</span>
          </a>
        </motion.footer>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) skewX(-20deg);
          }
          100% {
            transform: translateX(150%) skewX(-20deg);
          }
        }
      `}</style>
    </div>
  );
}
