"use client";

import * as React from "react";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useThemeTransition } from "@/lib/hooks/useThemeTransition";
import { cn } from "@/lib/utils";

export function ThemeToggle(): React.JSX.Element {
  const { resolvedTheme, toggleTheme } = useThemeTransition();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="border-border/50 bg-muted/20 h-9 w-18 animate-pulse rounded-full border" />
    );
  }

  const isLight = resolvedTheme === "light";

  return (
    <div className="group border-border/60 bg-background/50 hover:border-border hover:bg-muted/50 relative flex h-9 w-18 items-center rounded-full border p-1 backdrop-blur-sm transition-all">
      <motion.div
        className="bg-muted absolute z-0 h-7 w-7 rounded-full shadow-sm"
        initial={false}
        animate={{
          x: isLight ? 0 : 34,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />

      <button
        onClick={() => (isLight ? null : toggleTheme())}
        className={cn(
          "relative z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-200",
          isLight
            ? "text-foreground"
            : "text-muted-foreground/50 hover:text-muted-foreground"
        )}
        title={"Alternar para modo claro"}
      >
        <SunIcon
          weight="duotone"
          size={14}
          className="transition-transform duration-300"
        />
      </button>

      <button
        onClick={() => (!isLight ? null : toggleTheme())}
        className={cn(
          "relative z-10 ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-200",
          !isLight
            ? "text-foreground"
            : "text-muted-foreground/50 hover:text-muted-foreground"
        )}
        title={"Alternar para modo escuro"}
      >
        <MoonIcon
          weight="duotone"
          size={14}
          className="transition-transform duration-300"
        />
      </button>
    </div>
  );
}
