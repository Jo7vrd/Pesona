"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Link nav dengan glow radial yang mengikuti posisi kursor di dalam
 * pill (warna cyan logo Pesona). Posisi dilacak lewat CSS variable —
 * tanpa state React, jadi bebas re-render saat mouse bergerak.
 */
export function GlowNavLink({
  href,
  active,
  overHero,
  className,
  children,
}: {
  href: string;
  active?: boolean;
  overHero?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative isolate overflow-hidden rounded-full",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute size-40 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full opacity-0 transition-[scale,opacity] duration-400 ease-out group-hover:scale-100 group-hover:opacity-60"
        style={{
          left: "var(--gx, 50%)",
          top: "var(--gy, 50%)",
          background:
            "radial-gradient(circle, #35c2e8 10%, transparent 70%)",
          zIndex: -1,
        }}
      />
      <span
        className={cn(
          "relative transition-colors duration-300",
          overHero
            ? "group-hover:text-white"
            : "group-hover:text-ocean-700"
        )}
      >
        {children}
      </span>
    </Link>
  );
}
