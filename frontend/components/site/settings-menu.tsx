"use client";

import { useRef, type MouseEvent } from "react";
import { Check, Globe, Moon, Sun } from "lucide-react";

import { useLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { value: Locale; label: string }[] = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

export function SettingsMenu({ overHero }: { overHero?: boolean }) {
  const { locale, setLocale, dark, setDark, t } = useLocale();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Glow radial mengikuti kursor, mekanisme yang sama dengan GlowNavLink
  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="ghost"
          size="icon"
          aria-label={t.settings.label}
          onMouseMove={handleMouseMove}
          className={cn(
            "group relative isolate overflow-hidden rounded-full",
            overHero && "hover:bg-white/10"
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute size-24 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full opacity-0 transition-[scale,opacity] duration-400 ease-out group-hover:scale-100 group-hover:opacity-60"
            style={{
              left: "var(--gx, 50%)",
              top: "var(--gy, 50%)",
              background:
                "radial-gradient(circle, #35c2e8 10%, transparent 70%)",
              zIndex: -1,
            }}
          />
          <Globe className="relative size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{t.settings.bahasa}</DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onSelect={() => setLocale(lang.value)}
          >
            <span className="flex-1">{lang.label}</span>
            {locale === lang.value ? (
              <Check className="text-lagoon-600 size-4" aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t.settings.tampilan}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setDark(false)}>
          <Sun className="size-4" aria-hidden />
          <span className="flex-1">{t.settings.terang}</span>
          {!dark ? (
            <Check className="text-lagoon-600 size-4" aria-hidden />
          ) : null}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setDark(true)}>
          <Moon className="size-4" aria-hidden />
          <span className="flex-1">{t.settings.gelap}</span>
          {dark ? (
            <Check className="text-lagoon-600 size-4" aria-hidden />
          ) : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
