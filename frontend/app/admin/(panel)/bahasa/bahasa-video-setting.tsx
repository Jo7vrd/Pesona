"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Video } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import { settingsSchema, type SettingsInput } from "@/lib/schemas/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const SETTINGS_KEY = ["admin", "settings"];

/**
 * Kartu pengaturan video tingkat-halaman untuk Bahasa Kei. Berbeda dari
 * modul lain, video di sini bukan per-entri kamus melainkan satu embed
 * yang tampil di halaman publik /bahasa.
 */
export function BahasaVideoSetting() {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => adminApi.settings.get(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { bahasaVideo: "" },
  });

  useEffect(() => {
    if (data) reset({ bahasaVideo: data.bahasaVideo ?? "" });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values: SettingsInput) => adminApi.settings.update(values),
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      reset({ bahasaVideo: saved.bahasaVideo ?? "" });
      toast.success("Video halaman Bahasa Kei disimpan");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="bg-card mb-6 rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <Video className="size-4.5 text-red-600" aria-hidden />
        <h2 className="font-semibold">Video halaman Bahasa Kei</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Satu video YouTube yang di-embed di halaman Bahasa Kei situs publik.
        Kosongkan untuk menyembunyikan seksi video.
      </p>

      {isPending ? (
        <Skeleton className="mt-4 h-10 w-full" />
      ) : (
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          noValidate
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="bahasaVideo" className="sr-only">
              Tautan video YouTube
            </Label>
            <Input
              id="bahasaVideo"
              type="url"
              inputMode="url"
              placeholder="https://www.youtube.com/watch?v=…"
              aria-invalid={!!errors.bahasaVideo}
              {...register("bahasaVideo")}
            />
            {errors.bahasaVideo ? (
              <p role="alert" className="text-destructive text-sm">
                {errors.bahasaVideo.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" disabled={mutation.isPending || !isDirty}>
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Menyimpan…
              </>
            ) : (
              "Simpan video"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
