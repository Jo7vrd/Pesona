"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

/**
 * Penampil peta karang yang bisa digeser & di-zoom. Pada zoom 1x seluruh
 * gambar tampil utuh (object-contain, tidak ter-crop); saat diperbesar,
 * pengguna bisa menyeret untuk menjelajah detail.
 */
export function ReefMapViewer({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null
  );

  const clamp = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  function zoom(delta: number) {
    setScale((s) => {
      const next = clamp(Math.round((s + delta) * 10) / 10);
      if (next === 1) setPos({ x: 0, y: 0 });
      return next;
    });
  }

  function reset() {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    setPos({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (drag.current) e.currentTarget.releasePointerCapture(e.pointerId);
    drag.current = null;
    setDragging(false);
  }

  function onWheel(e: WheelEvent<HTMLDivElement>) {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
    zoom(e.deltaY < 0 ? 0.3 : -0.3);
  }

  const canPan = scale > 1;

  return (
    <div className="bg-ocean-950 relative overflow-hidden rounded-(--radius-card) border shadow-(--shadow-card)">
      <div
        className="relative aspect-[16/10] touch-none overflow-hidden select-none md:aspect-[16/9]"
        style={{ cursor: canPan ? (dragging ? "grabbing" : "grab") : "default" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 0.2s ease-out",
          }}
        />
      </div>

      {/* Kontrol zoom */}
      <div className="absolute right-3 bottom-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoom(0.5)}
          disabled={scale >= MAX_SCALE}
          aria-label="Perbesar peta"
          className="bg-background/90 text-foreground hover:bg-background flex size-9 items-center justify-center rounded-lg border shadow-sm transition-colors disabled:opacity-40"
        >
          <Plus className="size-4.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => zoom(-0.5)}
          disabled={scale <= MIN_SCALE}
          aria-label="Perkecil peta"
          className="bg-background/90 text-foreground hover:bg-background flex size-9 items-center justify-center rounded-lg border shadow-sm transition-colors disabled:opacity-40"
        >
          <Minus className="size-4.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={scale === 1 && pos.x === 0 && pos.y === 0}
          aria-label="Atur ulang tampilan peta"
          className="bg-background/90 text-foreground hover:bg-background flex size-9 items-center justify-center rounded-lg border shadow-sm transition-colors disabled:opacity-40"
        >
          <RotateCcw className="size-4" aria-hidden />
        </button>
      </div>

      {/* Petunjuk */}
      <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
        Seret untuk menggeser · zoom dengan tombol
      </div>
    </div>
  );
}
