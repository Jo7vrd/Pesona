"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu } from "lucide-react";

import { navItems, siteConfig } from "@/lib/content/site";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { GlowNavLink } from "@/components/site/glow-nav-link";
import { SettingsMenu } from "@/components/site/settings-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoSpin, setLogoSpin] = useState(false);

  // Klik logo: bounce halus singkat, lalu muat ulang penuh ke beranda
  function handleLogoClick() {
    if (logoSpin) return;
    setLogoSpin(true);
    window.setTimeout(() => window.location.assign("/"), 360);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Landing dan halaman daftar dibuka dengan seksi gelap; halaman detail
  // (/makanan/[id], /budaya/[id]) dibuka dengan kanvas terang
  const hasDarkTop = navItems.some((item) => item.href === pathname);
  const overHero = hasDarkTop && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero
          ? "bg-transparent text-white"
          : "bg-background/90 text-foreground border-b backdrop-blur-sm"
      )}
    >
      <div className="container-page flex h-20 items-center justify-between md:h-24">
        <motion.button
          type="button"
          onClick={handleLogoClick}
          aria-label={`${siteConfig.name} — segarkan dan kembali ke beranda`}
          whileTap={{ scale: 0.95 }}
          animate={logoSpin ? { scale: [1, 0.94, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 0.32, ease: [0.34, 1.3, 0.64, 1] }}
          className="cursor-pointer"
        >
          <Image
            src={overHero ? "/logo/pesona-kei-putih.png" : "/logo/pesona-kei.png"}
            alt="Pesona Kei"
            width={160}
            height={64}
            priority
            className="h-10 w-auto lg:h-12 xl:h-14"
          />
        </motion.button>

        <div className="flex items-center gap-1 md:gap-2">
          <nav aria-label="Navigasi utama" className="hidden md:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <GlowNavLink
                      href={item.href}
                      active={active}
                      overHero={overHero}
                      className={cn(
                        "block px-2.5 py-2 text-sm font-semibold lg:px-4 xl:text-[15px]",
                        active && (overHero ? "bg-white/15" : "bg-secondary")
                      )}
                    >
                      {t.nav[item.href] ?? item.label}
                    </GlowNavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <SettingsMenu overHero={overHero} />

          <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(overHero && "hover:bg-white/10")}
              aria-label="Buka menu navigasi"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-background/95 w-80 rounded-l-3xl border-l-0 shadow-2xl backdrop-blur-xl"
          >
            <SheetTitle className="px-6 pt-8">
              <Image
                src="/logo/pesona-kei.png"
                alt="Pesona Kei"
                width={140}
                height={56}
                className="h-10 w-auto"
              />
            </SheetTitle>
            <nav aria-label="Navigasi utama (mobile)" className="mt-4 px-4">
              <ul className="space-y-1.5">
                {navItems.map((item, i) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + i * 0.055,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-5 py-3.5 text-base font-semibold transition-all",
                          active
                            ? "bg-brand-gradient text-white shadow-md"
                            : "hover:bg-secondary hover:translate-x-1"
                        )}
                      >
                        {t.nav[item.href] ?? item.label}
                        <ArrowUpRight
                          className={cn(
                            "size-4",
                            active
                              ? "text-lagoon-300"
                              : "text-muted-foreground"
                          )}
                          aria-hidden
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            <p className="text-muted-foreground mt-auto px-6 pb-8 text-xs">
              Tim KKN Jelajah Kei Kecil 2026
            </p>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
