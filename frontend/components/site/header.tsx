"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { navItems, siteConfig } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          : "bg-background/80 text-foreground border-b backdrop-blur-md"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label={`${siteConfig.name} — beranda`}>
          <Image
            src={overHero ? "/logo/pesona-kei-putih.png" : "/logo/pesona-kei.png"}
            alt="Pesona Kei"
            width={125}
            height={50}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? overHero
                          ? "bg-white/15"
                          : "bg-secondary"
                        : overHero
                          ? "hover:bg-white/10"
                          : "hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(overHero && "hover:bg-white/10")}
              aria-label="Buka menu navigasi"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="px-4 pt-4">
              <Image
                src="/logo/pesona-kei.png"
                alt="Pesona Kei"
                width={113}
                height={45}
                className="h-8 w-auto"
              />
            </SheetTitle>
            <nav aria-label="Navigasi utama (mobile)" className="mt-2 px-2">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="hover:bg-secondary block rounded-lg px-4 py-3 text-base font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
