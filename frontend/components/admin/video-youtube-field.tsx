import type { UseFormRegisterReturn } from "react-hook-form";
import { Video } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Field tautan video YouTube opsional, dipakai di form Destinasi, Kuliner,
 * dan Budaya. Validasi format ditangani skema zod masing-masing modul.
 */
export function VideoYoutubeField({
  registration,
  error,
  hint = "Opsional. Hanya tautan YouTube. Video tampil sebagai pemutar di halaman publik modul ini.",
}: {
  registration: UseFormRegisterReturn;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="videoYoutube" className="flex items-center gap-1.5">
        <Video className="size-4 text-red-600" aria-hidden />
        Video YouTube (opsional)
      </Label>
      <Input
        id="videoYoutube"
        type="url"
        inputMode="url"
        placeholder="https://www.youtube.com/watch?v=…"
        aria-invalid={!!error}
        {...registration}
      />
      <p className="text-muted-foreground text-xs">{hint}</p>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
