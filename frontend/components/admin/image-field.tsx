"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Move, RotateCcw, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";

import { uploadImage } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

/**
 * Field foto: unggah file (JPG/PNG/WebP, maks 10MB — §8.4) + editor
 * pembingkaian ala Instagram. Non-destruktif: foto asli tak diubah;
 * yang disimpan hanya cara menampilkannya —
 *   - `position`  : CSS object-position ("x% y%"), digeser dengan drag
 *   - `zoom`      : skala (1–3), diperbesar dengan slider/scroll/cubit
 * Nilai ini diterapkan sama persis di kartu/hero/detail publik, sehingga
 * satu foto pas di semua rasio tanpa dipotong permanen.
 */
const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_POSITION = "50% 50%";
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

function parsePosition(value?: string): { x: number; y: number } {
  const [x, y] = (value || DEFAULT_POSITION)
    .split(" ")
    .map((p) => Number.parseFloat(p));
  return { x: Number.isFinite(x) ? x : 50, y: Number.isFinite(y) ? y : 50 };
}

const clampPct = (n: number) => Math.min(100, Math.max(0, n));
const clampZoom = (n: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number.isFinite(n) ? n : 1));
const round1 = (n: number) => Math.round(n * 10) / 10;

export function ImageField({
  value,
  onChange,
  error,
  modul = "umum",
  position,
  onPositionChange,
  zoom,
  onZoomChange,
  aspectClass = "aspect-[16/9]",
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  modul?: string;
  /** Titik pandang foto (object-position). Aktifkan editor bila diisi. */
  position?: string;
  onPositionChange?: (position: string) => void;
  /** Skala foto (1–3). */
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  /** Rasio bingkai editor (mis. "aspect-[4/5]" untuk kartu). */
  aspectClass?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    posX: number;
    posY: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);

  const editable = typeof onPositionChange === "function";
  const pos = parsePosition(position);
  const z = clampZoom(zoom ?? 1);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Format harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran foto maksimal 10MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, modul);
      onChange(url);
      // Foto baru → bingkai kembali ke tengah, tanpa zoom.
      onPositionChange?.(DEFAULT_POSITION);
      onZoomChange?.(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!editing || !onPositionChange) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // pointer capture opsional
    }
    drag.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!editing || !drag.current || !onPositionChange) return;
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    // Geser foto → titik pandang bergerak berlawanan; makin besar zoom,
    // makin halus kendalinya.
    const dxFrac = (e.clientX - drag.current.x) / box.width;
    const dyFrac = (e.clientY - drag.current.y) / box.height;
    const nextX = clampPct(drag.current.posX - (dxFrac * 100) / z);
    const nextY = clampPct(drag.current.posY - (dyFrac * 100) / z);
    onPositionChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // abaikan
    }
  }

  function onWheel(e: ReactWheelEvent<HTMLDivElement>) {
    if (!editing || !onZoomChange) return;
    onZoomChange(clampZoom(round1(z + (e.deltaY < 0 ? 0.1 : -0.1))));
  }

  const frameTransform = editable
    ? {
        objectPosition: position || DEFAULT_POSITION,
        transform: `scale(${z})`,
        transformOrigin: position || DEFAULT_POSITION,
      }
    : undefined;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        aria-label="Pilih foto"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-xl border">
          <div
            ref={frameRef}
            className={`relative ${aspectClass} ${
              editing ? "cursor-grab touch-none select-none active:cursor-grabbing" : ""
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onWheel={onWheel}
          >
            <Image
              src={value}
              alt="Pratinjau foto"
              fill
              sizes="400px"
              className="object-cover"
              style={frameTransform}
              unoptimized={!value.startsWith("/")}
              draggable={false}
            />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-6 animate-spin text-white" aria-hidden />
              </div>
            ) : null}
            {editing ? (
              // Kisi rule-of-thirds sebagai bantuan komposisi.
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
              </div>
            ) : null}
          </div>

          <div className="absolute top-2 right-2 flex gap-1.5">
            {editable ? (
              <Button
                type="button"
                size="sm"
                variant={editing ? "default" : "secondary"}
                disabled={uploading}
                onClick={() => setEditing((v) => !v)}
              >
                <Move className="size-4" aria-hidden />
                {editing ? "Selesai" : "Atur gambar"}
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Ganti
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Hapus foto"
              disabled={uploading}
              onClick={() => onChange("")}
            >
              <X className="size-4" />
            </Button>
          </div>

          {editing ? (
            <div className="bg-secondary/60 space-y-2 px-3 py-2.5">
              <p className="text-muted-foreground text-xs">
                Geser foto untuk membingkai. Gunakan penggeser (atau scroll)
                untuk memperbesar.
              </p>
              <div className="flex items-center gap-2">
                <ZoomIn className="text-muted-foreground size-4 shrink-0" aria-hidden />
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.1}
                  value={z}
                  aria-label="Perbesar foto"
                  onChange={(e) =>
                    onZoomChange?.(clampZoom(Number.parseFloat(e.target.value)))
                  }
                  className="accent-primary h-1.5 flex-1 cursor-pointer"
                />
                <span className="text-muted-foreground w-9 shrink-0 text-right font-mono text-xs tabular-nums">
                  {z.toFixed(1)}×
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Setel ulang bingkai"
                  onClick={() => {
                    onPositionChange?.(DEFAULT_POSITION);
                    onZoomChange?.(1);
                  }}
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`hover:bg-secondary/50 text-muted-foreground flex ${aspectClass} w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors disabled:opacity-60`}
        >
          {uploading ? (
            <>
              <Loader2 className="size-6 animate-spin" aria-hidden />
              <span className="text-sm font-medium">Mengunggah…</span>
            </>
          ) : (
            <>
              <ImagePlus className="size-6" aria-hidden />
              <span className="text-sm font-medium">Pilih foto</span>
              <span className="text-xs">JPG, PNG, atau WebP · maks 10MB</span>
            </>
          )}
        </button>
      )}
      {error ? (
        <p role="alert" className="text-destructive mt-2 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
