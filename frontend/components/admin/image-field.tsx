"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Field foto: menerima unggahan file (JPG/PNG/WebP, maks 5MB — §8.4).
 * Di mode mock file disimpan sebagai data URL; dengan backend asli nilai
 * ini digantikan URL R2 hasil endpoint upload.
 */
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function ImageField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Format harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran foto maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
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
              unoptimized={value.startsWith("data:")}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Ganti
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Hapus foto"
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
          className="hover:bg-secondary/50 text-muted-foreground flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors"
        >
          <ImagePlus className="size-6" aria-hidden />
          <span className="text-sm font-medium">Pilih foto</span>
          <span className="text-xs">JPG, PNG, atau WebP · maks 5MB</span>
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
