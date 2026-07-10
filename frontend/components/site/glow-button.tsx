"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const baseClass =
  "group focus-visible:ring-ring relative isolate inline-block cursor-pointer overflow-hidden rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition-transform duration-300 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95";

const gradientStyle = {
  backgroundImage: "linear-gradient(135deg, #f4784a, #d46634)",
} as const;

function Glow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute size-48 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full opacity-0 transition-[scale,opacity] duration-400 ease-out group-hover:scale-100 group-hover:opacity-70"
      style={{
        left: "var(--gx, 50%)",
        top: "var(--gy, 50%)",
        background:
          "radial-gradient(circle, #ffd9b0 5%, rgba(255,178,120,0.55) 35%, transparent 70%)",
        zIndex: -1,
      }}
    />
  );
}

/**
 * Tombol/tautan CTA dengan glow radial mengikuti kursor di atas gradien
 * oranye brand. Beri `href` untuk navigasi, atau `onClick` untuk aksi.
 */
export function GlowButton({
  children,
  onClick,
  href,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  }

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        className={cn(baseClass, className)}
        style={gradientStyle}
      >
        <Glow />
        <span className="relative">{children}</span>
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={cn(baseClass, className)}
      style={gradientStyle}
    >
      <Glow />
      <span className="relative">{children}</span>
    </button>
  );
}
