"use client";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t.settings.label}
          className={cn("rounded-full", overHero && "hover:bg-white/10")}
        >
          <Globe className="size-5" />
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
