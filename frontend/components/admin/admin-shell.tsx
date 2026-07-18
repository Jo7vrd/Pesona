"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookA,
  ExternalLink,
  Landmark,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { adminApi, SESSION_COOKIE } from "@/lib/api/admin";
import type { AdminSession } from "@/lib/types";
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const menu = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Destinasi", href: "/admin/destinasi", icon: MapPin },
  { label: "Kuliner", href: "/admin/makanan", icon: UtensilsCrossed },
  { label: "Budaya", href: "/admin/budaya", icon: Landmark },
  { label: "Bahasa Kei", href: "/admin/bahasa", icon: BookA },
] as const;

const THEME_KEY = "kk_admin_theme";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu admin" className="flex-1 space-y-1 px-3">
      {menu.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            <item.icon className="size-4.5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    // Sesi dibaca setelah mount: localStorage tidak ada saat SSR dan
    // membacanya saat render memicu hydration mismatch
    setSession(adminApi.getSession());
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored) setDark(stored === "dark");
  }, []);

  useEffect(() => {
    // Kelas dark dipasang di <html> agar komponen portal (Sheet, Dialog,
    // AlertDialog, DropdownMenu) yang dirender ke <body> ikut bertema
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  function toggleTheme() {
    setDark((d) => {
      window.localStorage.setItem(THEME_KEY, d ? "light" : "dark");
      return !d;
    });
  }

  async function handleLogout() {
    await adminApi.logout();
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    toast.success("Anda telah keluar");
    router.replace("/admin/login");
  }

  const pageTitle =
    menu.find((m) => pathname.startsWith(m.href))?.label ?? "Admin";

  return (
    <div className={cn(dark && "dark")}>
      <div className="bg-background text-foreground flex min-h-svh">
        <aside className="bg-card sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r lg:flex">
          <div className="flex items-center gap-2 px-6 py-6">
            <Image
              src={dark ? "/logo/pesona-kei-putih.png" : "/logo/pesona-kei.png"}
              alt="Pesona Kei"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-muted-foreground text-xs font-normal tracking-wide">
              admin
            </span>
          </div>
          <NavLinks />
          <div className="border-t p-3">
            <Link
              href="/"
              target="_blank"
              className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
            >
              <ExternalLink className="size-4.5" aria-hidden />
              Lihat situs publik
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="bg-background/80 sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md md:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Buka menu admin">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className={cn("w-64 p-0", dark && "dark")}
              >
                <SheetTitle className="px-6 pt-6 pb-4">
                  <Image
                    src={
                      dark
                        ? "/logo/pesona-kei-putih.png"
                        : "/logo/pesona-kei.png"
                    }
                    alt="Pesona Kei"
                    width={100}
                    height={40}
                    className="h-8 w-auto"
                  />
                </SheetTitle>
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold">{pageTitle}</h1>

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={dark ? "Mode terang" : "Mode gelap"}
              >
                {dark ? (
                  <Sun className="size-4.5" />
                ) : (
                  <Moon className="size-4.5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <span className="bg-lagoon-600 flex size-7 items-center justify-center rounded-full text-xs font-semibold text-white">
                      {(session?.user.nama ?? "A").charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden text-sm sm:inline">
                      {session?.user.nama ?? "Admin"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={cn(dark && "dark")}>
                  <DropdownMenuLabel>
                    <p>{session?.user.nama ?? "Admin"}</p>
                    <p className="text-muted-foreground text-xs font-normal">
                      {session?.user.role === "super_admin"
                        ? "Super admin"
                        : "Admin"}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={handleLogout}
                  >
                    <LogOut className="size-4" aria-hidden />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
