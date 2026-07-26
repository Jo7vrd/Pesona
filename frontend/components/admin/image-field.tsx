"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { uploadImage } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";

/**
 * Field foto: menerima unggahan file (JPG/PNG/WebP, maks 10MB — §8.4).
 * Di mode mock file disimpan sebagai data URL; dengan backend asli file
 * diunggah ke endpoint upload dan nilai menjadi URL publik (R2/lokal).
 * `modul` menentukan folder tujuan di storage.
 */
const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function ImageField({
  value,
  onChange,
  error,
  modul = "umum",
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  modul?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengunggah foto."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
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
          <div className="relative aspect-[16/9]">
            <Image
              src={value}
              alt="Pratinjau foto"
              fill
              sizes="400px"
              className="object-cover"
              unoptimized={!value.startsWith("/")}
            />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-6 animate-spin text-white" aria-hidden />
              </div>
            ) : null}
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5">
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
