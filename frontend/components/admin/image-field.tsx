"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Move, X } from "lucide-react";
import { toast } from "sonner";

import { uploadImage } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

/**
 * Field foto: menerima unggahan file (JPG/PNG/WebP, maks 10MB — §8.4).
 * Di mode mock file disimpan sebagai data URL; dengan backend asli file
 * diunggah ke endpoint upload dan nilai menjadi URL publik (R2/lokal).
 * `modul` menentukan folder tujuan di storage.
 *
 * Bila `position`/`onPositionChange` diberikan, muncul pemetik titik fokus:
 * admin klik/geser pada pratinjau untuk menandai bagian foto yang tetap
 * terlihat saat dipotong (object-cover) di kartu/hero. Non-destruktif —
 * nilainya berupa CSS object-position, mis. "50% 30%".
 */
const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_POSITION = "50% 50%";

/** Ubah "50% 30%" → {x:50,y:30}; toleran terhadap nilai kosong/rusak. */
function parsePosition(value?: string): { x: number; y: number } {
  const [x, y] = (value || DEFAULT_POSITION)
    .split(" ")
    .map((p) => Number.parseFloat(p));
  return {
    x: Number.isFinite(x) ? x : 50,
    y: Number.isFinite(y) ? y : 50,
  };
}

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

export function ImageField({
  value,
  onChange,
  error,
  modul = "umum",
  position,
  onPositionChange,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  modul?: string;
  /** Titik fokus foto (object-position). Aktifkan pemetik bila diisi. */
  position?: string;
  onPositionChange?: (position: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingFocus, setEditingFocus] = useState(false);

  const focusEnabled = typeof onPositionChange === "function";
  const pos = parsePosition(position);

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
      // Foto baru → kembalikan titik fokus ke tengah.
      onPositionChange?.(DEFAULT_POSITION);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengunggah foto."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function applyPointer(e: ReactPointerEvent<HTMLDivElement>) {
    const el = previewRef.current;
    if (!el || !onPositionChange) return;
    const rect = el.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100);
    onPositionChange(`${x}% ${y}%`);
  }

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
            ref={previewRef}
            className={`relative aspect-[16/9] ${
              editingFocus ? "cursor-crosshair touch-none" : ""
            }`}
            onPointerDown={
              editingFocus
                ? (e) => {
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {
                      // pointer capture opsional; abaikan bila tak didukung
                    }
                    applyPointer(e);
                  }
                : undefined
            }
            onPointerMove={
              editingFocus
                ? (e) => {
                    if (e.buttons === 1) applyPointer(e);
                  }
                : undefined
            }
          >
            <Image
              src={value}
              alt="Pratinjau foto"
              fill
              sizes="400px"
              className="object-cover"
              style={focusEnabled ? { objectPosition: position || DEFAULT_POSITION } : undefined}
              unoptimized={!value.startsWith("/")}
            />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-6 animate-spin text-white" aria-hidden />
              </div>
            ) : null}
            {editingFocus ? (
              <>
                {/* Kisi bantu + penanda titik fokus */}
                <div className="pointer-events-none absolute inset-0 bg-black/20" />
                <div
                  className="pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.4)]"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </div>
              </>
            ) : null}
          </div>

          <div className="absolute top-2 right-2 flex gap-1.5">
            {focusEnabled ? (
              <Button
                type="button"
                size="sm"
                variant={editingFocus ? "default" : "secondary"}
                disabled={uploading}
                onClick={() => setEditingFocus((v) => !v)}
              >
                <Move className="size-4" aria-hidden />
                {editingFocus ? "Selesai" : "Atur fokus"}
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

          {editingFocus ? (
            <p className="bg-secondary/60 text-muted-foreground px-3 py-2 text-xs">
              Klik atau geser pada foto untuk memilih bagian yang tetap
              terlihat saat dipotong di kartu/hero.
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="hover:bg-secondary/50 text-muted-foreground flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors disabled:opacity-60"
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
