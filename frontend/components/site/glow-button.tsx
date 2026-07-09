"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Tombol CTA dengan glow radial yang mengikuti kursor di atas latar
 * gradien oranye brand. Posisi glow dilacak lewat CSS variable agar
 * tidak memicu re-render React saat mouse bergerak.
 */
export function GlowButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={cn(
        "group focus-visible:ring-ring relative isolate cursor-pointer overflow-hidden rounded-full px-8 py-3.5 text-base font-bold text-white shadow-lg transition-transform duration-300 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95",
        className
      )}
      style={{ backgroundImage: "linear-gradient(135deg, #f4784a, #d46634)" }}
    >
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
      <span className="relative">{children}</span>
    </button>
  );
}
